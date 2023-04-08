export const getHTMLWebpackPlugin = async () => {
  try {
    const HTMLWebpackPlugin = await import('html-webpack-plugin')
    return HTMLWebpackPlugin.default
  }
  catch (error) {
    throw new Error(
      'unplugin-inject-preload needs to be used with html-webpack-plugin 5',
    )
  }
}
