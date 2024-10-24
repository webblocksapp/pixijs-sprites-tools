// Return true if the URL does not start with 'http://', 'https://', or 'blob:'
export const urlIsRelative = (url: string) => {
  return !url.match(/^https?:\/\/|^blob/)?.length;
};
