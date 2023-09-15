export default class BitwiseBaseError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}
