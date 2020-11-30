export class SetupError extends Error {
  public name = 'SetupError';

  public constructor(property?: string, message?: string) {
    super(
      `Invalid configuration entry${
        property ? `: invalid value for '${property}${message ? `, ${message}` : ''}'` : ''
      }.`,
    );

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, SetupError);
    }
  }
}
