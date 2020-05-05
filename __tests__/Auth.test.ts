import Server from '../src/bin/www';
import { expect } from 'chai';

const fastify = new Server().app;

after(() => fastify.close(() => null));

describe('should authorize user and give token', () => {
    it('should return authorization token', async () => {
        try {
            const res = await fastify.inject({ method: 'POST', url: '/auth/sign-in', payload: { email: 'sample@email.com', password: 'samplepwd' } });

            expect(JSON.parse(res.payload)['token']).not.to.be.undefined;
            expect(res.statusCode).to.be.equal(200);
        } catch (er) {
            expect(er).to.be.false;
        }
    });
});
