export type FramesMap = {
  frames: {
    [key: string]: {
      frame: { x: number; y: number; w: number; h: number };
    };
  };
  meta: {
    image: string;
    numRows: number;
    numCols: number;
    scale: number;
    emptyFrames?: number;
  };
};
