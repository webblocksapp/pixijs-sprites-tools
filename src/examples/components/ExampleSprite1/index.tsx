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
    const sprite = createSprite(
      {
        assets: [
          {
            path: '/assets/sprites-sheets/shinobi/walk/data.json',
            animations: [
              {
                keysCodesCombination: KeyCode.D,
                direction: 'right',
                speed: 0.2,
                default: false,
              },
              {
                keysCodesCombination: KeyCode.A,
                direction: 'left',
                speed: 0.2,
                default: false,
              },
            ],
          },
          {
            path: '/assets/sprites-sheets/shinobi/idle/data.json',
            animations: [
              {
                speed: 0.2,
                default: true,
              },
            ],
          },
          {
            path: '/assets/sprites-sheets/shinobi/attack-1/data.json',
            animations: [
              {
                keysCodesCombination: KeyCode.G,
                speed: 0.2,
                default: false,
                wait: true,
              },
            ],
          },
        ],
      },
      { app: appRef.current, debug: true }
    );

    (async () => {
      cleanScene();
      await startScene();
      await sprite.initialize();

      if (appRef.current && sprite.data.anim) {
        appRef.current.stage.addChild(sprite.data.anim);
        sprite.data.anim.x = appRef.current!.screen.width / 2;
        sprite.data.anim.y = appRef.current!.screen.height / 2;
      }

      sprite.initEventListeners();
      sprite.onKeyLogsChange((logs) => {
        console.log(logs);
      });
    })();

    return () => {
      sprite.removeEventListeners();
    };
  }, []);

  return <div ref={pixiContainer} style={{ width: 500, height: 500 }}></div>;
};
