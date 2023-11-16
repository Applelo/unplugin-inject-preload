export async function getHTMLWebpackPlugin(throwError = true) {
  try {
    const HTMLWebpackPlugin = await import('html-webpack-plugin')
    return HTMLWebpackPlugin
  }
  catch (error) {
    if (throwError) {
      throw new Error(
        'unplugin-inject-preload needs to be used with html-webpack-plugin 5',
      )
    }
  }
  return false
}
