const fs = require('fs');
const config = require('../config/default-config');
const configContextBuilder = require('./config-context-builder');
const runtimeContextBuilder = require('./runtime-context-builder');

module.exports = {
    initalizeCliMetadata: function () {
        let cliContext = new this.CliContext();

        cliContext.contexts = new this.CliContextEntries();

        cliContext.envs = this.scanCliEnv();

        cliContext.contexts.configContext = configContextBuilder.initalizeConfigContext(cliContext);
        cliContext.contexts.runtimeContext = runtimeContextBuilder.initializeRuntimeContext(cliContext);

        return cliContext;
    },

    scanCliEnv: function(cliContext) {
        let cliEnv = new this.CliContextEnv();

        cliEnv.configEnv = configContextBuilder.scanConfigContextEnv(cliContext);
        cliEnv.runtimeEnv = runtimeContextBuilder.scanRuntimeContextEnv(cliContext);

        return cliEnv;
    },

    CliContext: class {
    },

    CliContextEntries: class {

    },

    CliContextEnv: class {
    }
}