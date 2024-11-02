import { Asset } from '@interfaces/Asset';

export type SpriteSheet = {
  webDomain?: string;
  assets: Array<Asset>;
  xPosition?: number;
  yPosition?: number;
};
