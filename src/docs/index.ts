import { FastifyInstance } from 'fastify';
import { PluginOptions } from 'fastify-plugin';
import swagger from 'fastify-swagger';
import { IncomingMessage, Server, ServerResponse } from 'http';
const fp = require('fastify-plugin');

export default fp((app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: PluginOptions, done: (err?: Error) => void) => {
    app.register(swagger, {
        routePrefix: '/docs',
        swagger: {
            info: {
                title: 'Fastify API server',
                description:
                    'Responds to paths prefixed with either `api` or `auth`, other requests will be forwarded to Fastify error handler. For all endpoints expected to allow file uploads, the client making API call must specify `{Content-Type: multipart/form-data}` header, failure to which the request will be ignored. All responses are of type `application/json`. There are endpoints with missing response schema model definition. This is done on purpose as the response structure is not known beforehand.',
                version: '0.0.1',
            },
            externalDocs: {
                url: 'https://live-url.com',
                description: `Hosted on  Live high speed delivery server.`,
            },
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [
                {
                    name: 'auth',
                    description: 'Authentication related endpoints',
                },
                {
                    name: 'api',
                    description: 'Data related endpoints',
                },
            ],
            securityDefinitions: {
                apiKey: {
                    description: 'Standard Authorization header using the Bearer scheme. Example: "Bearer {token}"',
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                },
            },
        },
    });

    done();
});
