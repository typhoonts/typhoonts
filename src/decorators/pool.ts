const objectPool = new Map();

export function Service(): ClassDecorator {
  return (target) => {
    objectPool.set(target, new (target as any)());
  };
}

export function Component(): ClassDecorator {
  return (target) => {
    objectPool.set(target, new (target as any)());
  };
}

export function Inject(serviceIdentifier: any): PropertyDecorator {
  return (target, propertyKey) => {
    const instance = objectPool.get(serviceIdentifier);
    if (!instance) {
      throw new Error(
        `Service ${serviceIdentifier.name} not found in object pool`
      );
    }
    Object.defineProperty(target, propertyKey, {
      value: instance,
      writable: false,
    });
  };
}

export { objectPool };
