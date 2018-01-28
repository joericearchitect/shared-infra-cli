const fs = require('fs');
const defaultConfig = require('../config/default-config');
const configContextBuilder = require('./configuration-builder');
const environmentInitializer = require('./environment-initilizer');
const environmentMetadataBuilder = require('./environment-metadata-builder');
const runtimeMetadataBuilder = require('./runtime-metadata-builder');

module.exports = {
    initalizeCliContext: function () {
        let cliContext = new this.CliContext();

        cliContext.environmentMetadata = environmentMetadataBuilder.scanEnvironment(cliContext);
        cliContext.configuration = configContextBuilder.buildConfiguration(cliContext)
        cliContext.runtimeMetadata = runtimeMetadataBuilder.scanRuntimeMetadataEnv(cliContext);

        cliContext.runtimeInfo = runtimeMetadataBuilder.initializeRuntimeInfo(cliContext);

        return cliContext;
    },

    CliContext: class {
    }
}