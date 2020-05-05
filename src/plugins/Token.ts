import * as jsonwebtoken from 'jsonwebtoken';
import { configs } from '../configs';
import { IAccount } from '../models/Account';

/**
 * Payload expected by JWT's sign token function.
 *
 * @interface IJWTPayload
 */
interface ItokenPayload {
    email: string;
    id: string;
    account: IAccount['account'];
}

export interface Itoken {
    sign: (options: ItokenPayload) => string;
    verify: (token: string) => ItokenPayload;
}

/**
 * JWT tokens signing, verification and decoding utility.
 *
 * @export
 * @class Token
 */
export const jwt = {
    /**
     * Use JWT to sign a token
     */
    sign: (options: ItokenPayload) => {
        const { email, id, account }: ItokenPayload = options;

        if (!email || !id || !account) {
            throw new Error('Expects email, account type and id in payload.');
        }

        return jsonwebtoken.sign({ email, id, account }, configs.jwtsecret);
    },
    /**
     * Verify token, and get passed in variables
     */
    verify: (token: string) => {
        try {
            return jsonwebtoken.verify(token, configs.jwtsecret) as ItokenPayload;
        } catch (error) {
            return { email: null, account: null, id: null };
        }
    },
};
