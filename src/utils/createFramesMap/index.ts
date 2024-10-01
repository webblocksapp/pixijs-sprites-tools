import { FramesMap } from '@interfaces/FramesMap';
import { getImageDimensions } from '@utils/getImageDimensions';

export const createFramesMap = async (args: {
  image: Blob;
  imageExtension: string;
  numRows: number;
  numCols: number;
}) => {
  const { image, imageExtension, numCols, numRows } = args;
  const imageDimensions = await getImageDimensions(image);
  const frameHeight = imageDimensions.height / numRows;
  const frameWidth = imageDimensions.width / numCols;
  const numFramesPerRow = imageDimensions.width / frameWidth;
  const numFrames = numFramesPerRow * numRows;

  let currentWidth = 0;
  let currentHeight = 0;
  let currentItem = 1;

  const framesMap: FramesMap = {
    frames: {},
    meta: {
      image: `main.${imageExtension}`,
    },
  };

  for (let i = 0; i < numFrames; i++) {
    framesMap.frames[`${i}.${imageExtension}`] = {
      frame: {
        x: currentWidth,
        y: currentHeight,
        w: frameWidth,
        h: frameHeight,
      },
    };
    currentWidth = currentWidth + frameWidth;

    if (currentItem % numFramesPerRow) {
      currentHeight = currentHeight + frameHeight;
    }

    currentItem++;
  }

  return framesMap;
};
