export async function getHtmlWebpackPlugin(throwError = true) {
  try {
    const HtmlWebpackPlugin = await import('html-webpack-plugin')
    return HtmlWebpackPlugin
  }
  catch (error) {
    if (throwError) {
      throw new Error(
        'unplugin-inject-preload needs to be used with HtmlWebpackPlugin',
      )
    }
  }
  return false
}
