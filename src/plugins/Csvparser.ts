import axios from 'axios';
import { readFileSync, unlinkSync } from 'fs';

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
    let csvdata = '';

    if (filePath.includes('http')) {
        csvdata = await axios.get(filePath).then((res) => res.data);
    } else {
        csvdata = readFileSync(filePath, { encoding: 'utf-8' });
    }

    // Split into and remove empty rows
    const rows = csvdata.split(/\r?\n/).filter((a) => a);

    // Get first row for column headers and remove it from list
    const headers = rows.shift().split(',');

    const trimmedHeaders: string[] = [];

    for (const header of headers) {
        trimmedHeaders.push(header.replace('\r', '').trim());
    }

    if (validator) {
        if (!Array.isArray(validator)) {
            throw new Error('validator must be an array');
        }

        const errors = [];

        for (const validate of validator) {
            trimmedHeaders.findIndex((header) => header === validate) < 0 && errors.push({ expected: validate });
        }

        if (errors.length) {
            return { message: 'error', data: errors };
        }
    }

    const data = [];

    // Loop through each row
    for (const row of rows) {
        const tmp = {};

        const columnValues = row.split(',');

        for (let i = 0; i < trimmedHeaders.length; i++) {
            if (trimmedHeaders[i] && columnValues[i]) {
                tmp[trimmedHeaders[i].replace(' ', '')] = columnValues[i].replace('\r', '').trim();
            }
        }

        Object.keys(tmp).length && data.push(tmp);
    }

    if (!filePath.includes('http')) {
        // delete the file from local storage
        unlinkSync(filePath);
    }

    return { message: 'success', data };
}
