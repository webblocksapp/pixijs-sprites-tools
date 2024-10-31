import { AnimationType, Direction } from '@constants/enum';
import { Texture } from 'pixi.js';

export type Animation = {
  direction?: Direction;
  keysCodesCombination?: string;
  textures: Texture[];
  wait?: boolean;
  label?: string;
  default: boolean;
  speed: number;
  type: AnimationType;
  xDisplacement?: number;
  yDisplacement?: number;
};
