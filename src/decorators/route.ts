import "reflect-metadata";
import { ResponseDecoratorType } from "../types";

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

export function ResponseBody({
  statusCode = 200,
  contentType = "application/json",
}: ResponseDecoratorType = {}): MethodDecorator {
  return (target, propertyKey: string | symbol) => {
    Reflect.defineMetadata(
      "responseBody",
      { statusCode, contentType },
      target,
      propertyKey
    );
  };
}

// Helper function to create method decorators
function createMethodDecorator(method: string, path: string): MethodDecorator {
  return (target, propertyKey: string | symbol) => {
    Reflect.defineMetadata("method", method, target, propertyKey);
    Reflect.defineMetadata("path", path, target, propertyKey);
  };
}

// Param decorator
export function Param(paramName: string): ParameterDecorator {
  return createParamDecorator("param", paramName);
}

// Body decorator
export function Body(): ParameterDecorator {
  return createParamDecorator("body");
}

// Query decorator
export function Query(queryName: string): ParameterDecorator {
  return createParamDecorator("query", queryName);
}

// Helper function to create parameter decorators
function createParamDecorator(
  type: string,
  paramName?: string
): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    const existingParams =
      Reflect.getMetadata("params", target, propertyKey || "") || [];
    existingParams.push({ index: parameterIndex, type, name: paramName });
    Reflect.defineMetadata("params", existingParams, target, propertyKey || "");
  };
}
