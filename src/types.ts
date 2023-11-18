import type { HtmlTagDescriptor, Logger } from 'vite'
import type { Compilation as WebpackCompilation, Compiler as WebpackCompiler } from 'webpack'
import type { Compilation as RspackCompilation, Compiler as RspackCompiler } from '@rspack/core'

export interface OptionsFiles {
  /**
   * Regular expression to target entry files
   */
  entryMatch?: RegExp
  /**
   * Regular expression to target build files
   */
  outputMatch?: RegExp
  /**
   * Attributes added to the preload links
   */
  attributes?: HtmlTagDescriptor['attrs']
}

export interface Options {
  /**
   * An array of file options
   */
  files: OptionsFiles[]
  /**
   * The position where the preload links are injected
   */
  injectTo?: 'head' | 'head-prepend' | 'custom'
}

export type AssetsSet = Set<{ entry: string, output: string }>
export type UnpluginCompilation = WebpackCompilation | RspackCompilation
export type UnpluginCompiler = WebpackCompiler | RspackCompiler
export type UnpluginLogger = Logger | WebpackCompilation['logger']
