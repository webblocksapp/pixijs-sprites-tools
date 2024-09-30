import { Direction } from '@interfaces/Direction';

export type SpriteSheet = {
  assets: Array<{
    path: string;
    animations: Array<{
      label: string;
      numberOfFrames: number;
      direction: Direction;
      keyCode: string;
      default: boolean;
      speed: number;
    }>;
  }>;
};
