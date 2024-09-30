import { Direction } from '@interfaces/Direction';

export type SpriteSheet = {
  assets: Array<{
    path: string;
    animations: Array<{
      direction?: Direction;
      keysCodesCombination?: string;
      wait?: boolean;
      default: boolean;
      speed: number;
    }>;
  }>;
};
