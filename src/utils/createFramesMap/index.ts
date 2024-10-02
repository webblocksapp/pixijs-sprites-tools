import { FramesMap } from '@interfaces/FramesMap';
import { getImageDimensions } from '@utils/getImageDimensions';

export const createFramesMap = async (args: {
  image: Blob;
  imageExtension: string;
  imageUrl: string;
  numRows: number;
  numCols: number;
}) => {
  const { image, imageExtension, imageUrl, numCols, numRows } = args;
  const imageDimensions = await getImageDimensions(image);
  const frameHeight = imageDimensions.height / numRows;
  const frameWidth = imageDimensions.width / numCols;
  const numFramesPerRow = imageDimensions.width / frameWidth;
  const totalFrames = numFramesPerRow * numRows;

  let currentWidth = 0;
  let currentHeight = 0;
  let currentItem = 1;

  const framesMap: FramesMap = {
    frames: {},
    meta: {
      image: imageUrl,
      totalFrames,
      scale: 1,
    },
  };

  for (let i = 0; i < totalFrames; i++) {
    framesMap.frames[`${i}.${imageExtension}`] = {
      frame: {
        x: currentWidth,
        y: currentHeight,
        w: frameWidth,
        h: frameHeight,
      },
    };
    currentWidth = currentWidth + frameWidth;

    if (currentItem % numFramesPerRow === 0) {
      currentHeight = currentHeight + frameHeight;
    }

    currentItem++;
  }

  return framesMap;
};
