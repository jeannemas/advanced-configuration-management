import { IInternalConfiguration } from './types/InternalConfiguration';

abstract class EasyConfiguration {
  #externalConfiguration = new Map<string, unknown>();

  #internalConfiguration: IInternalConfiguration = {
    addPropertiesToConfigAllowed: false,

    allowDifferentTypeOnConfig: false,
  };

  /**
   * Create a configuration instance.
   *
   * @param configurationObject - The object to consider as default configuration.
   */
  protected constructor(
    configurationObject: Record<string, unknown>,
    {
      addPropertiesToConfigAllowed = false,
      allowDifferentTypeOnConfig = false,
    }: IInternalConfiguration = {},
  ) {
    Object.entries(configurationObject).forEach(([key, value]) =>
      this.#externalConfiguration.set(key, value),
    );

    this.#internalConfiguration.addPropertiesToConfigAllowed = !!addPropertiesToConfigAllowed;
    this.#internalConfiguration.allowDifferentTypeOnConfig = !!allowDifferentTypeOnConfig;
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
    } else {
      const expectedType = typeof this.#externalConfiguration.get(key);

      // Ensure that the value of the configurationProperty is valid
      if (
        typeof value !== expectedType &&
        !this.#internalConfiguration.allowDifferentTypeOnConfig
      ) {
        throw new TypeError(
          `Invalid type for configuration property '${key}', expected '${expectedType}'.`,
        );
      }
    }

    // Update the configuration
    this.#externalConfiguration.set(key, value);
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
        (obj, [key, value]) => Object.defineProperty(obj, key, { value }),
        {},
      );
    }

    // Ensure that the configurationProperty exist in the configuration object
    if (!this.#externalConfiguration.has(configurationProperty)) {
      throw new ReferenceError(`Configuration property '${configurationProperty}' does not exist.`);
    }

    // Return the configuration property value
    return this.#externalConfiguration.get(configurationProperty) as R;
  }

  // #endregion
}

export { EasyConfiguration };
