import type { Meta, StoryObj } from '@storybook/react';
import { PixiScene, PixiSceneHandle } from '.';
import { FrameType, KeyCode, SpriteSheet } from 'pixijs-sprites-tools';
import { useEffect, useRef } from 'react';

const meta: Meta<typeof PixiScene> = {
  title: 'Layout Components/PixiScene',
  component: PixiScene,
};

type Story = StoryObj<typeof PixiScene>;
export default meta;

const SPRITE_SHEET_1: SpriteSheet = {
  assets: [
    {
      label: 'Walk',
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
          imageData: {
            width: 0,
            height: 0,
          },
          numRows: 0,
          numCols: 0,
        },
      },
      animations: [
        {
          label: 'Walk right',
          keysCodesCombination: KeyCode.D,
          direction: 'right',
          speed: 0.2,
          default: false,
          type: FrameType.Movement,
        },
        {
          label: 'Walk left',
          keysCodesCombination: KeyCode.A,
          direction: 'left',
          speed: 0.2,
          default: false,
          type: FrameType.Movement,
        },
      ],
    },
    {
      label: 'Idle',
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
          imageData: {
            width: 0,
            height: 0,
          },
          numRows: 0,
          numCols: 0,
        },
      },
      animations: [
        {
          speed: 0.2,
          default: true,
          type: FrameType.Action,
          direction: 'left',
        },
      ],
    },
    {
      label: 'Attack 1',
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
          imageData: {
            width: 0,
            height: 0,
          },
          numRows: 0,
          numCols: 0,
        },
      },
      animations: [
        {
          keysCodesCombination: KeyCode.G,
          speed: 0.2,
          default: false,
          wait: true,
          type: FrameType.Action,
        },
      ],
    },
  ],
};

export const Overview: Story = {
  render: () => {
    const pixiSceneRef = useRef<PixiSceneHandle>(null);

    useEffect(() => {
      pixiSceneRef.current?.addSpritesIntoScene([SPRITE_SHEET_1]);
    }, []);

    return (
      <PixiScene
        ref={pixiSceneRef}
        options={{ width: 300, height: 300, background: 'pink' }}
      />
    );
  },
};
