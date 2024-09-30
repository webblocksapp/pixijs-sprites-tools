import { KeyCode } from '@constants/enum';
import { Direction } from '@interfaces/Direction';
import { Frame } from '@interfaces/Frame';
import { SpriteSheet } from '@interfaces/SpriteSheet';
import { animationDurationInMs } from '@utils/animationDuration';
import { AnimatedSprite, Application, Assets, Texture } from 'pixi.js';

export const createSprite = (
  sheet: SpriteSheet,
  params: { app: Application | null; debug?: boolean }
) => {
  const { app, debug } = params;
  const assetsPaths = sheet.assets.map((item) => item.path);
  const state: {
    frames: Array<Frame>;
    keyLogs: Array<string>;
    anim: AnimatedSprite | undefined;
    direction: Direction | undefined;
    currentAnimation: Frame | undefined;
    waitingAnimation: boolean;
  } = {
    frames: [],
    keyLogs: [],
    anim: undefined,
    direction: undefined,
    currentAnimation: undefined,
    waitingAnimation: false,
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
              keysCodesCombination: animation.keysCodesCombination,
              speed: animation.speed,
              default: animation.default,
              direction: animation.direction,
              wait: animation.wait,
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
      warn('No animation found to flip.');
    } else if (state.anim && (direction === 'right' || direction === 'left')) {
      state.anim.scale.x = direction === 'right' ? 1 : -1;
    } else {
      state.anim.scale.x = 1;
    }
  };

  const findAnimation = (keysCodesCombination: string) => {
    return state.frames.find(
      (item) => item.keysCodesCombination === keysCodesCombination
    );
  };

  const setAnimation = (
    frames: Texture[] | undefined,
    speed: number | undefined
  ) => {
    if (frames === undefined) {
      warn('Undefined frames.');
    } else if (speed === undefined) {
      warn('Undefined animation speed.');
    } else if (state.anim) {
      state.anim.textures = frames;
      state.anim.animationSpeed = speed;
      state.anim.play();
    }
  };

  const updateAnimationDirection = () => {
    const direction = state.currentAnimation?.direction;
    if (direction) {
      state.direction = direction;
    }
  };

  const runAnimation = (keyCode: KeyCode) => {
    if (state.waitingAnimation) {
      warn('Waiting animation');
      return;
    }

    state.currentAnimation = findAnimation(keyCode);
    state.keyLogs.push(keyCode);

    if (state.currentAnimation === undefined) {
      warn('No animation frame found');
    } else {
      updateAnimationDirection();
      flipSprite(state.direction);
      setAnimation(
        state.currentAnimation.textures,
        state.currentAnimation.speed
      );

      if (state.currentAnimation?.wait) {
        state.waitingAnimation = true;
        const { textures, speed } = state.currentAnimation;

        setTimeout(() => {
          state.waitingAnimation = false;
          setDefaultAnimation();
        }, animationDurationInMs({ numberOfFrames: textures.length, speed, fps: app?.ticker.FPS || 60 }));
      }
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!event.repeat) {
      runAnimation(event.code as KeyCode);
    }
  };

  const setDefaultAnimation = () => {
    const animation = state.frames.find((item) => item.default);
    if (animation) setAnimation(animation.textures, animation.speed);
  };

  const onKeyUp = (event: KeyboardEvent) => {
    state.keyLogs = state.keyLogs.filter((keyCode) => event.code !== keyCode);
    if (state.waitingAnimation) return;
    if (state.keyLogs.length === 0) {
      setDefaultAnimation();
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

  const warn: typeof console.log = (...args) => {
    debug && console.warn(...args);
  };

  return {
    initialize,
    initEventListeners,
    removeEventListeners,
    data: state,
  };
};
