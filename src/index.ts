import { IConfigurationEntry } from './types/ConfigurationEntry';

/**
 * An abstract class (meant to be extended) to simplify a configuration management.
 *
 * @class
 *
 * @abstract
 *
 * @author Mas Paul-Louis
 */
abstract class EasyConfiguration {
  #configuration = new Map<string, IConfigurationEntry>();

  /**
   * Create a configuration instance.
   *
   * @param configuration - The default configuration.
   */
  protected constructor(configuration: Record<string, IConfigurationEntry | unknown>) {
    Object.entries(configuration).forEach(([property, entry]) => {
      let value: unknown;
      let types: Array<string>;
      let defaultValue: unknown;

      if (typeof entry === 'object' && entry !== null && 'value' in entry) {
        // An entry has been given
        const configurationEntry = entry as IConfigurationEntry;

        value = configurationEntry.value;
        types =
          'types' in configurationEntry && Array.isArray(configurationEntry.types)
            ? configurationEntry.types
            : [typeof value];
        defaultValue = 'default' in configurationEntry ? configurationEntry.default : value;
      } else {
        // A plain value has been given
        value = entry;
        types = [typeof value];
        defaultValue = value;
      }

      // Define the external configuration property
      this.#configuration.set(property, {
        types,
        default: defaultValue,
        value,
      });
    });
  }

  // #region setConfig()

  /**
   * Update the configuration.
   *
   * @param configuration - An object specifying the properties, and the values.
   */
  public setConfig(configuration: Record<string, unknown>): void;
  /**
   * Update the configuration.
   *
   * @param property - The configuration property to update.
   * @param value - The new value of the configuration property.
   */
  public setConfig(property: string, value: unknown): void;
  public setConfig(
    configurationOrProperty: Record<string, unknown> | string,
    value?: unknown,
  ): void {
    // If the configuration is an object
    if (typeof configurationOrProperty === 'object') {
      // Call the setConfig for each key/value pair
      Object.entries(configurationOrProperty).forEach(([property, val]) =>
        this.setConfig(property, val),
      );

      return;
    }

    // Ensure that the property exist in the configuration object
    if (!this.#configuration.has(configurationOrProperty)) {
      throw new ReferenceError(
        `Configuration property '${configurationOrProperty}' does not exist.`,
      );
    }

    const expectedTypes = this.#configuration.get(configurationOrProperty).types;

    // Ensure that the value of the configuration property is valid
    if (!expectedTypes.includes(typeof value)) {
      throw new TypeError(
        `Invalid type for configuration property '${configurationOrProperty}', expected '${expectedTypes.join(
          '|',
        )}'.`,
      );
    }

    // Update the configuration
    this.#configuration.set(configurationOrProperty, {
      ...this.#configuration.get(configurationOrProperty),
      value,
    });
  }

  // #endregion

  // #region getConfig()

  /**
   * Retrieve the whole configuration object.
   *
   * @returns Return the whole configuration.
   */
  public getConfig(): Record<string, unknown>;
  /**
   * Retrieve a configuration property.
   *
   * @param property - The name of the configuration property.
   *
   * @returns Return the value of the configuration property identified by `configurationProperty`.
   */
  public getConfig<R = unknown>(property: string): R;
  public getConfig<R = unknown>(property?: string): Record<string, unknown> | R {
    if (property === undefined) {
      // Return the whole configuration
      return Array.from(this.#configuration).reduce<Record<string, unknown>>(
        (obj, [configurationProperty, { value }]) =>
          Object.defineProperty(obj, configurationProperty, { value }),
        {},
      );
    }

    // Ensure that the configuration property exist in the configuration object
    if (!this.#configuration.has(property)) {
      throw new ReferenceError(`Configuration property '${property}' does not exist.`);
    }

    // Return the configuration property value
    return this.#configuration.get(property).value as R;
  }

  // #endregion
}

export default EasyConfiguration;
