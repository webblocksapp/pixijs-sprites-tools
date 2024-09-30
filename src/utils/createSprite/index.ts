import { KeyCode } from '@constants/enum';
import { Direction } from '@interfaces/Direction';
import { Frame } from '@interfaces/Frame';
import { SpriteSheet } from '@interfaces/SpriteSheet';
import { AnimatedSprite, Assets, Texture } from 'pixi.js';

export const createSprite = (sheet: SpriteSheet) => {
  const assetsPaths = sheet.assets.map((item) => item.path);
  const state: {
    frames: Array<Frame>;
    keyLogs: Array<string>;
    anim: AnimatedSprite | undefined;
    direction: Direction | undefined;
    currentAnimation: Frame | undefined;
  } = {
    frames: [],
    keyLogs: [],
    anim: undefined,
    direction: undefined,
    currentAnimation: undefined,
  };

  const loadAssets = async () => {
    await Assets.load(assetsPaths);
    const assets = Assets.get(assetsPaths);
    const frames: Frame[] = [];
    let counter = 0;

    for (let i = 0; i < Object.keys(assets).length; i++) {
      const animations = sheet.assets[i].animations;

      for (const animation of animations) {
        const frame = assets[String(i)] as { _frameKeys: string[] };
        const frameKeys = frame._frameKeys;

        for (let j = 0; j < frameKeys.length; j++) {
          const frameKey = frameKeys[j];
          if (frames[counter]) {
            frames[counter].textures.push(Texture.from(frameKey));
          } else {
            frames[counter] = {
              keyCode: animation.keyCode,
              speed: animation.speed,
              default: animation.default,
              direction: animation.direction,
              textures: [Texture.from(frameKey)],
            };
          }
        }

        counter++;
      }
    }

    state.frames = frames;
  };

  const flipSprite = (direction: Direction | undefined) => {
    if (state.anim === undefined) {
      console.warn('No animation found to flip.');
    } else if (state.anim && (direction === 'right' || direction === 'left')) {
      state.anim.scale.x = direction === 'right' ? 1 : -1;
    } else {
      state.anim.scale.x = 1;
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
      state.keyLogs.push(event.code);

      if (state.currentAnimation === undefined) {
        console.warn('No animation frame found');
      } else if (event.code === KeyCode.ArrowRight) {
        state.direction = state.currentAnimation.direction;
      } else if (event.key === KeyCode.ArrowLeft) {
        state.direction = state.currentAnimation.direction;
      }

      if (state.currentAnimation) {
        flipSprite(state.direction);
        setAnimation(
          state.currentAnimation.textures,
          state.currentAnimation.speed
        );
      }
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    state.keyLogs = state.keyLogs.filter((keyCode) => event.code !== keyCode);

    if (state.keyLogs.length === 0) {
      const animation = state.frames.find((item) => item.default);
      if (animation) setAnimation(animation.textures, animation.speed);
    }
  };

  const initialize = async () => {
    await loadAssets();
    const defaultFrames = state.frames.find((item) => item.default);
    if (defaultFrames === undefined) {
      throw new Error('No default animation assigned inside the SpriteSheet.');
    }
    state.anim = new AnimatedSprite(defaultFrames.textures);
    state.anim.anchor.set(0.5);
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
