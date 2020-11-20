export interface IConfigurationEntry {
  /** The accepted types for the configuration property */
  types?: Array<string>;

  /** The default value for the configuration property */
  default?: unknown;

  /** The current value for the configuration property */
  value: unknown;
}
