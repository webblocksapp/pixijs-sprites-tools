import { Texture } from 'pixi.js';
import { Direction } from '@interfaces/Direction';

export type Frame = {
  label: string;
  keyCode: string;
  textures: Texture[];
  speed: number;
  default?: boolean;
  direction: Direction;
};
