import { HttpStatus } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const formatResponse = (
  data: any,
  message: string = null,
): {
  data: any;
  message: string;
  statusCode: HttpStatus;
} => {
  return {
    data,
    ...(message && { message }),
    statusCode: HttpStatus.OK,
  };
};
/* eslint-enable */
