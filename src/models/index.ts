import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { IncomingMessage, Server, ServerResponse } from 'http';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Account, IAccountDocument } from './Account';

export interface IDatabase {
    Account: Model<IAccountDocument>;
}

const models: IDatabase = {
    Account,
};

export default fp(async (app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: {}, done: (err?: Error) => void) => {
    mongoose.connection.on('connected', () => console.log('Mongo connected successfully'));
    mongoose.connection.on('error', console.log);

    await mongoose.connect(app.config.mongouri, { useNewUrlParser: true, keepAlive: true, useCreateIndex: true, useUnifiedTopology: true });

    app.decorate('models', models);

    done();
});
