import { Direction } from '@interfaces/Direction';

export type SpriteSheet = {
  assets: Array<{
    path: string;
    animations: Array<{
      direction?: Direction;
      keyCode?: string;
      default: boolean;
      speed: number;
    }>;
  }>;
};
