import { expect } from 'chai';
import EasyConfiguration from '../src/';

const shouldNotThrow = (func: () => void) => {
  try {
    func();
  } catch (error) {
    return false;
  }

  return true;
};

describe('Main tests', () => {
  it('Set config for unknown property throw ReferenceError', () => {
    // Arrange
    class A extends EasyConfiguration {
      public constructor() {
        super({
          a: false,
        });
      }
    }

    // Act
    const b = new A();

    // Assert
    expect(() => b.setConfig('foo', true)).to.throw(ReferenceError);
  });

  it('Setting invalid type should throw TypeError', () => {
    // Arrange
    class A extends EasyConfiguration {
      public constructor() {
        super({
          a: true,
        });
      }
    }

    // Act
    const b = new A();

    // Assert
    expect(() => b.setConfig('a', 2)).to.throw(TypeError);
  });

  it('Setting valid type should not throw', () => {
    // Arrange
    class A extends EasyConfiguration {
      public constructor() {
        super({
          a: { types: ['string', 'boolean'], value: true },
        });
      }
    }

    // Act
    const b = new A();

    // Assert
    expect(() => b.setConfig('a', 'a string')).to.satisfy(shouldNotThrow);
  });

  it('Set valid config should not throw', () => {
    // Arrange
    class A extends EasyConfiguration {
      public constructor() {
        super({
          a: true,
        });
      }
    }

    // Act
    const b = new A();

    // Assert
    expect(() => b.setConfig('a', false)).to.satisfy(shouldNotThrow);
  });

  it('Set valid config update configuration', () => {
    // Arrange
    class A extends EasyConfiguration {
      public constructor() {
        super({
          a: true,
        });
      }
    }

    // Act
    const b = new A();
    const originalValue = b.getConfig<boolean>('a');
    b.setConfig('a', false);
    const updatedValue = b.getConfig<boolean>('a');

    // Assert
    expect(originalValue).to.not.equal(updatedValue);
  });

  it('Get config with undefined parameter return whole config', function () {
    // Arrange
    class A extends EasyConfiguration {
      public constructor() {
        super({
          a: true,
        });
      }
    }

    // Act
    const b = new A();
    const config = b.getConfig();

    // Assert
    expect(config).to.be.a('object');
  });

  it('Get unknown config property throw ReferenceError', function () {
    // Arrange
    class A extends EasyConfiguration {
      public constructor() {
        super({
          a: true,
        });
      }
    }

    // Act
    const b = new A();

    // Assert
    expect(() => b.getConfig('foo')).to.throw(ReferenceError);
  });

  it('Get valid config property return value', function () {
    // Arrange
    const defaultValue = true;
    class A extends EasyConfiguration {
      public constructor() {
        super({
          a: defaultValue,
        });
      }
    }
    const newValue = false;

    // Act
    const b = new A();
    const initialValue = b.getConfig('a');
    b.setConfig('a', newValue);
    const updatedValue = b.getConfig('a');

    // Assert
    expect(initialValue).to.be.equal(defaultValue);
    expect(initialValue).to.not.equal(updatedValue);
    expect(updatedValue).to.be.equal(newValue);
  });
});
