import { Texture } from 'pixi.js';
import { Direction } from '@interfaces/Direction';

export type Frame = {
  keysCodesCombination: string | undefined;
  textures: Texture[];
  speed: number;
  default?: boolean;
  wait?: boolean;
  direction: Direction | undefined;
};
