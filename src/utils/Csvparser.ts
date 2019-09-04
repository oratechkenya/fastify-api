import { readFileSync, unlinkSync } from 'fs';
import axios from 'axios';

export interface ICsvparser {
    /**
     * Read csv file and convert to an array of objects
     *
     * @param {string} filePath - path to csv file
     * @param {string[]} validator - an array of expected csv file headers for use in validation
     */
    parseCsv: (filepath: string, validator?: string[]) => Promise<{ message: 'success' | 'error'; data: any[] }>;
}

/**
 * Read csv file and convert to an array of objects
 *
 * @param {string} filePath - path to csv file
 * @param {string[]} validator - an array of expected csv file headers for use in validation
 */
export async function parseCsv(filePath: string, validator?: string[]) {
    let csvdata: string = '';

    if (filePath.includes('http')) {
        csvdata = await axios.get(filePath).then(res => res.data);
    } else {
        csvdata = readFileSync(filePath, { encoding: 'utf-8' });
    }

    // Split on row
    const splittedrows = csvdata.split('\n');

    // Get first row for column headers
    const headers = splittedrows.shift().split(',');

    const trimmedHeaders = [];

    headers.forEach(h => trimmedHeaders.push(h.replace('\r', '').trim()));

    if (validator) {
        if (!Array.isArray(validator)) {
            throw new Error('validator must be an array');
        }

        const errors = [];

        validator.forEach(value => {
            trimmedHeaders.findIndex(elem => elem === value) < 0 && errors.push({ expected: value });
        });

        if (errors.length) {
            return { message: 'error', data: errors };
        }
    }

    const data = [];

    splittedrows.forEach((d: string) => {
        // Loop through each row
        const tmp = {};

        const row = d.split(',');

        for (let i = 0; i < trimmedHeaders.length; i++) {
            if (trimmedHeaders[i] && row[i]) {
                tmp[trimmedHeaders[i].replace(' ', '')] = row[i].replace('\r', '').trim();
            }
        }

        Object.keys(tmp).length && data.push(tmp);
    });

    if (!filePath.includes('http')) {
        // delete the file from local storage
        unlinkSync(filePath);
    }

    return { message: 'success', data };
}
