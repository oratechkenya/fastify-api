import * as cluster from 'cluster';
import * as ejs from 'ejs';
import fastify, { FastifyInstance } from 'fastify';
import cookie from 'fastify-cookie';
import cors from 'fastify-cors';
import servefavicon from 'fastify-favicon';
import multer from 'fastify-multer';
import { IncomingMessage, Server, ServerResponse } from 'http';
import * as moment from 'moment';
import * as os from 'os';
import { join, resolve } from 'path';
import viewengine from 'point-of-view';
import servestatic from 'fastify-static';
import config from '../configs';
import docs from '../docs';
import database from '../models';
import browser from '../libraries/Browser';
import utilities from '../plugins';
import autoload from 'fastify-autoload';

const settings = require(join(__dirname, '..', '..', 'settings.json'));

/**
 * Application server instance.
 *
 * @export
 * @class App
 */
export default class App {
    /**
     * Application server instance.
     *
     * @private
     * @type {fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>}
     * @memberof App
     */
    public app: FastifyInstance<Server, IncomingMessage, ServerResponse>;

    /**
     * Application port number
     *
     * @private
     * @type {string}
     * @memberof App
     */
    private port: number | string;

    constructor() {
        this.port = process.env.PORT || 5000;
        this.app = fastify({ ignoreTrailingSlash: true, logger: { level: 'fatal' } });
        this.config();
    }

    /**
     * Start application server.
     *
     * @memberof App
     */
    public async start() {
        if (settings.scale) {
            if (cluster.isMaster) {
                await this.workerProcesses();
            } else {
                await this.app.listen(this.port as number, '0.0.0.0').catch(console.log);
            }
        } else {
            await this.app.listen(this.port as number, '0.0.0.0').catch(console.log);
        }

        console.log('Server listening on port', this.app.server.address());

        process.on('uncaughtException', console.error);

        process.on('unhandledRejection', console.error);

        // graceful shutdown for processes, and fastify's browser instance
        for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as NodeJS.Signals[]) {
            process.on(signal, async () => {
                this.app.browser && (await this.app.browser.close());
                process.exit();
            });
        }
    }

    /**
     * Application level configurations
     *
     * @private
     * @memberof App
     */
    private config() {
        if (process.env.NODE_ENV !== 'production') {
            this.app.setErrorHandler(async (err, _req, _res) => {
                console.log(err);
            });
        }

        this.app.register(cors, { preflight: true, credentials: true });

        this.app.register(servefavicon, { path: join(__dirname, '..', '..') });

        this.app.register(config);

        this.app.register(database);

        this.app.register(utilities);

        this.app.register(browser);

        this.app.register(cookie);

        this.app.register(multer.contentParser);

        this.app.addHook('onRequest', (req, res, next) => {
            // remove trailing slash
            if (req.url.endsWith('/') && req.url !== '/') {
                res.raw.writeHead(301, { Location: 'http://' + req.headers['host'] + req.url.slice(0, -1) });
                res.raw.end();
            }

            next();
        });

        this.app.register(docs);

        this.app.register(servestatic, { root: join(__dirname, '..', '..', 'uploads'), wildcard: false, prefix: '/uploads' });
        this.app.register(servestatic, { root: join(__dirname, '..', '..', 'public'), wildcard: false, prefix: '/public' });

        this.app.register(viewengine, {
            engine: { ejs },
            templates: join(__dirname, '..', '..', 'views'),
            options: {
                filename: resolve(__dirname, '..', '..', 'views'),
            },
            includeViewExtension: true,
            defaultContext: {
                moment,
                viewsRoot: join(__dirname, '..', '..', 'views/'),
            },
        });

        this.app.decorateRequest('user', () => {});

        this.app.addHook('preHandler', (req, res, next: (err?: Error) => void) => {
            const auth = req.headers['authorization'] as string;

            try {
                const token = auth.split(' ')[1];

                req.user = this.app.plugins.verify(token);
            } catch {
                //
            }

            next();
        });

        // register routes
        this.app.register(autoload, {
            dir: join(__dirname, '..', 'services'),
            // includeTypeScript: true,
        });
    }

    private async workerProcesses() {
        const cpus = os.cpus();

        for (const _cpu in cpus) {
            cluster.fork();
        }

        cluster.on('exit', async (_worker) => {
            cluster.fork();
        });
    }
}
