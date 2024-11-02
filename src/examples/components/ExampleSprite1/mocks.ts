import { AnimationType, Direction, KeyCode } from '@constants/enum';
import { SpriteSheet } from '@interfaces/SpriteSheet';

export const SHINOBI_SPRITE: SpriteSheet = {
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
          imageData: { width: 0, height: 0 },
          image: '/assets/sprites-sheets/shinobi/walk/main.png',
          scale: 1,
          numCols: 8,
          numRows: 1,
        },
      },
      animations: [
        {
          label: 'Walk right',
          keysCodesCombination: KeyCode.D,
          direction: Direction.Right,
          speed: 0.2,
          default: false,
          type: AnimationType.Movement,
        },
        {
          label: 'Walk left',
          keysCodesCombination: KeyCode.A,
          direction: Direction.Left,
          speed: 0.2,
          default: false,
          type: AnimationType.Movement,
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
          imageData: { width: 0, height: 0 },
          image: '/assets/sprites-sheets/shinobi/idle/main.png',
          scale: 1,
          numRows: 1,
          numCols: 6,
        },
      },
      animations: [
        {
          speed: 0.2,
          default: true,
          type: AnimationType.Action,
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
          imageData: { width: 0, height: 0 },
          image: '/assets/sprites-sheets/shinobi/attack-1/main.png',
          scale: 1,
          numRows: 1,
          numCols: 5,
        },
      },
      animations: [
        {
          keysCodesCombination: KeyCode.G,
          speed: 0.2,
          default: false,
          wait: true,
          type: AnimationType.Action,
        },
      ],
    },
  ],
};

export const HANDMADE_WALKER_SPRITE: SpriteSheet = {
  assets: [
    {
      label: 'Walk',
      framesMap: {
        frames: {
          '0.png': {
            frame: {
              x: 0,
              y: 0,
              w: 217,
              h: 413,
            },
          },
          '1.png': {
            frame: {
              x: 217,
              y: 0,
              w: 217,
              h: 413,
            },
          },
          '2.png': {
            frame: {
              x: 434,
              y: 0,
              w: 217,
              h: 413,
            },
          },
          '3.png': {
            frame: {
              x: 651,
              y: 0,
              w: 217,
              h: 413,
            },
          },
          '4.png': {
            frame: {
              x: 868,
              y: 0,
              w: 217,
              h: 413,
            },
          },
          '5.png': {
            frame: {
              x: 0,
              y: 413,
              w: 217,
              h: 413,
            },
          },
          '6.png': {
            frame: {
              x: 217,
              y: 413,
              w: 217,
              h: 413,
            },
          },
          '7.png': {
            frame: {
              x: 434,
              y: 413,
              w: 217,
              h: 413,
            },
          },
          '8.png': {
            frame: {
              x: 651,
              y: 413,
              w: 217,
              h: 413,
            },
          },
          '9.png': {
            frame: {
              x: 868,
              y: 413,
              w: 217,
              h: 413,
            },
          },
          '10.png': {
            frame: {
              x: 0,
              y: 826,
              w: 217,
              h: 413,
            },
          },
          '11.png': {
            frame: {
              x: 217,
              y: 826,
              w: 217,
              h: 413,
            },
          },
          '12.png': {
            frame: {
              x: 434,
              y: 826,
              w: 217,
              h: 413,
            },
          },
          '13.png': {
            frame: {
              x: 651,
              y: 826,
              w: 217,
              h: 413,
            },
          },
          '14.png': {
            frame: {
              x: 868,
              y: 826,
              w: 217,
              h: 413,
            },
          },
          '15.png': {
            frame: {
              x: 0,
              y: 1239,
              w: 217,
              h: 413,
            },
          },
          '16.png': {
            frame: {
              x: 217,
              y: 1239,
              w: 217,
              h: 413,
            },
          },
          '17.png': {
            frame: {
              x: 434,
              y: 1239,
              w: 217,
              h: 413,
            },
          },
          '18.png': {
            frame: {
              x: 651,
              y: 1239,
              w: 217,
              h: 413,
            },
          },
          '19.png': {
            frame: {
              x: 868,
              y: 1239,
              w: 217,
              h: 413,
            },
          },
          '20.png': {
            frame: {
              x: 0,
              y: 1652,
              w: 217,
              h: 413,
            },
          },
          '21.png': {
            frame: {
              x: 217,
              y: 1652,
              w: 217,
              h: 413,
            },
          },
          '22.png': {
            frame: {
              x: 434,
              y: 1652,
              w: 217,
              h: 413,
            },
          },
          '23.png': {
            frame: {
              x: 651,
              y: 1652,
              w: 217,
              h: 413,
            },
          },
          '24.png': {
            frame: {
              x: 868,
              y: 1652,
              w: 217,
              h: 413,
            },
          },
          '25.png': {
            frame: {
              x: 0,
              y: 2065,
              w: 217,
              h: 413,
            },
          },
          '26.png': {
            frame: {
              x: 217,
              y: 2065,
              w: 217,
              h: 413,
            },
          },
          '27.png': {
            frame: {
              x: 434,
              y: 2065,
              w: 217,
              h: 413,
            },
          },
          '28.png': {
            frame: {
              x: 651,
              y: 2065,
              w: 217,
              h: 413,
            },
          },
          '29.png': {
            frame: {
              x: 868,
              y: 2065,
              w: 217,
              h: 413,
            },
          },
          '30.png': {
            frame: {
              x: 0,
              y: 2478,
              w: 217,
              h: 413,
            },
          },
          '31.png': {
            frame: {
              x: 217,
              y: 2478,
              w: 217,
              h: 413,
            },
          },
        },
        meta: {
          imageData: { width: 0, height: 0 },
          image: '/assets/sprites-sheets/handmade-walk/main.png',
          numRows: 7,
          numCols: 5,
          scale: 1,
        },
      },
      animations: [
        {
          label: 'Walk right',
          keysCodesCombination: KeyCode.D,
          direction: Direction.Right,
          speed: 0.4,
          default: true,
          type: AnimationType.Movement,
        },
        {
          label: 'Walk left',
          keysCodesCombination: KeyCode.A,
          direction: Direction.Left,
          speed: 0.4,
          default: false,
          type: AnimationType.Movement,
        },
      ],
    },
  ],
};
