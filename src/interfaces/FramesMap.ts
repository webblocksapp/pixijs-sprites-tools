export type FramesMap = {
  frames: {
    [key: string]: {
      frame: { x: number; y: number; w: number; h: number };
    };
  };
  meta: {
    image: string;
    totalFrames: number;
    scale: number;
  };
};
