"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getUserDefinedFaviconFile = getUserDefinedFaviconFile;
exports.getVirtualFaviconAssetsAsync = getVirtualFaviconAssetsAsync;
exports.getFaviconFromExpoConfigAsync = getFaviconFromExpoConfigAsync;
var _config = require("@expo/config");
var _imageUtils = require("@expo/image-utils");
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _publicFolder = require("./publicFolder");
var _log = require("../log");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require("debug")("expo:favicon");
function getUserDefinedFaviconFile(projectRoot) {
    return (0, _publicFolder).getUserDefinedFile(projectRoot, [
        "./favicon.ico"
    ]);
}
async function getVirtualFaviconAssetsAsync(projectRoot, { baseUrl , outputDir , files  }) {
    const existing = getUserDefinedFaviconFile(projectRoot);
    if (existing) {
        debug("Using user-defined favicon.ico file.");
        return null;
    }
    const data = await getFaviconFromExpoConfigAsync(projectRoot);
    if (!data) {
        return null;
    }
    await Promise.all([
        data
    ].map(async (asset)=>{
        const assetPath = _path.default.join(outputDir, asset.path);
        if (files) {
            debug("Storing asset for persisting: " + assetPath);
            files == null ? void 0 : files.set(asset.path, {
                contents: asset.source,
                targetDomain: "client"
            });
        } else {
            debug("Writing asset to disk: " + assetPath);
            await _fs.default.promises.writeFile(assetPath, asset.source);
        }
    }));
    function injectFaviconTag(html) {
        if (!html.includes("</head>")) {
            return html;
        }
        return html.replace("</head>", `<link rel="shortcut icon" href="${baseUrl}/favicon.ico" /></head>`);
    }
    return injectFaviconTag;
}
async function getFaviconFromExpoConfigAsync(projectRoot, { force =false  } = {}) {
    var ref;
    const { exp  } = (0, _config).getConfig(projectRoot);
    var ref1;
    const src = (ref1 = (ref = exp.web) == null ? void 0 : ref.favicon) != null ? ref1 : null;
    if (!src) {
        return null;
    }
    const dims = [
        16,
        32,
        48
    ];
    const cacheType = "favicon";
    const size = dims[dims.length - 1];
    try {
        const { source  } = await (0, _imageUtils).generateImageAsync({
            projectRoot,
            cacheType
        }, {
            resizeMode: "contain",
            src,
            backgroundColor: "transparent",
            width: size,
            height: size,
            name: `favicon-${size}.png`
        });
        const faviconBuffer = await (0, _imageUtils).generateFaviconAsync(source, dims);
        return {
            source: faviconBuffer,
            path: "favicon.ico"
        };
    } catch (error) {
        // Check for ENOENT
        if (!force && error.code === "ENOENT") {
            _log.Log.warn(`Favicon source file in Expo config (web.favicon) does not exist: ${src}`);
            return null;
        }
        throw error;
    }
}

//# sourceMappingURL=favicon.js.map