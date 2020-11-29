import { IConfigurationEntry } from './types/ConfigurationEntry';
import { ValidationError } from './ValidationError';

/**
 * An abstract class (meant to be extended) to simplify a configuration management.
 *
 * @class
 *
 * @abstract
 *
 * @author Mas Paul-Louis
 */
abstract class AdvancedConfigurationManagement {
  private configuration = new Map<string, IConfigurationEntry>();

  /**
   * Create a configuration instance.
   *
   * @param configuration - The default configuration.
   */
  protected constructor(configuration: Record<string, IConfigurationEntry>) {
    Object.entries(configuration).forEach(([property, entry]) => {
      const { types, value, validator } = entry;

      // Define the configuration property
      this.configuration.set(property, {
        types: Array.isArray(types) ? types : [typeof value],
        value,
        validator: typeof validator === 'function' ? validator : () => true,
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
    if (!this.configuration.has(configurationOrProperty)) {
      throw new ReferenceError(
        `Configuration property '${configurationOrProperty}' does not exist.`,
      );
    }

    const currentProperty = this.configuration.get(configurationOrProperty);
    const expectedTypes = currentProperty.types;

    // Ensure that the value of the configuration property is valid
    if (!expectedTypes.includes(typeof value)) {
      throw new TypeError(
        `Invalid type for configuration property '${configurationOrProperty}', expected '${expectedTypes.join(
          '|',
        )}'.`,
      );
    }

    // Ensure the value pass the validation
    let validationSuccess: boolean;

    try {
      validationSuccess = currentProperty.validator(value);
    } catch (error) {
      throw new EvalError(`An error occured while trying to validate the value '${value}'.`);
    }

    if (!validationSuccess) {
      throw new ValidationError(`Validation failed for the value '${value}'.`);
    }

    // Update the configuration
    this.configuration.set(configurationOrProperty, {
      ...currentProperty,
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
      return Array.from(this.configuration).reduce<Record<string, unknown>>(
        (obj, [configurationProperty, { value }]) =>
          Object.defineProperty(obj, configurationProperty, { value }),
        {},
      );
    }

    // Ensure that the configuration property exist in the configuration object
    if (!this.configuration.has(property)) {
      throw new ReferenceError(`Configuration property '${property}' does not exist.`);
    }

    // Return the configuration property value
    return this.configuration.get(property).value as R;
  }

  // #endregion
}

export default AdvancedConfigurationManagement;
