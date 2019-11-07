import * as fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import * as puppeteer from 'puppeteer';

export default fp(async (app: FastifyInstance, opts: {}, done: (err?: Error) => void) => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] });

    /**
     *
     * Dependencies for chromium on live server/linux based host.
     *
     * sudo apt-get install libx11-xcb1 libxcomposite1 libxi6 libxext6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 \
     * libasound2 libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0
     *
     * Install them before running puppeteer
     */

    // decorate fastify with a browser instance
    app.decorate('browser', browser);

    // pass execution to the next middleware in fastify's stack
    done();
});
