import { Asset } from '@interfaces/Asset';

export type SpriteSheet = {
  webDomain?: string;
  id?: string;
  name: string;
  assets: Array<Asset>;
};
