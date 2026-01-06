import { ENV } from '../config/env';
export const getLocalFileUrl = (filename: string) => {
  return `http://localhost:${ENV.PORT}/uploads/clientLogos/${filename}`;
};
