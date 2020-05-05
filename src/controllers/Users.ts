import Controller from '../plugins/Controller';

export default class Users extends Controller {
    public async findAllEntries(): Promise<any> {
        throw new Error('Method not implemented');
    }

    public async findOneAndUpdate(): Promise<any> {
        throw new Error('Method not implemented');
    }

    public async addNewEntry(): Promise<any> {
        throw new Error('Method not implemented');
    }

    public async findOneEntry(): Promise<any> {
        throw new Error('Method not implemented');
    }
    public async authenticate() {
        // implementation here

        return { token: '7yhr4n3fvgbu8jnh3i2hrf4hy7c23' };
    }
    /**
     * Reset user password, to a an auto-generated password
     *
     * @returns
     * @memberof Platformusers
     */
    public async resetUserPassword() {
        throw new Error('Method not implemented');
    }
}
