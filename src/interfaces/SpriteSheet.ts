import { Direction } from '@interfaces/Direction';

export type SpriteSheet = {
  assets: Array<{
    config: {
      src: string;
      format?: string;
      loadParser?: string;
      framesNumber?: number;
    };
    animations: Array<{
      direction?: Direction;
      keysCodesCombination?: string;
      wait?: boolean;
      default: boolean;
      speed: number;
    }>;
  }>;
};
