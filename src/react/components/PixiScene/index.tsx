import { createSprite, Sprite, SpriteSheet } from 'pixijs-sprites-tools';
import { Application, ApplicationOptions } from 'pixi.js';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

export interface PixiSceneProps {
  alwaysKeepKeyboardEvents?: boolean;
  options?: Partial<ApplicationOptions>;
  style?: React.CSSProperties;
  spriteAutoSize?: boolean;
  disableSpritesDisplacement?: boolean;
}

export type PixiSceneHandle = {
  addSpritesIntoScene: (spriteSheets: Array<SpriteSheet>) => Promise<void>;
  destroyScene: () => void;
  resetScene: () => Promise<void>;
  resizeScene: (args: { width: number; height: number }) => void;
  setSceneScale: (percentage: number) => void;
  getSprites: () => Array<Sprite>;
};

export const PixiScene = forwardRef<PixiSceneHandle, PixiSceneProps>(
  (
    {
      options,
      style,
      alwaysKeepKeyboardEvents,
      spriteAutoSize,
      disableSpritesDisplacement = false,
    },
    ref
  ) => {
    const pixiContainer = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const spritesRef = useRef<Array<Sprite>>([]);
    const mountedRef = useRef<boolean>(false);

    const destroyScene = () => {
      if (appRef.current) {
        if (pixiContainer.current && appRef.current.canvas) {
          pixiContainer.current.removeChild(appRef.current.canvas);
          appRef.current.destroy(true);
        }
        appRef.current = null;
      }
    };

    const resizeScene: PixiSceneHandle['resizeScene'] = (args) => {
      if (appRef.current === null) return;
      appRef.current.renderer.resize(args.width, args.height);
    };

    const startScene = async () => {
      const app = new Application();
      await app.init(options);
      appRef.current = app;

      if (pixiContainer.current) {
        pixiContainer.current.appendChild(app.canvas);
      }
    };

    const resizeSpriteToScene = (sprite: Sprite) => {
      if (appRef.current === null) return;

      const sceneWidth = appRef.current.screen.width;
      const sceneHeight = appRef.current.screen.height;
      const animatedSprite = sprite.data.anim;

      let directionX = 1;
      let directionY = 1;

      if (sprite.data.direction) {
        if (['left', 'right'].includes(sprite.data.direction)) {
          directionX = sprite.data.direction === 'left' ? -1 : 1;
        }
        if (['up', 'down'].includes(sprite.data.direction)) {
          directionY = sprite.data.direction === 'down' ? -1 : 1;
        }
      }

      if (animatedSprite) {
        const scaleX = sceneWidth / animatedSprite.texture.width;
        const scaleY = sceneHeight / animatedSprite.texture.height;
        const scaleFactor = Math.min(scaleX, scaleY);

        animatedSprite.scale.x = scaleFactor * directionX;
        animatedSprite.scale.y = scaleFactor * directionY;
      }
    };

    const addSpritesIntoScene: PixiSceneHandle['addSpritesIntoScene'] = async (
      spritesSheets
    ) => {
      const promises: Array<Promise<Sprite>> = [];

      if (mountedRef.current === false) {
        await new Promise((resolve, reject) => {
          try {
            setInterval(() => {
              if (mountedRef.current) {
                resolve(undefined);
              }
            }, 100);
          } catch (error) {
            reject(error);
          }
        });
      }

      for (const spriteSheet of spritesSheets) {
        const sprite = createSprite(spriteSheet);
        promises.push(
          new Promise(async (resolve, reject) => {
            try {
              await sprite.initialize();
              resolve(sprite);
            } catch (error) {
              reject(error);
            }
          })
        );
      }

      const sprites = await Promise.all(promises);
      spritesRef.current = [...spritesRef.current, ...sprites];

      alwaysKeepKeyboardEvents && initSpritesEventListeners();

      if (appRef.current) {
        for (const sprite of spritesRef.current) {
          if (sprite.data.anim === undefined) continue;
          appRef.current.stage.addChild(sprite.data.anim);
          const x = Number(sprite.data.xPosition);
          const y = Number(sprite.data.yPosition);
          sprite.data.anim.x = isNaN(x) ? appRef.current!.screen.width / 2 : x;
          sprite.data.anim.y = isNaN(y) ? appRef.current!.screen.height / 2 : y;
          spriteAutoSize && resizeSpriteToScene(sprite);
        }
      }
    };

    const initSpritesEventListeners = () => {
      for (const sprite of spritesRef.current) {
        sprite.initEventListeners();
      }
    };

    const removeSpritesEventListeners = () => {
      for (const sprite of spritesRef.current) {
        sprite.removeEventListeners();
      }
    };

    const destroySprites = () => {
      for (const sprite of spritesRef.current) {
        sprite.data.anim?.texture.destroy(true);
      }
    };

    const cleanRefs = () => {
      appRef.current = null;
      spritesRef.current = [];
    };

    const resetScene = async () => {
      if (mountedRef.current) {
        unmount();
        await mount();
      }
    };

    const mount = async () => {
      await startScene();
      initGameLoop();
      mountedRef.current = true;
    };

    const setSceneScale: PixiSceneHandle['setSceneScale'] = (percentage) => {
      if (appRef.current === null) return;
      const scaleFactor = 1 * (percentage / 100);
      appRef.current.stage.scale.set(scaleFactor);
    };

    const unmount = () => {
      destroyScene();
      removeSpritesEventListeners();
      destroySprites();
      cleanRefs();
      mountedRef.current = false;
    };

    const onFocusScene = () => {
      removeSpritesEventListeners();
      initSpritesEventListeners();
    };

    const onBlurScene = () => {
      removeSpritesEventListeners();
    };

    const getSprites: PixiSceneHandle['getSprites'] = () => spritesRef.current;

    const addSpritesDisplacement = () => {
      for (const sprite of spritesRef.current) {
        const { anim } = sprite.data;
        const { xDisplacement, yDisplacement } =
          sprite.data.currentAnimation || {};

        if (anim) {
          if (xDisplacement) {
            anim.x += Number(xDisplacement);
          }
          if (yDisplacement) {
            anim.y += Number(yDisplacement);
          }
        }
      }
    };

    const initGameLoop = () => {
      appRef.current?.ticker.add(() => {
        !disableSpritesDisplacement && addSpritesDisplacement();
      });
    };

    useImperativeHandle(ref, () => ({
      addSpritesIntoScene,
      destroyScene,
      resetScene,
      resizeScene,
      setSceneScale,
      getSprites,
    }));

    useEffect(() => {
      if (options?.width && options?.height) {
        resizeScene({ width: options.width, height: options.height });
      }
    }, [options?.width, options?.height]);

    useEffect(() => {
      mount();

      return () => {
        unmount();
      };
    }, []);

    return (
      <div
        onMouseEnter={alwaysKeepKeyboardEvents ? undefined : onFocusScene}
        onMouseLeave={alwaysKeepKeyboardEvents ? undefined : onBlurScene}
        ref={pixiContainer}
        style={{ width: options?.width, height: options?.height, ...style }}
      />
    );
  }
);
