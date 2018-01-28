const fs = require('fs');
const yaml = require('js-yaml');
const config = require('../config/default-config');
const fsUtils = require('../../commons/util/file-utils');

module.exports = {
    scanEnvironment: function(cliContext) {
        let environmentMetadata = new this.CliContextEnvironmentMetadata();

        environmentMetadata.devConfigFilesExists = fsUtils.isFileSync(config.defaultConfig.devConfigFilePath);
        environmentMetadata.gitHomeDirExists = fsUtils.isFileSync(config.defaultConfig.defaultJraGitHome);

        return environmentMetadata;
    },

    CliContextEnvironmentMetadata: class {
    }
}