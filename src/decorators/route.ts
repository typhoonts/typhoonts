import "reflect-metadata";

// Controller decorator to define base path
export function Controller(basePath: string): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata("basePath", basePath, target);
  };
}

// HTTP method decorators
export function Get(path: string): MethodDecorator {
  return createMethodDecorator("get", path);
}

export function Post(path: string): MethodDecorator {
  return createMethodDecorator("post", path);
}

export function Put(path: string): MethodDecorator {
  return createMethodDecorator("put", path);
}

export function Delete(path: string): MethodDecorator {
  return createMethodDecorator("delete", path);
}

export function Any(path: string): MethodDecorator {
  return createMethodDecorator("any", path);
}

// Helper function to create method decorators
function createMethodDecorator(method: string, path: string): MethodDecorator {
  return (target, propertyKey: string | symbol) => {
    Reflect.defineMetadata("method", method, target, propertyKey);
    Reflect.defineMetadata("path", path, target, propertyKey);
  };
}
