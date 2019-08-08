import * as fp from 'fastify-plugin';
import * as firebase from 'firebase-admin';
import { readFileSync, unlinkSync } from 'fs';
import { Schema } from 'mongoose';
import { IUserDocument, User } from '../models/User';
import { configs } from '../configs';

export interface IFirebase {
    listDirectory: () => Promise<string>;
    /**
     * Push notification to device, for user with id `id`
     *
     * @param {Schema.Types.ObjectId} id - user id
     * @param {any} payload - payload to send as the notification message
     *
     * @memberof IFirebase
     */
    pushNotification: (id: Schema.Types.ObjectId, payload: any) => Promise<any>;

    /**
     * Upload media files to firebase
     *
     * @param {string} basedir
     * @param {string} filename
     *
     * @returns {string} public absolute url for the uploaded file
     *
     * @memberof IFirebase
     */
    uploadBinaryData: (basedir: string, filename: string) => Promise<string>;
}

const cert = readFileSync(configs.firebaseAccountJsonFile, 'utf-8');

// initialize firebase here
firebase.initializeApp({ credential: firebase.credential.cert(JSON.parse(cert)), databaseURL: 'https://sample-firebase.firebaseio.com', storageBucket: 'gs://sample-firebase.appspot.com/' });

const firebaseApp = firebase.app();

async function listDirectory(basedir: string) {
    //
}

export async function pushNotification(id: Schema.Types.ObjectId, payload: any) {
    const user: IUserDocument[] = await User.aggregate([{ $match: id }]);

    if (!user.length) {
        return { error: 'user-not-found', message: 'User with id specified could not be found' };
    }

    const token = user[0]['token'];

    if (!token) {
        return { error: 'device-token-not-found', message: 'Device token could not be found' };
    }

    firebaseApp.messaging().sendToDevice(token, payload);

    return { message: 'success' };
}

async function uploadBinaryData(basedir: string, filepath: string) {
    const bucket = firebaseApp.storage().bucket();

    bucket.upload(filepath, { resumable: true, destination: basedir }).then(([File]) => {
        File.makePublic();

        try {
            unlinkSync(filepath);
        } catch {
            //
        }
    });

    return `https://storage.googleapis.com/${bucket.name}/${basedir}`;
}

export default fp(async (app, opts, done: (err?: Error) => void) => {
    // add firebase decorator to fastify
    app.decorate('firebase', { listDirectory, pushNotification, uploadBinaryData });

    // pass execution to the next middleware
    done();
});
