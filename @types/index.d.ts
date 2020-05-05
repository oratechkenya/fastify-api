import { IncomingMessage, Server, ServerResponse } from 'http';
import { IConfig } from '../src/configs';
import { IDatabase } from '../src/models';
import { IPlugins } from '../src/plugins';
import { Browser } from 'puppeteer';
import { IAccount } from '../src/models/Account';

interface IUserCredentials {
    id: string;
    email: string;
    account: IAccount['account'];
}

declare module 'fastify' {
    interface FastifyInstance<HttpServer = Server, HttpRequest = IncomingMessage, HttpResponse = ServerResponse> {
        config: IConfig;
        models: IDatabase;
        plugins: IPlugins;

        browser: Browser;
    }

    interface FastifyRequest {
        user: IUserCredentials;
    }
}
