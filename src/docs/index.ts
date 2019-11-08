import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { PluginOptions } from 'fastify-plugin';
import * as swagger from 'fastify-oas';
import { IncomingMessage, Server, ServerResponse } from 'http';

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
            servers: [
                {
                    url: 'http://127.0.0.1:5000/',
                    description: 'Local server, e.g. Main (development) server',
                },
                {
                    url: 'http://api.example.com/v1',
                    description: 'Optional server description, e.g. Main (production) server',
                },
            ],
        },
        exposeRoute: true,
        yaml: true,
        addModels: true,
        openapi: '3.0.0',
    });

    done();
});
