import { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.app.json';

const config: Config.InitialOptions = {
  verbose: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>',
  }),
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
};

export default config;
