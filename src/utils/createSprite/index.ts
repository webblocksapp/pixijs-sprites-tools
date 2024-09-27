import { AnimatedSprite, Assets, Texture } from 'pixi.js';

type SpriteSheet = {
  assets: Array<{
    path: string;
    animations: [
      {
        label: string;
        numberOfFrames: number;
        type: 'movement' | 'action' | 'transition';
        keyboardKey: string;
        flip: boolean;
        default: boolean;
        speed: number;
      }
    ];
  }>;
};
type Frame = {
  label: string;
  keyboardKey: string;
  textures: Texture[];
  speed: number;
  default: boolean;
};

export const createSprite = (sheet: SpriteSheet) => {
  const assetsPaths = sheet.assets.map((item) => item.path);
  const state: {
    frames: Array<Frame>;
    anim: AnimatedSprite | null;
  } = { frames: [], anim: null };

  const loadAssets = async () => {
    await Assets.load(assetsPaths);

    for (const asset of sheet.assets) {
      for (const animation of asset.animations) {
        for (let i = 0; i < animation.numberOfFrames; i++) {
          let frame = state.frames.find(
            (item) => item.label === animation.label
          );
          if (frame) {
            frame.textures.push(Texture.from(`${animation.label}-${i}.png`));
          } else {
            state.frames.push({
              label: animation.label,
              keyboardKey: animation.keyboardKey,
              speed: animation.speed,
              default: animation.default,
              textures: [Texture.from(`${animation.label}-${i}.png`)],
            });
          }
        }
      }
    }
  };

  const onKeyDown = () => {};

  const onKeyUp = () => {};

  const initialize = async () => {
    await loadAssets();
    const defaultFrames = state.frames.find((item) => item.default);
    if (defaultFrames === undefined) {
      throw new Error('No default animation assigned inside the SpriteSheet.');
    }
    new AnimatedSprite(defaultFrames.textures);
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
  };
};
