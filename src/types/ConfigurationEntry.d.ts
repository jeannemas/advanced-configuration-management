/** A configuration property */
export interface IConfigurationEntry {
  /** The accepted types */
  types?: Array<string>;

  /** The current value */
  value: unknown;

  /** A validator function */
  validator?: (value: unknown) => boolean;
}
