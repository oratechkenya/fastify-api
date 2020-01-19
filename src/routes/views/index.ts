import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

/**
 * Instance definition for every view route defined in the application.
 *
 * @export
 * @interface IViewRoutes
 */
export interface IViewRoutes {
    path: string;
    view: string;
    middleware?: (req: FastifyRequest, res: FastifyReply<{}>, done: (err?: Error) => void) => void;
    locals?: Array<(app: FastifyInstance, req: FastifyRequest, res: FastifyReply<{}>) => Promise<any>>;
}

const routes: IViewRoutes[] = [
    {
        path: '/',
        view: 'index',
        middleware: null,
        locals: [],
    },
    {
        path: `*`,
        view: 'index',
        middleware: null,
        locals: [],
    },
];

export default (app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: {}, next: (err?: Error) => void) => {
    routes.forEach(route => {
        app.get(
            route.path,
            {
                ...(route.middleware && { preHandler: route.middleware }),
                schema: {
                    hide: true,
                },
            },
            async (req, res) => {
                res.view(route.view, await app.utils.resolve(route.locals, app, req, res));
            }
        );
    });

    // pass to the next middleware
    next();
};
