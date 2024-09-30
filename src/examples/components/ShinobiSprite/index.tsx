import React, { useEffect, useRef } from 'react';
import { Application, Assets, AnimatedSprite, Texture } from 'pixi.js';

export const ShinobiSprite: React.FC = () => {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const animRef = useRef<AnimatedSprite | null>(null);
  const walkFrames = useRef<Texture[]>([]);
  const idleFrames = useRef<Texture[]>([]);
  const direction = useRef<'right' | 'left'>('right');

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

  const loadAssets = async () => {
    await Assets.load([
      '/assets/sprites-sheets/shinobi/walk/data.json',
      '/assets/sprites-sheets/shinobi/idle/data.json',
    ]);

    for (let i = 0; i < 8; i++) {
      walkFrames.current.push(Texture.from(`shinobi-walk-${i}.png`));
    }

    for (let i = 0; i < 6; i++) {
      idleFrames.current.push(Texture.from(`shinobi-idle-${i}.png`));
    }
  };

  const flipSprite = (direction: 'right' | 'left') => {
    if (animRef.current) {
      animRef.current.scale.x = direction === 'right' ? 1 : -1;
    }
  };

  const setAnimation = (frames: Texture[], speed: number) => {
    if (animRef.current) {
      animRef.current.textures = frames;
      animRef.current.animationSpeed = speed;
      animRef.current.play();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'ArrowRight' && !event.repeat) {
      direction.current = 'right';
      flipSprite('right');
      setAnimation(walkFrames.current, 0.2);
    } else if (event.code === 'ArrowLeft' && !event.repeat) {
      direction.current = 'left';
      flipSprite('left');
      setAnimation(walkFrames.current, 0.2);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      setAnimation(idleFrames.current, 0.1);
    }
  };

  useEffect(() => {
    (async () => {
      cleanScene();
      await startScene();
      await loadAssets();

      const anim = new AnimatedSprite(idleFrames.current);
      anim.x = appRef.current!.screen.width / 2;
      anim.y = appRef.current!.screen.height / 2;
      anim.anchor.set(0.5);
      anim.animationSpeed = 0.1;
      anim.play();

      animRef.current = anim;

      if (appRef.current) {
        appRef.current.stage.addChild(anim);
      }

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    })();
  }, []);

  return <div ref={pixiContainer} style={{ width: 500, height: 500 }}></div>;
};
