import * as ejs from 'ejs';
import { readFileSync } from 'fs';
import { minify } from 'html-minifier';
import { join } from 'path';

interface ITemplatePaths {
    template: 'account-creation' | 'reset-password';
}

export interface ITemplate {
    /**
     * Compile .ejs file, specified path and data
     *
     * @memberof ITemplate
     */
    compile: (template: ITemplatePaths, data?: any) => string;
}

const rootPath = join(__dirname, '..', '..', 'views');

const templates = {
    'account-creation': 'accounts/new-account.ejs',
    'reset-password': 'accounts/password-reset.ejs',
};

export interface ICompileTemplate {
    /**
     * Compile .ejs file, specified path and data
     *
     * @memberof ITemplate
     */
    compileEjs: (template: ITemplatePaths) => (data?: any) => string;
}

export const compileEjs = (template: ITemplatePaths) => {
    const text = readFileSync(rootPath + templates[template.template], 'utf-8');

    const fn = (data?: any) => {
        const html = ejs.compile(text)(data);

        return minify(html, { collapseWhitespace: true });
    };

    return fn;
};
