import { Animation } from '@interfaces/Animation';
import { FramesMap } from '@interfaces/FramesMap';

export type Asset = {
  id?: string;
  label: string;
  framesMap: FramesMap | undefined;
  animations: Array<Omit<Animation, 'textures'>>;
};
