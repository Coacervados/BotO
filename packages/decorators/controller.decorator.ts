import { AppRouter } from '../classes/AppRouter';
import { ControllerMethodsParams } from '../types/enums';
import { ServerConfigsParams } from '../types/enums/ServerConfigsParams';

export function Controller(path: string) {
    const router: any = AppRouter.router;

    return function (target: any) {
        const { prototype } = Object.getOwnPropertyDescriptors(target);
        const [, ..._actionsNames] = Object.getOwnPropertyNames(
            prototype.value
        );

        _actionsNames.forEach((_actionName) => {
            const _method =
                Reflect.getOwnMetadata(
                    _actionName,
                    prototype.value,
                    ControllerMethodsParams.Method
                ) ?? '';

            const _middlewares =
                Reflect.getOwnMetadata(
                    _actionName,
                    prototype.value,
                    ControllerMethodsParams.Middleware
                ) ?? [];

            const _path =
                Reflect.getOwnMetadata(
                    _actionName,
                    prototype.value,
                    ControllerMethodsParams.Path
                ) ?? '';

            router[_method](
                `${path}${_path}`,
                _middlewares,
                prototype.value[_actionName]
            );
        });

        Reflect.defineMetadata(ServerConfigsParams.Router, router, target);
    };
}
