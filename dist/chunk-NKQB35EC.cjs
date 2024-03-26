"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// src/index.ts
var _unplugin = require('unplugin');

// src/adapter/HtmlRspackPlugin.ts
var _webpacksources = require('webpack-sources'); var _webpacksources2 = _interopRequireDefault(_webpacksources);

// src/helper/getAssets.ts
function getAssetsForViteJS(bundle) {
  const assets = /* @__PURE__ */ new Set();
  const outputs = Object.keys(bundle).sort();
  outputs.forEach((output) => {
    const entry = bundle[output].name || "";
    assets.add({ entry, output });
  });
  return assets;
}
function getAssetsForWebpackOrRspack(compilation) {
  const assets = /* @__PURE__ */ new Set();
  const isWebpack = "assetsInfo" in compilation;
  let outputs = [];
  let assetsInfo = /* @__PURE__ */ new Map();
  if (isWebpack) {
    assetsInfo = compilation.assetsInfo;
    outputs = Array.from(compilation.assetsInfo.keys()).sort();
  } else {
    const assetsStats = compilation.getStats().toJson({ all: false, assets: true }).assets || [];
    assetsInfo = new Map(assetsStats.map((asset) => [asset.name, asset.info]));
    outputs = Array.from(assetsStats.map((asset) => asset.name)).sort();
  }
  outputs.forEach((output) => {
    const entry = _optionalChain([assetsInfo, 'access', _ => _.get, 'call', _2 => _2(output), 'optionalAccess', _3 => _3.sourceFilename]) || "";
    assets.add({ entry, output });
  });
  return assets;
}

// src/helper/getTagsAttributes.ts
var _posix = require('path/posix');
var _url = require('url');
var _mimetypes = require('mime-types');

// src/helper/getAsWithMime.ts
function getAsWithMime(mime, log) {
  let destination = mime.split("/")[0];
  const validDestinations = [
    "audio",
    "audioworklet",
    "document",
    "embed",
    "font",
    "frame",
    "iframe",
    "image",
    "manifest",
    "object",
    "paintworklet",
    "report",
    "script",
    "sharedworker",
    "style",
    "track",
    "video",
    "worker",
    "xslt"
  ];
  if (["text/css"].includes(mime))
    destination = "style";
  else if (["application/javascript"].includes(mime))
    destination = "script";
  else if (["text/vtt"].includes(mime))
    destination = "track";
  if (validDestinations.includes(destination))
    return destination;
  log.warn(
    `[unplugin-inject-preload] No valid destinations for "${mime}". Define the 'as' attribute.`
  );
  return void 0;
}

// src/helper/getTagsAttributes.ts
function getTagsAttributes(assetsSet, options, basePath, log) {
  const tagsAttributes = [];
  const assets = Array.from(assetsSet);
  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    for (let index = 0; index < options.files.length; index++) {
      const file = options.files[index];
      if (!file.entryMatch && !file.outputMatch) {
        log.warn("[unplugin-inject-preload] You should have at least one option between entryMatch and outputMatch.");
        continue;
      }
      if (file.outputMatch && !file.outputMatch.test(asset.output))
        continue;
      if (file.entryMatch && !file.entryMatch.test(asset.entry))
        continue;
      const attrs = file.attributes || {};
      let href = "";
      if (basePath.indexOf("://") > 0) {
        href = _url.resolve.call(void 0, basePath, asset.output);
      } else {
        href = _posix.resolve.call(void 0, basePath, asset.output);
      }
      const type = attrs.type ? attrs.type : _mimetypes.lookup.call(void 0, asset.output);
      const as = typeof type === "string" ? getAsWithMime(type, log) : void 0;
      const finalAttrs = Object.assign(
        {
          rel: "preload",
          href,
          type,
          as
        },
        attrs
      );
      Object.keys(finalAttrs).forEach(
        (key) => typeof finalAttrs[key] === "undefined" && delete finalAttrs[key]
      );
      tagsAttributes.push(finalAttrs);
    }
  }
  return tagsAttributes;
}

// src/helper/html.ts
var customInject = /([ \t]*)<!--__unplugin-inject-preload__-->/i;
var headInjectRE = /([ \t]*)<\/head>/i;
var headPrependInjectRE = /([ \t]*)<head[^>]*>/i;
function injectToHead(html, tags, prepend = false) {
  if (tags.length === 0)
    return html;
  if (prepend) {
    if (headPrependInjectRE.test(html)) {
      return html.replace(
        headPrependInjectRE,
        (match, p1) => `${match}
${serializeTags(tags, incrementIndent(p1))}`
      );
    }
  } else {
    if (headInjectRE.test(html)) {
      return html.replace(
        headInjectRE,
        (match, p1) => `${serializeTags(tags, incrementIndent(p1))}${match}`
      );
    }
  }
  return html;
}
function injectToCustom(str, tags) {
  return str.replace(
    customInject,
    (match, p1) => `
${serializeTags(tags, p1)}`
  );
}
function serializeAttrs(attrs) {
  let res = "";
  for (const key in attrs) {
    if (typeof attrs[key] === "boolean")
      res += attrs[key] ? ` ${key}` : "";
    else
      res += ` ${key}=${JSON.stringify(attrs[key])}`;
  }
  return res;
}
function serializeTag({ tag, attrs }) {
  return `<${tag}${serializeAttrs(attrs)}>`;
}
function serializeTags(tags, indent = "") {
  return tags.map((tag) => `${indent}${serializeTag(tag)}
`).join("");
}
function incrementIndent(indent = "") {
  return `${indent}${indent[0] === "	" ? "	" : "  "}`;
}

// src/adapter/HtmlRspackPlugin.ts
var { RawSource } = _webpacksources2.default;
function htmlRspackPluginAdapter(args) {
  const { name: name2, compiler, options } = args;
  const injectTo = options.injectTo || "head-prepend";
  compiler.hooks.emit.tapAsync(name2, (compilation, callback) => {
    const pluginInstances = compilation.options.plugins.filter((plugin) => plugin && plugin.name === "HtmlRspackPlugin");
    if (!pluginInstances)
      return callback();
    const filenames = pluginInstances.flatMap((item) => item && "_options" in item ? [item._options.filename || "index.html"] : []);
    if (filenames.length === 0)
      return callback();
    const logger = compilation.getLogger(name2);
    const assets = getAssetsForWebpackOrRspack(compilation);
    const tags = [];
    const tagsAttributes = getTagsAttributes(
      assets,
      options,
      compilation.outputOptions.publicPath || "",
      logger
    );
    tagsAttributes.forEach((attrs) => {
      tags.push({
        tag: "link",
        attrs
      });
    });
    filenames.forEach((filename) => {
      const asset = compilation.getAsset(filename);
      if (!asset)
        return;
      const currentSourceString = asset.source.source();
      if (typeof currentSourceString !== "string")
        return;
      let updateSourceString;
      if (injectTo === "custom") {
        updateSourceString = injectToCustom(currentSourceString, tags);
      } else {
        updateSourceString = injectToHead(
          currentSourceString,
          tags,
          injectTo === "head-prepend"
        );
      }
      compilation.updateAsset(
        asset.name,
        new RawSource(updateSourceString),
        asset.info
      );
    });
    callback();
  });
}

// src/helper/getHtmlWebpackPlugin.ts
async function getHtmlWebpackPlugin(throwError = true) {
  try {
    const HtmlWebpackPlugin = await Promise.resolve().then(() => _interopRequireWildcard(require("html-webpack-plugin")));
    return HtmlWebpackPlugin;
  } catch (error) {
    if (throwError) {
      throw new Error(
        "unplugin-inject-preload needs to be used with HtmlWebpackPlugin"
      );
    }
  }
  return false;
}

// src/adapter/HtmlWebpackPlugin.ts
function htmlWebpackPluginAdapter(args) {
  const { name: name2, compiler, options } = args;
  compiler.hooks.compilation.tap(name2, async (compilation) => {
    const isWebpack = "assetsInfo" in compilation;
    const logger = compilation.getLogger(name2);
    const HtmlWebpackPlugin = await getHtmlWebpackPlugin(isWebpack);
    if (!HtmlWebpackPlugin)
      return;
    const hooks = HtmlWebpackPlugin.default.getHooks(compilation);
    let tagsAttributes = [];
    hooks.alterAssetTagGroups.tapAsync(
      name2,
      (data, cb) => {
        const assets = getAssetsForWebpackOrRspack(compilation);
        tagsAttributes = getTagsAttributes(
          assets,
          options,
          data.publicPath,
          logger
        );
        cb(null, data);
      }
    );
    if (options.injectTo === "custom") {
      hooks.beforeEmit.tapAsync(
        name2,
        (data, cb) => {
          const tags = [];
          tagsAttributes.forEach((attrs) => {
            tags.push({
              tag: "link",
              attrs
            });
          });
          data.html = injectToCustom(data.html, tags);
          cb(null, data);
        }
      );
    } else {
      hooks.alterAssetTagGroups.tapAsync(
        name2,
        (data, cb) => {
          tagsAttributes.forEach((attributes) => {
            data.headTags[options.injectTo === "head" ? "push" : "unshift"](
              {
                tagName: "link",
                attributes,
                voidTag: true,
                meta: {
                  plugin: name2
                }
              }
            );
          });
          cb(null, data);
        }
      );
    }
  });
}

// src/adapter/vite.ts
function viteAdapter(args) {
  const {
    bundle,
    html,
    options,
    viteBasePath: viteBasePath2,
    viteLogger: viteLogger2
  } = args;
  const injectTo = options.injectTo && options.injectTo !== "custom" ? options.injectTo : "head-prepend";
  const assets = getAssetsForViteJS(bundle);
  const tags = [];
  const tagsAttributes = getTagsAttributes(
    assets,
    options,
    viteBasePath2,
    viteLogger2
  );
  tagsAttributes.forEach((attrs) => {
    tags.push({
      tag: "link",
      attrs,
      injectTo
    });
  });
  if (options.injectTo === "custom")
    return injectToCustom(html, tags);
  else
    return tags;
}

// src/helper/checkPluginsDeps.ts
function checkPluginsDeps(name2, compiler, pluginNames) {
  compiler.hooks.emit.tapAsync(name2, (compilation, callback) => {
    const hasHtmlCompiler = compilation.options.plugins.findIndex((plugin) => {
      const pluginName = _optionalChain([plugin, 'optionalAccess', _4 => _4.constructor, 'access', _5 => _5.name]);
      return pluginName && pluginNames.includes(pluginName);
    }) > -1;
    if (!hasHtmlCompiler) {
      throw new Error(
        `unplugin-inject-preload needs to be used with ${pluginNames.join(" or ")}. Make sure to install and use your HTML plugin before unplugin-inject-preload.`
      );
    }
    callback();
  });
}

// src/index.ts
var viteBasePath;
var viteLogger;
var name = "unplugin-inject-preload";
var unpluginFactory = (options) => ({
  name,
  vite: {
    apply: "build",
    configResolved(config) {
      viteBasePath = config.base;
      viteLogger = config.logger;
    },
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle)
          return html;
        return viteAdapter({
          bundle,
          html,
          options,
          viteBasePath,
          viteLogger
        });
      }
    }
  },
  webpack: (compiler) => {
    checkPluginsDeps(name, compiler, ["HtmlWebpackPlugin"]);
    htmlWebpackPluginAdapter({
      name,
      compiler,
      options
    });
  },
  rspack: (compiler) => {
    checkPluginsDeps(name, compiler, ["HtmlWebpackPlugin", "HtmlRspackPlugin"]);
    const adapterObj = {
      name,
      compiler,
      options
    };
    htmlRspackPluginAdapter(adapterObj);
    htmlWebpackPluginAdapter(adapterObj);
  }
});
var unplugin = _unplugin.createUnplugin.call(void 0, unpluginFactory);
var src_default = unplugin;





exports.unpluginFactory = unpluginFactory; exports.unplugin = unplugin; exports.src_default = src_default;
