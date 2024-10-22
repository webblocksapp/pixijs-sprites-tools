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
}

export type PixiSceneHandle = {
  addSpritesIntoScene: (spriteSheets: Array<SpriteSheet>) => Promise<void>;
  destroyScene: () => void;
  resetScene: () => Promise<void>;
};

export const PixiScene = forwardRef<PixiSceneHandle, PixiSceneProps>(
  ({ options, style, alwaysKeepKeyboardEvents, spriteAutoSize }, ref) => {
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
        const scaleX = (sceneWidth / animatedSprite.texture.width) * directionX;
        const scaleY =
          (sceneHeight / animatedSprite.texture.height) * directionY;

        const scale = Math.min(scaleX, scaleY);
        console.log(scale, scaleX, scaleY);
        animatedSprite.scale.set(scale);
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
          sprite.data.anim.x = appRef.current!.screen.width / 2;
          sprite.data.anim.y = appRef.current!.screen.height / 2;
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
      mountedRef.current = true;
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

    useImperativeHandle(ref, () => ({
      addSpritesIntoScene,
      destroyScene,
      resetScene,
    }));

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
