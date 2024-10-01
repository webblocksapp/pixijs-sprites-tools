export const base64ToBlob = (base64: string, mimeType: string) => {
  const arr = base64.split(',');
  const result = arr.length === 1 ? arr[0] : arr[1];
  const byteString = atob(result);
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([byteArray], { type: mimeType });
};
