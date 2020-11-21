import { IInternalConfiguration } from './types/InternalConfiguration';
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
  #externalConfiguration = new Map<string, IConfigurationEntry>();

  #internalConfiguration: IInternalConfiguration = {
    addPropertiesToConfigAllowed: false,
  };

  /**
   * Create a configuration instance.
   *
   * @param configurationObject - The default configuration.
   */
  protected constructor(
    configurationObject: Record<string, IConfigurationEntry | unknown>,
    { addPropertiesToConfigAllowed = false }: IInternalConfiguration = {},
  ) {
    Object.entries(configurationObject).forEach(([key, entry]) => {
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

      this.#externalConfiguration.set(key, {
        types,
        default: defaultValue,
        value,
      });
    });

    this.#internalConfiguration.addPropertiesToConfigAllowed = !!addPropertiesToConfigAllowed;
  }

  // #region setConfig()

  /**
   * Update the configuration.
   *
   * @param configuration - An object specifying the properties as keys, and the values.
   */
  public setConfig(configuration: Record<string, unknown>): void;
  /**
   * Update the configuration.
   *
   * @param configurationProperty - The configuration property to update.
   * @param value - The new value of the configuration property.
   */
  public setConfig(configurationProperty: string, value: unknown): void;
  public setConfig(
    configurationOrProperty: Record<string, unknown> | string,
    value?: unknown,
  ): void {
    // If the configuration is an object
    if (typeof configurationOrProperty === 'object') {
      const config = configurationOrProperty as Record<string, unknown>;

      // Call the setConfig foreach key/value pair
      Object.entries(config).forEach(([key, val]) => this.setConfig(key, val));

      return;
    }

    /** The configuration property */
    const key = configurationOrProperty as string;

    if (!this.#externalConfiguration.has(key)) {
      // Ensure that the configurationProperty exist in the configuration object
      if (!this.#internalConfiguration.addPropertiesToConfigAllowed) {
        throw new ReferenceError(`Configuration property '${key}' does not exist.`);
      }

      // Add the new property to the configuration
      this.#externalConfiguration.set(key, {
        types: [typeof value],
        default: value,
        value,
      });
    } else {
      const expectedTypes = this.#externalConfiguration.get(key).types;

      // Ensure that the value of the configurationProperty is valid
      if (!expectedTypes.includes(typeof value)) {
        throw new TypeError(
          `Invalid type for configuration property '${key}', expected '${expectedTypes.join(
            '|',
          )}'.`,
        );
      }

      // Update the configuration
      this.#externalConfiguration.set(key, {
        ...this.#externalConfiguration.get(key),
        value,
      });
    }
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
   * Retrieve a configuration properties.
   *
   * @param configurationProperty - The name of the configuration property.
   *
   * @returns Return the value of the configuration property identified by `configurationProperty`.
   */
  public getConfig<R = unknown>(configurationProperty: string): R;
  public getConfig<R = unknown>(configurationProperty?: string): Record<string, unknown> | R {
    // Check if property is 'undefined'
    if (configurationProperty === undefined) {
      // Return the whole configuration
      return Array.from(this.#externalConfiguration).reduce<Record<string, unknown>>(
        (obj, [key, { value }]) => Object.defineProperty(obj, key, { value }),
        {},
      );
    }

    // Ensure that the configurationProperty exist in the configuration object
    if (!this.#externalConfiguration.has(configurationProperty)) {
      throw new ReferenceError(`Configuration property '${configurationProperty}' does not exist.`);
    }

    // Return the configuration property value
    return this.#externalConfiguration.get(configurationProperty).value as R;
  }

  // #endregion
}

export { EasyConfiguration };
