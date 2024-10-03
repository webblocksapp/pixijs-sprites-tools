export const animationDurationInMs = (args: {
  numberOfFrames: number;
  speed: number;
  fps?: number;
}) => {
  const durationInSeconds =
    args.numberOfFrames / ((args.fps || 60) * args.speed);
  return durationInSeconds * 1000;
};
