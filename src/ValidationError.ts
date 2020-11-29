export class ValidationError extends Error {
  public name = 'ValidationError';

  public constructor(message?: string) {
    super(message);

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}
