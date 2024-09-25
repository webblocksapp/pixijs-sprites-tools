import React, { useEffect, useRef } from 'react';
import { Application, Assets, AnimatedSprite, Texture } from 'pixi.js';

export const RunningDogSprite: React.FC = () => {
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
    appRef.current = app;

    await app.init({
      background: '#1099bb',
      width: 500,
      height: 500,
    });

    if (pixiContainer.current) {
      pixiContainer.current.appendChild(app.canvas);
    }
  };

  useEffect(() => {
    (async () => {
      cleanScene();
      await startScene();
      await Assets.load('/assets/sprites-sheets/running-dog/data.json');
      const frames = [];

      for (let i = 1; i <= 6; i++) {
        frames.push(Texture.from(`${i}.png`));
      }

      console.log(frames);

      const anim = new AnimatedSprite(frames);

      if (appRef.current) {
        anim.x = appRef.current.screen.width / 2;
        anim.y = appRef.current.screen.height / 2;
        anim.anchor.set(0.5);
        anim.animationSpeed = 0.3;
        anim.play();

        appRef.current.stage.addChild(anim);
      }
    })();
  }, []);

  return <div ref={pixiContainer} style={{ width: 500, height: 500 }}></div>;
};
