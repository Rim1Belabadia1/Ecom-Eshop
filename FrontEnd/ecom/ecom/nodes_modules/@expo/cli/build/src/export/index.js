#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.expoExport = void 0;
var _chalk = _interopRequireDefault(require("chalk"));
var _args = require("../utils/args");
var _errors = require("../utils/errors");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const expoExport = async (argv)=>{
    const args = (0, _args).assertArgs({
        // Types
        "--help": Boolean,
        "--clear": Boolean,
        "--dump-assetmap": Boolean,
        "--dev": Boolean,
        "--source-maps": Boolean,
        "--max-workers": Number,
        "--output-dir": String,
        "--platform": [
            String
        ],
        "--no-minify": Boolean,
        "--no-bytecode": Boolean,
        // Hack: This is added because EAS CLI always includes the flag.
        // If supplied, we'll do nothing with the value, but at least the process won't crash.
        // Note that we also don't show this value in the `--help` prompt since we don't want people to use it.
        "--experimental-bundle": Boolean,
        // Aliases
        "-h": "--help",
        "-s": "--source-maps",
        // '-d': '--dump-assetmap',
        "-c": "--clear",
        "-p": "--platform",
        // Interop with Metro docs and RedBox errors.
        "--reset-cache": "--clear",
        // Deprecated
        "--dump-sourcemap": "--source-maps"
    }, argv);
    if (args["--help"]) {
        (0, _args).printHelp(`Export the static files of the app for hosting it on a web server`, _chalk.default`npx expo export {dim <dir>}`, [
            _chalk.default`<dir>                      Directory of the Expo project. {dim Default: Current working directory}`,
            _chalk.default`--output-dir <dir>         The directory to export the static files to. {dim Default: dist}`,
            `--dev                      Configure static files for developing locally using a non-https server`,
            `--no-minify                Prevent minifying source`,
            `--no-bytecode              Prevent generating Hermes bytecode`,
            `--max-workers <number>     Maximum number of tasks to allow the bundler to spawn`,
            `--dump-assetmap            Emit an asset map for further processing`,
            _chalk.default`-p, --platform <platform>  Options: android, ios, web, all. {dim Default: all}`,
            `-s, --source-maps          Emit JavaScript source maps`,
            `-c, --clear                Clear the bundler cache`,
            `-h, --help                 Usage info`, 
        ].join("\n"));
    }
    const projectRoot = (0, _args).getProjectRoot(args);
    const { resolveOptionsAsync  } = await Promise.resolve().then(function() {
        return _interopRequireWildcard(require("./resolveOptions.js"));
    });
    const options = await resolveOptionsAsync(projectRoot, args).catch(_errors.logCmdError);
    const { exportAsync  } = await Promise.resolve().then(function() {
        return _interopRequireWildcard(require("./exportAsync.js"));
    });
    return exportAsync(projectRoot, options).catch(_errors.logCmdError);
};
exports.expoExport = expoExport;

//# sourceMappingURL=index.js.map