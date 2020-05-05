import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { ICsvparser, parseCsv } from './Csvparser';
import { IEmail, sendEmail } from './Email';
import { compareObjects, IObjectdiff } from './Objectdiff';
import { IPaginate, paginate } from './Paginate';
import { IResolveLocals, resolve } from './Resolvelocals';
import { buildSheet, ISheetbuilder } from './Sheetbuilder';
import { IStatusCodesInterface, statuscodes } from './Statuscodes';
import { compileEjs, ICompileTemplate } from './Template';
import { Itoken, jwt } from './Token';
import { extractFilepath, IUploader, uploader } from './Uploader';

// tslint:disable-next-line: no-empty-interface
export interface IPlugins extends IObjectdiff, IUploader, IStatusCodesInterface, ICompileTemplate, Itoken, IEmail, ICsvparser, IResolveLocals, IPaginate, ISheetbuilder {}

export default fp((app: FastifyInstance, opts: {}, done: (err?: Error) => void) => {
    app.decorate('plugins', { compareObjects, uploader, statuscodes, compileEjs, ...jwt, sendEmail, extractFilepath, parseCsv, resolve, paginate, buildSheet });

    // pass execution to the next middleware in fastify instance
    done();
});
