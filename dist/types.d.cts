import { HtmlTagDescriptor, Logger } from 'vite';
import { Compilation, Compiler } from 'webpack';
import { Compilation as Compilation$1, Compiler as Compiler$1 } from '@rspack/core';

interface OptionsFiles {
    /**
     * Regular expression to target entry files
     */
    entryMatch?: RegExp;
    /**
     * Regular expression to target build files
     */
    outputMatch?: RegExp;
    /**
     * Attributes added to the preload links
     */
    attributes?: HtmlTagDescriptor['attrs'];
}
interface Options {
    /**
     * An array of file options
     */
    files: OptionsFiles[];
    /**
     * The position where the preload links are injected
     */
    injectTo?: 'head' | 'head-prepend' | 'custom';
}
type AssetsSet = Set<{
    entry: string;
    output: string;
}>;
type UnpluginCompilation = Compilation | Compilation$1;
type UnpluginCompiler = Compiler | Compiler$1;
type UnpluginLogger = Logger | Compilation['logger'];
type PluginDeps = 'HtmlRspackPlugin' | 'HtmlWebpackPlugin';

export type { AssetsSet, Options, OptionsFiles, PluginDeps, UnpluginCompilation, UnpluginCompiler, UnpluginLogger };
