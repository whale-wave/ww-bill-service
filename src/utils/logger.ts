import { Logger } from '@avanlan/logger';
import * as pkg from '../../package.json';

export const logger = new Logger({
  projectName: pkg.name,
});
