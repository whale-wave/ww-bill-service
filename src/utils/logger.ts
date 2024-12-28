import { Logger } from '@avanlan/logger';
import * as pkg from '../../package.json';

export const logger = new Logger({
  projectName: pkg.name,
  timezone: 'Asia/Shanghai',
  transportsFile: {
    maxsize: 400 * 1024 * 1024,
  },
  dailyRotateFile: {
    maxFiles: 30,
  },
});
