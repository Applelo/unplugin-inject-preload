import type { PluginDeps, UnpluginCompiler } from '../types'

export function checkPluginsDeps(name: string, compiler: UnpluginCompiler, pluginNames: PluginDeps[]) {
  compiler.hooks.emit.tapAsync(name, (compilation, callback: () => void) => {
    const hasHtmlCompiler = compilation.options.plugins.findIndex((plugin) => {
      const pluginName = plugin?.constructor.name as PluginDeps
      return pluginName && pluginNames.includes(pluginName)
    }) > -1

    if (!hasHtmlCompiler) {
      throw new Error(
        `unplugin-inject-preload needs to be used with ${pluginNames.join(' or ')}. Make sure to install and use your HTML plugin before unplugin-inject-preload.`,
      )
    }

    callback()
  })
}
