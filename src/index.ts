abstract class EasyConfiguration {
  #configuration: Record<string, unknown> = {};

  protected constructor(configurationObject: Record<string, unknown>) {
    this.#configuration = configurationObject;
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

    // Ensure that the configurationProperty exist in the configuration object
    if (!(key in this.#configuration)) {
      throw new ReferenceError(`Configuration property '${key}' does not exist.`);
    }

    const expectedType = typeof this.#configuration[key];

    // Ensure that the value of the configurationProperty is valid
    if (typeof value !== expectedType) {
      throw new TypeError(
        `Invalid type for configuration property '${key}', expected '${expectedType}'.`,
      );
    }

    // Update the configuration
    this.#configuration[key] = value;
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
      return { ...this.#configuration };
    }

    // Ensure that the configurationProperty exist in the configuration object
    if (!(configurationProperty in this.#configuration)) {
      throw new ReferenceError(`Configuration property '${configurationProperty}' does not exist.`);
    }

    // Return the configuration property value
    return this.#configuration[configurationProperty] as R;
  }

  // #endregion
}

export { EasyConfiguration };
