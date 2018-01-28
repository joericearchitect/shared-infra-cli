const fs = require('fs');
const yaml = require('js-yaml');
const config = require('../config/default-config');
const fsUtils = require('../../commons/util/file-utils');

module.exports = {
    buildConfiguration: function(cliContext) {
        let configContext = new this.CcnfigContext();

        configContext.devConfig = yaml.safeLoad(fs.readFileSync(config.defaultConfig.devConfigFilePath, 'utf8'));

        return configContext;
    },

    scanEnvironment: function(cliContext) {
        let configContextEnv = new this.ConfigContextEnv();

        configContextEnv.devConfigFilesExists = fsUtils.isFileSync(config.defaultConfig.devConfigFilePath);
        configContextEnv.gitHomeDirExists = fsUtils.isFileSync(config.defaultConfig.defaultJraGitHome);

        return configContextEnv;
    },

    initConfigContextFromResources: function(cliContext) {

    },

    initConfigContextFromUser: function(cliContext) {

    },

    CcnfigContext: class {
    },

    ConfigContextEnv: class {
    }
}