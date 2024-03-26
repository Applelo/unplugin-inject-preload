import { UnpluginFactory, UnpluginInstance } from 'unplugin';
import { Options } from './types.js';
import 'vite';
import 'webpack';
import '@rspack/core';

declare const unpluginFactory: UnpluginFactory<Options>;
declare const unplugin: UnpluginInstance<Options, boolean>;

export { unplugin as default, unplugin, unpluginFactory };
