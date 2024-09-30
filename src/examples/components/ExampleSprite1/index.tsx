import React, { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import { createSprite } from '@utils/createSprite';
import { KeyCode } from '@constants/enum';

export const ExampleSprite1: React.FC = () => {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  const cleanScene = () => {
    if (appRef.current) {
      if (pixiContainer.current && appRef.current.canvas) {
        pixiContainer.current.removeChild(appRef.current.canvas);
        appRef.current.destroy(true, { children: true });
      }
      appRef.current = null;
    }
  };

  const startScene = async () => {
    const app = new Application();
    await app.init({
      backgroundColor: 'white',
      width: 500,
      height: 500,
    });
    appRef.current = app;

    if (pixiContainer.current) {
      pixiContainer.current.appendChild(app.canvas);
    }
  };

  useEffect(() => {
    (async () => {
      cleanScene();
      await startScene();

      const sprite = createSprite({
        assets: [
          {
            path: '/assets/sprites-sheets/shinobi/walk/data.json',
            animations: [
              {
                keyCode: KeyCode.ArrowRight,
                direction: 'right',
                label: 'shinobi-walk',
                numberOfFrames: 8,
                speed: 0.2,
                default: true,
              },
              {
                keyCode: KeyCode.ArrowRight,
                direction: 'left',
                label: 'shinobi-walk',
                numberOfFrames: 8,
                speed: 0.2,
                default: false,
              },
            ],
          },
        ],
      });

      await sprite.initialize();

      if (appRef.current && sprite.data.anim) {
        appRef.current.stage.addChild(sprite.data.anim);
      }

      sprite.initEventListeners();

      return () => {
        sprite.removeEventListeners();
      };
    })();
  }, []);

  return <div ref={pixiContainer} style={{ width: 500, height: 500 }}></div>;
};
