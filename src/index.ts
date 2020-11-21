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
    addPropertiesToConfigurationAllowed: false,
  };

  /**
   * Create a configuration instance.
   *
   * @param configuration - The default configuration.
   * @param internalConfiguration - The optionnal internal configuration.
   * @param internalConfiguration.addPropertiesToConfigurationAllowed - Whether or not unknown
   *   properties can later be added.
   */
  protected constructor(
    configuration: Record<string, IConfigurationEntry | unknown>,
    { addPropertiesToConfigurationAllowed = false }: IInternalConfiguration = {},
  ) {
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
      this.#externalConfiguration.set(property, {
        types,
        default: defaultValue,
        value,
      });
    });

    // Update the internal configuration
    this.#internalConfiguration.addPropertiesToConfigurationAllowed = !!addPropertiesToConfigurationAllowed;
  }

  // #region setConfig()

  /**
   * Update the external configuration.
   *
   * @param configuration - An object specifying the properties, and the values.
   */
  public setConfig(configuration: Record<string, unknown>): void;
  /**
   * Update the external configuration.
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

    if (!this.#externalConfiguration.has(configurationOrProperty)) {
      // Ensure that the property exist in the configuration object
      if (!this.#internalConfiguration.addPropertiesToConfigurationAllowed) {
        throw new ReferenceError(
          `Configuration property '${configurationOrProperty}' does not exist.`,
        );
      }

      // Add the new property to the configuration
      this.#externalConfiguration.set(configurationOrProperty, {
        types: [typeof value],
        default: value,
        value,
      });
    } else {
      const expectedTypes = this.#externalConfiguration.get(configurationOrProperty).types;

      // Ensure that the value of the configurationProperty is valid
      if (!expectedTypes.includes(typeof value)) {
        throw new TypeError(
          `Invalid type for configuration property '${configurationOrProperty}', expected '${expectedTypes.join(
            '|',
          )}'.`,
        );
      }

      // Update the configuration
      this.#externalConfiguration.set(configurationOrProperty, {
        ...this.#externalConfiguration.get(configurationOrProperty),
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
      return Array.from(this.#externalConfiguration).reduce<Record<string, unknown>>(
        (obj, [configurationProperty, { value }]) =>
          Object.defineProperty(obj, configurationProperty, { value }),
        {},
      );
    }

    // Ensure that the configuration property exist in the configuration object
    if (!this.#externalConfiguration.has(property)) {
      throw new ReferenceError(`Configuration property '${property}' does not exist.`);
    }

    // Return the configuration property value
    return this.#externalConfiguration.get(property).value as R;
  }

  // #endregion
}

export { EasyConfiguration };
