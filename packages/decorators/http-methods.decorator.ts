import { ControllerMethodsParams, HttpMethods } from '../types/enums';

function createHttpMethod(method: HttpMethods) {
    return function (path?: string) {
        return function (target: any, propertyKey: string) {
            Reflect.defineMetadata(
                propertyKey,
                method,
                target,
                ControllerMethodsParams.Method
            );
            Reflect.defineMetadata(
                propertyKey,
                path,
                target,
                ControllerMethodsParams.Path
            );
        };
    };
}

export const Get = createHttpMethod(HttpMethods.Get);
export const Post = createHttpMethod(HttpMethods.Post);
export const Put = createHttpMethod(HttpMethods.Put);
export const Patch = createHttpMethod(HttpMethods.Patch);
export const Delete = createHttpMethod(HttpMethods.Delete);
