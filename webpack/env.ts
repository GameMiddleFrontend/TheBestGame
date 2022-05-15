import {join} from 'path';

const IS_DEV = process.env.NODE_ENV !== 'production';
const SRC_DIR = join(__dirname, '../src');
const DIST_DIR = join(__dirname, '../dist');
const ROOT_DIR = __dirname;

export {IS_DEV, SRC_DIR, DIST_DIR, ROOT_DIR};
