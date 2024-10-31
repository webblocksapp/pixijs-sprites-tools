import { FrameType, KeyCode } from '@constants/enum';
import { Direction } from '@interfaces/Direction';
import { Animation } from '@interfaces/Animation';
import { SpriteSheet } from '@interfaces/SpriteSheet';
import { animationDurationInMs } from '@utils/animationDuration';
import { urlIsRelative } from '@utils/urlIsRelative';
import { AnimatedSprite, Spritesheet, Texture } from 'pixi.js';
import { v4 as uuid } from 'uuid';

export const createSprite = (
  sheet: SpriteSheet,
  params?: { debug?: boolean }
) => {
  const { webDomain } = sheet;
  const { debug } = params || {};
  const state: {
    animations: Array<Animation>;
    keyLogs: Array<string>;
    anim: AnimatedSprite | undefined;
    direction: Direction | undefined;
    currentAnimation: Animation | undefined;
    waitingAnimation: boolean;
    onKeyLogsChange: ((keys: Array<string>) => void) | undefined;
    prevPressedKey: string | undefined;
    lastPressedKey: string | undefined;
    displacementId: NodeJS.Timeout | undefined;
  } = {
    animations: [],
    keyLogs: [],
    anim: undefined,
    direction: undefined,
    currentAnimation: undefined,
    waitingAnimation: false,
    onKeyLogsChange: undefined,
    prevPressedKey: undefined,
    lastPressedKey: undefined,
    displacementId: undefined,
  };

  const createTextureFromImageUrl = (url: string): Promise<Texture> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.crossOrigin = '';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D context from canvas.'));
          return;
        }

        ctx.drawImage(image, 0, 0);
        const texture = Texture.from(canvas);

        resolve(texture);
      };
      image.onerror = (error) => {
        reject(error);
      };
    });
  };

  const createTextureImageUrl = (imageUrl: string) => {
    if (webDomain && urlIsRelative(imageUrl)) {
      console.log(
        `${webDomain.replace(/\/$/, '')}/${imageUrl.replace(/^\//, '')}`
      );
      return `${webDomain.replace(/\/$/, '')}/${imageUrl.replace(/^\//, '')}`;
    }
    return imageUrl;
  };

  const loadAssets = async () => {
    const promises: Array<Promise<Record<string, Texture> | undefined>> = [];

    for (const asset of sheet.assets) {
      promises.push(
        new Promise(async (resolve, reject) => {
          try {
            if (asset.framesMap === undefined) {
              resolve(undefined);
            } else {
              const textureImageUrl = createTextureImageUrl(
                asset.framesMap.meta.image
              );
              const texture = await createTextureFromImageUrl(textureImageUrl);
              const sheet = new Spritesheet(texture, asset.framesMap);
              resolve(await sheet.parse());
            }
          } catch (error) {
            reject(error);
          }
        })
      );
    }

    return await Promise.all(promises);
  };

  const generateAnimations = async () => {
    const assets = await loadAssets();
    const animations: Animation[] = [];
    let counter = 0;

    for (let i = 0; i < sheet.assets.length; i++) {
      const asset = assets[i];

      if (asset === undefined) continue;

      for (const animation of sheet.assets[i].animations) {
        const animationKeys = Object.keys(asset);
        for (const animationKey of animationKeys) {
          const texture = asset[animationKey];
          if (animations[counter]) {
            animations[counter].textures.push(texture);
          } else {
            animations[counter] = {
              keysCodesCombination: animation.keysCodesCombination,
              speed: animation.speed,
              default: animation.default,
              direction: animation.direction,
              wait: animation.wait,
              type: animation.type,
              label: animation.label,
              xDisplacement: animation.xDisplacement,
              yDisplacement: animation.yDisplacement,
              textures: [texture],
            };
          }
        }

        counter++;
      }
    }

    state.animations = animations;
  };

  const flipSprite = (direction: Direction | undefined) => {
    if (state.anim === undefined) {
      warn('No animation found to flip.');
      return;
    }

    const x = state.anim.scale.x;

    if (direction === 'right' && x < 0) {
      state.anim.scale.x = x * -1;
    } else if (direction === 'left' && x >= 0) {
      state.anim.scale.x = x * -1;
    }
  };

  const findAnimation = (keysCodesCombination: string) => {
    return state.animations.find(
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

  const logKey = (keyCode: string) => {
    if (state.keyLogs.some((item) => item === keyCode)) return;
    state.keyLogs.push(keyCode);
  };

  const unlogKey = (keyCode: string) => {
    state.keyLogs = state.keyLogs.filter((item) => keyCode !== item);
  };

  const setPrevPressedKey = (keyCode: string) => {
    state.prevPressedKey = keyCode;
  };

  const setLastPressedKey = (keyCode: string) => {
    state.lastPressedKey = keyCode;
  };

  const setWaitingAnimation = (flag: boolean) => {
    state.waitingAnimation = flag;
  };

  const runAnimation = (keyCode: string) => {
    if (state.waitingAnimation) {
      warn('Waiting animation');
      return;
    }

    state.currentAnimation = findAnimation(keyCode);
    logKey(keyCode);
    state.onKeyLogsChange?.(state.keyLogs);

    if (state.currentAnimation === undefined) {
      warn('No animation frame found');
    } else {
      updateAnimationDirection();
      flipSprite(state.direction);
      setAnimation(
        state.currentAnimation.textures,
        state.currentAnimation.speed
      );

      if (state.currentAnimation.type === FrameType.Action) {
        setWaitingAnimation(true);
        const { textures, speed } = state.currentAnimation;
        const animationDuration = animationDurationInMs({
          numberOfFrames: textures.length,
          speed,
        });

        setTimeout(() => {
          setWaitingAnimation(false);
          setDefaultAnimation();
          const lastKey = getLastKey();
          if (lastKey) runAnimation(lastKey);
        }, animationDuration);
      }
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!event.repeat) {
      if (
        state.prevPressedKey !== event.code &&
        state.lastPressedKey !== event.code
      ) {
        setWaitingAnimation(false);
      }

      setPrevPressedKey(event.code);
      runAnimation(event.code as KeyCode);
    }
  };

  const setDefaultAnimation = () => {
    const animation = state.animations.find((item) => item.default);
    if (animation) setAnimation(animation.textures, animation.speed);
  };

  const getLastKey = () => {
    return state.keyLogs.slice(-1)[0];
  };

  const onKeyLogsChange = (fn: (keys: Array<string>) => void) =>
    (state.onKeyLogsChange = fn);

  const onKeyUp = (event: KeyboardEvent) => {
    setLastPressedKey(event.code);
    unlogKey(event.code);
    const lastKey = getLastKey();
    state.onKeyLogsChange?.(state.keyLogs);
    setPrevPressedKey(lastKey);

    if (state.waitingAnimation) return;
    if (lastKey) {
      return runAnimation(lastKey);
    }
    if (state.keyLogs.length === 0) {
      setDefaultAnimation();
    }
  };

  const initialize = async () => {
    await generateAnimations();
    const defaultFrames = state.animations.find((item) => item.default);
    if (defaultFrames === undefined) {
      throw new Error('No default animation assigned inside the SpriteSheet.');
    }
    state.anim = new AnimatedSprite(defaultFrames.textures);
    state.anim.anchor.set(0.5);
    state.anim.animationSpeed = defaultFrames.speed;
    state.direction = defaultFrames.direction;
    flipSprite(defaultFrames.direction);
    state.anim.play();
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
    id: sheet.id || uuid(),
    name: sheet.name,
    initialize,
    initEventListeners,
    removeEventListeners,
    onKeyLogsChange,
    data: state,
  };
};
