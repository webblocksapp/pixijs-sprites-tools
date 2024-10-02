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
            framesMap: {
              frames: {
                '0.png': {
                  frame: { x: 0, y: 0, w: 128, h: 128 },
                },
                '1.png': {
                  frame: { x: 128, y: 0, w: 128, h: 128 },
                },
                '2.png': {
                  frame: { x: 256, y: 0, w: 128, h: 128 },
                },
                '3.png': {
                  frame: { x: 384, y: 0, w: 128, h: 128 },
                },
                '4.png': {
                  frame: { x: 512, y: 0, w: 128, h: 128 },
                },
                '5.png': {
                  frame: { x: 640, y: 0, w: 128, h: 128 },
                },
                '6.png': {
                  frame: { x: 768, y: 0, w: 128, h: 128 },
                },
                '7.png': {
                  frame: { x: 896, y: 0, w: 128, h: 128 },
                },
              },
              meta: {
                image: '/assets/sprites-sheets/shinobi/walk/main.png',
                scale: 1,
              },
            },
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
            framesMap: {
              frames: {
                '0.png': {
                  frame: { x: 0, y: 0, w: 128, h: 128 },
                },
                '1.png': {
                  frame: { x: 128, y: 0, w: 128, h: 128 },
                },
                '2.png': {
                  frame: { x: 256, y: 0, w: 128, h: 128 },
                },
                '3.png': {
                  frame: { x: 384, y: 0, w: 128, h: 128 },
                },
                '4.png': {
                  frame: { x: 512, y: 0, w: 128, h: 128 },
                },
                '5.png': {
                  frame: { x: 640, y: 0, w: 128, h: 128 },
                },
              },
              meta: {
                image: '/assets/sprites-sheets/shinobi/idle/main.png',
                scale: 1,
              },
            },
            animations: [
              {
                speed: 0.2,
                default: true,
              },
            ],
          },
          {
            framesMap: {
              frames: {
                '0.png': {
                  frame: { x: 0, y: 0, w: 128, h: 128 },
                },
                '1.png': {
                  frame: { x: 128, y: 0, w: 128, h: 128 },
                },
                '2.png': {
                  frame: { x: 256, y: 0, w: 128, h: 128 },
                },
                '3.png': {
                  frame: { x: 384, y: 0, w: 128, h: 128 },
                },
                '4.png': {
                  frame: { x: 512, y: 0, w: 128, h: 128 },
                },
              },
              meta: {
                image: '/assets/sprites-sheets/shinobi/attack-1/main.png',
                scale: 1,
              },
            },
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
