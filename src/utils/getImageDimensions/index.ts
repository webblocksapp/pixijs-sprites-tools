export const getImageDimensions = (blob: Blob) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };

    img.onerror = (err) => {
      reject(err);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
};
