import React, { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';
import { createSprite } from '@utils/createSprite';
import { SpriteSheet } from '@interfaces/SpriteSheet';

export const ExampleSprite1: React.FC<{ spriteSheet: SpriteSheet }> = ({
  spriteSheet,
}) => {
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
    const sprite = createSprite(spriteSheet, { debug: true });

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
