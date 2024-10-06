import { FramesMap } from '@interfaces/FramesMap';
import { ImageInfo } from '@interfaces/ImageInfo';
import { getImageDimensions as baseGetImageDimensions } from '@utils/getImageDimensions';

export const createFramesMap = async (
  args: ImageInfo & {
    imageExtension: string;
    numRows: number;
    numCols: number;
    scale?: number;
    emptyFrames?: number;
  }
) => {
  const {
    imageExtension,
    numCols,
    numRows,
    scale = 1,
    emptyFrames = 0,
    ...rest
  } = args;

  const getImageDimensions = async () => {
    switch (rest.type) {
      case 'url':
        return rest.imageDimensions;
      case 'file':
        return baseGetImageDimensions(rest.image);
      default:
        return { height: 0, width: 0 };
    }
  };

  const getImageUrl = () => {
    switch (rest.type) {
      case 'url':
        return rest.imageUrl;
      case 'file':
        return URL.createObjectURL(rest.image);
      default:
        return '';
    }
  };

  const imageDimensions = await getImageDimensions();
  const frameHeight = imageDimensions.height / numRows;
  const frameWidth = imageDimensions.width / numCols;
  const numFramesPerRow = imageDimensions.width / frameWidth;
  const totalFrames = numFramesPerRow * numRows - emptyFrames;

  let currentWidth = 0;
  let currentHeight = 0;
  let currentItem = 1;

  const framesMap: FramesMap = {
    frames: {},
    meta: {
      image: getImageUrl(),
      imageData: { ...imageDimensions },
      numRows,
      numCols,
      scale,
      emptyFrames,
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
      currentWidth = 0;
      currentHeight = currentHeight + frameHeight;
    }

    currentItem++;
  }

  return framesMap;
};
