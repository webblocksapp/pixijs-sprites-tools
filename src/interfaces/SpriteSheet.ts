import { Direction } from '@interfaces/Direction';
import { FramesMap } from '@interfaces/FramesMap';

export type SpriteSheet = {
  assets: Array<{
    framesMap: FramesMap | undefined;
    animations: Array<{
      direction?: Direction;
      keysCodesCombination?: string;
      wait?: boolean;
      default: boolean;
      speed: number;
    }>;
  }>;
};
