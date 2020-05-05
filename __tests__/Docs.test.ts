import Server from '../src/bin/www';
import { expect } from 'chai';

const fastify = new Server().app;

after(() => fastify.close(() => null));

describe('should test swagger plugin', () => {
    it('should return swagger page /docs', async () => {
        try {
            const res = await fastify.inject({ method: 'GET', url: '/docs/index.html' });

            expect(res.statusCode).to.be.equal(200);
        } catch (er) {
            expect(er).to.be.false;
        }
    });
});
