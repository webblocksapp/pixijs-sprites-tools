export const animationDurationInMs = (args: {
  numberOfFrames: number;
  speed: number;
  fps: number;
}) => {
  const durationInFrames = args.numberOfFrames / args.speed;
  const durationInSeconds = durationInFrames / args.fps;
  return durationInSeconds * 1000;
};
