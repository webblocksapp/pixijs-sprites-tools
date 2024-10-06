export type ImageInfo =
  | {
      type: 'url';
      imageDimensions: { width: number; height: number };
      imageUrl: string;
    }
  | { type: 'file'; image: File };
