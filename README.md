# BotO

## Decorators

### Usados em classes

```typescript
    @Controller
```

Recebe string que indica a rota do controller

```typescript
    @GlobalMiddleware
```

Recebe um array com todos os métodos de middleware que serão aplicados a todos os métodos do controller

### Usados em métodos

```typescript
    @Get - path: string
    @Post - path: string
    @Put - path: string
    @Patch - path: string
    @Delete - path: string
    @Middleware - Array com métodos
```

#### Exemplo

```typescript
@Controller('/users')
@GlobalMiddleware([auth])
export class UsersController {
    constructor() {}

    @Get()
    @Middleware([logger])
    getAll(req: Request, res: Response) {
        res.status(200).send([
            { id: 1, user: 'admin' },
            { id: 2, user: 'default' },
        ]);
    }

    @Get('/:id')
    @Middleware([anotherLogger])
    getById(req: Request, res: Response) {
        console.log('request accepted...');

        res.status(200).send([
            { id: 1, user: 'admin' },
            { id: 2, user: 'default' },
        ]);
    }
}
```
