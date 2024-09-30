import { KeyCode } from '@constants/enum';
import { Direction } from '@interfaces/Direction';
import { Frame } from '@interfaces/Frame';
import { SpriteSheet } from '@interfaces/SpriteSheet';
import { AnimatedSprite, Assets, Texture } from 'pixi.js';

export const createSprite = (sheet: SpriteSheet) => {
  const assetsPaths = sheet.assets.map((item) => item.path);
  const state: {
    frames: Array<Frame>;
    anim: AnimatedSprite | undefined;
    direction: Direction | undefined;
    currentAnimation: Frame | undefined;
  } = {
    frames: [],
    anim: undefined,
    direction: undefined,
    currentAnimation: undefined,
  };

  const loadAssets = async () => {
    await Assets.load(assetsPaths);

    for (const asset of sheet.assets) {
      for (const animation of asset.animations) {
        for (let i = 0; i < animation.numberOfFrames; i++) {
          const frame = state.frames.find(
            (item) => item.label === animation.label
          );
          if (frame) {
            frame.textures.push(Texture.from(`${animation.label}-${i}.png`));
          } else {
            state.frames.push({
              label: animation.label,
              keyCode: animation.keyCode,
              speed: animation.speed,
              default: animation.default,
              direction: animation.direction,
              textures: [Texture.from(`${animation.label}-${i}.png`)],
            });
          }
        }
      }
    }
  };

  const flipSprite = (direction: Direction | undefined) => {
    if (state.anim === undefined) {
      console.warn('No animation found to flip.');
    } else if (state.anim && (direction === 'right' || direction === 'left')) {
      state.anim.x = direction === 'right' ? 1 : -1;
    } else {
      state.anim.x = 1;
    }
  };

  const findAnimation = (keycode: KeyCode) => {
    return state.frames.find((item) => item.keyCode === keycode);
  };

  const setAnimation = (
    frames: Texture[] | undefined,
    speed: number | undefined
  ) => {
    if (frames === undefined) {
      console.warn('Undefined frames.');
    } else if (speed === undefined) {
      console.warn('Undefined animation speed.');
    } else if (state.anim) {
      state.anim.textures = frames;
      state.anim.animationSpeed = speed;
      state.anim.play();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!event.repeat) {
      state.currentAnimation = findAnimation(event.code as KeyCode);
    }

    if (state.currentAnimation === undefined) {
      console.warn('No animation frame found');
    } else if (event.code === KeyCode.ArrowRight && !event.repeat) {
      state.direction = state.currentAnimation.direction;
    } else if (event.key === KeyCode.ArrowLeft && !event.repeat) {
      state.direction = state.currentAnimation.direction;
    }

    if (state.currentAnimation) {
      flipSprite(state.direction);
      setAnimation(
        state.currentAnimation.textures,
        state.currentAnimation.speed
      );
    }
  };

  const onKeyUp = () => {};

  const initialize = async () => {
    await loadAssets();
    const defaultFrames = state.frames.find((item) => item.default);
    if (defaultFrames === undefined) {
      throw new Error('No default animation assigned inside the SpriteSheet.');
    }
    console.log(defaultFrames.textures);
    state.anim = new AnimatedSprite(defaultFrames.textures);
  };

  const initEventListeners = () => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
  };

  const removeEventListeners = () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };

  return {
    initialize,
    initEventListeners,
    removeEventListeners,
    data: state,
  };
};
