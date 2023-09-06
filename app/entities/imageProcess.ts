export type ImageProcess = {
  finishedAt: string;
  resultId: string;
  erroredAt: string | null;
  errorReason: string | null;
  image: {
    format: string;
    originalFilename: string;
    url: string;
    size: number;
    id: string;
  };
  result: {
    format: string;
    originalFilename: string;
    url: string;
    size: number;
    id: string;
  };
  kind: string;
  id: string;
  imageId: string;
};
