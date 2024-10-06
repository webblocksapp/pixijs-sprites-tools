export type FramesMap = {
  frames: {
    [key: string]: {
      frame: { x: number; y: number; w: number; h: number };
    };
  };
  meta: {
    image: string;
    imageData: {
      width: number;
      height: number;
    };
    numRows: number;
    numCols: number;
    scale: number;
    emptyFrames?: number;
  };
};
