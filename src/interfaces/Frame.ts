import { Texture } from 'pixi.js';
import { Direction } from '@interfaces/Direction';
import { FrameType } from '@constants/enum';

export type Frame = {
  keysCodesCombination: string | undefined;
  textures: Texture[];
  speed: number;
  default?: boolean;
} & (
  | { type: FrameType.Action }
  | { type: FrameType.Movement; direction: Direction | undefined }
  | { type: FrameType.Custom; direction?: Direction; wait?: boolean }
);
