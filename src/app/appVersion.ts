import pkg from '../../package.json' assert { type: 'json' };

export const APP_VERSION = pkg.version;
export const APP_VERSION_LABEL = `v${pkg.version}`;
