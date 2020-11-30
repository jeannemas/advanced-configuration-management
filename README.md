# Advanced Configuration Management

An easy to manage configuration manager

```javascript
import AdvancedConfigurationManagement from 'advanced-configuration-management';

class A extends AdvancedConfigurationManagement {
  constructor() {
    super({
      foo: {
        types: ['string'],
        value: 'bar',
        validator: (value) => value.length > 0,
      },
    });
  }
}

const b = new A();

console.log(b.getConfig('foo')); // ==> 'bar'

b.setConfig('foo', 'baz');

console.log(b.getConfig('foo')); // ==> 'baz'
```

## Installation

```shell
$ npm install advanced-configuration-management
```

## Features

- No external dependencies
- Minimal setup required
- Easy to implement
- Full Typescript support

## Usage

```javascript
// Import the main class
import AdvancedConfigurationManagement from 'advanced-configuration-management';

// Extend the class in your own class
class A extends AdvancedConfigurationManagement {
  constructor() {
    // Specify the configuration entries
    super({
      foo: {
        types: ['string'],
        value: 'bar',
        validator: (value) => value.length > 0,
      },
    });
  }

  // Your class logic here...
}

// Instantiate your class as normal
const b = new A();

// Access the configuration property(ies)
b.getConfig('foo'); // ==> 'bar'

// Update the configuration
b.setConfig('foo', 'baz');
```

## Configuring the properties

| Property    | Optionnal | Description                                                                                                    |
| :---------- | :-------- | :------------------------------------------------------------------------------------------------------------- |
| `types`     | `true`    | An array of `string` to enforce types (from `typeof`). <br> Defaults to the type of `value`.                   |
| `value`     | `false`   | The inital value to assign to the property                                                                     |
| `validator` | `true`    | A validator function used to validate the value, must returns a boolean. <br> Defaults to validate any values. |

In order to configure the properties, simply call the package class constructor from inside your constructor using `super`:

```javascript
class A extends AdvancedConfigurationManagement {
  constructor() {
    super({
      foo: {
        types: ['string'], // Optionnal, if not present, inferred from typeof `value`
        value: 'bar',
        validator: (value) => value.length > 0, // Optionnal, if not present, always validate the value to `true`
      },

      spaces: {
        types: ['string', 'number'],
        value: 2,
      },
    });
  }
}
```

Create a class `A` that has those configuration properties:

- A configuration property named `foo` that can be a `string`, has a value of `'bar'` and must not be an empty string
- A configuration property named `spaces` that can be either a `string` or `number`, has a value of `2`

> **Warning!**
>
> Even tho having a configuration property as an object is allowed, it is not recommended since it's impossible to assure that the required properties are actually present. If you need to have an object, use a validator function alongside it.

## Accessing the configuration

The configuration can be accessed using the `.getConfig` method on the instance:

```javascript
// Using the previous example...

const b = new A();

console.log(b.getConfig('foo')); // ==> `bar`
```

> Accessing a configuration property that does not exist will throw a `ReferenceError`.

## Updating the configuration

The configuration can be updated by calling the `.setConfig` method on the instance:

```javascript
// Using the previous example...

const b = new A();

// Update a single property
b.setConfig('foo', 'updated value with a single property');

// Update multiple properties at a time
b.setConfig({
  foo: 'updated value with multiple properties',
  baz: false,
});
```

> Updating a configuration property that does not exist will throw a `ReferenceError`.

> Updating a configuration property with an invalid type will throw a `TypeError`.

> Updating a configuration property with a value that does not validate will throw a `ValidationError`.

## Using the configuration with a root class that cannot be extended

If your root class cannot be extended (because it already extend another class for example), you can call the `AdvancedConfigurationManagement.CreateAdapter` with the coonfiguration to mount the configuration onto a property:

```javascript
// Import the main class
import AdvancedConfigurationManagement from 'advanced-configuration-management';

// Your own class that cannot be extended
class MyClass {
  constructor() {
    // Mount the configuration adapter onto a property
    this.configuration = AdvancedConfigurationManagement.CreateAdapter({
      foo: {
        types: ['string'],
        value: 'bar',
      },
    });
  }

  // Your class logic here...
}

// Instantiate your class as normal
const b = new MyClass();

// Access the configuration property(ies)
b.configuration.getConfig('foo'); // ==> 'bar'

// Update the configuration
b.configuration.setConfig('foo', 'baz');
```
