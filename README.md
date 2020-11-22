# Advanced Configuration Management

An easy to manage configuration manager

```javascript
import AdvancedConfigurationManagement from 'advanced-configuration-management';

class A extends AdvancedConfigurationManagement {
  constructor() {
    super({
      foo: {
        types: ['string'],
        default: '',
        value: 'bar',
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
        default: '',
        value: 'bar',
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

In order to configure the properties, simply call the package class constructor from inside your constructor using `super`:

```javascript
class A extends AdvancedConfigurationManagement {
  constructor() {
    super({
      // Detailled version
      foo: {
        types: ['string'], // Optionnal, if not present, inferred from typeof `value`
        default: '', // Optionnal, if not present, inferred from value of `value`
        value: 'bar',
      },

      // Detailed version with multiple types
      spaces: {
        types: ['string', 'number'],
        default: '',
        value: 2,
      },

      // Short version
      baz: true,
    });
  }
}
```

Create a class `A` that has those configuration properties:

- A configuration property named `foo` that can be a `string`, has a value of `'bar'` and a default value of `''` (empty string)
- A configuration property named `spaces` that can be either a `string` or `number`, has a value of `2`, and a default value of `''` (empty string)
- A configuration property named `baz` that can be a `boolean`, has a value of `true`, and a default value of `true`

> **Warning!**
>
> Even tho having a configuration property as an object is allowed, it is not recommended since it's impossible to assure that the required properties are actually present.

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

## Using the configuration with a root class that cannot be extended

If your root class cannot be extended (because it already extend another class for example), you can use an adapter class that will be mounted as a property onto your object:

```javascript
// Import the main class
import AdvancedConfigurationManagement from 'advanced-configuration-management';

// Create an adapter class
class ConfigurationAdapter extends AdvancedConfigurationManagement {
  constructor() {
    // Specify the configuration entries
    super({
      foo: {
        types: ['string'],
        default: '',
        value: 'bar',
      },
    });
  }
}

// Your own class that cannot be extended
class MyClass {
  constructor() {
    // Mount the configuration adapter onto a property
    this.configuration = new ConfigurationAdapter();
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
