const fs = require('fs');
const yaml = require('js-yaml');
const config = require('../config/default-config');
const fsUtils = require('../../commons/util/file-utils');

module.exports = {
    buildConfiguration: function(cliContext) {
        let configuration = new this.CliContextConfiguration();

        configuration = yaml.safeLoad(fs.readFileSync(config.defaultConfig.devConfigFilePath, 'utf8'));

        configuration.cacheConfigs = buildRuntimeInfoCacheConfiguration()

        return configuration;
    },

    initConfigContextFromResources: function(cliContext) {

    },

    initConfigContextFromUser: function(cliContext) {

    },

    CliContextConfiguration: class {
    }
}

class CacheConfigs {

}

function buildRuntimeInfoCacheConfiguration() {
    cacheConfigs = new CacheConfigs();

    // TODO - for now, hardcode to the default location.  Go back and build the cache configs dynamically.  Taking
    // into account env variables and parameters passed in.
    cacheConfigs.jraApplicationCacheConfig = config.defaultConfig.jraApplicationCache;
    cacheConfigs.jraEnvironmentCacheConfig = config.defaultConfig.jraEnvironmentCache;
    cacheConfigs.jraContainerClusterNodeCacheConfig = config.defaultConfig.jraContainerClusterNodeCache;
    cacheConfigs.jraContainerClusterCacheConfig = config.defaultConfig.jraContainerClusterCache;
    cacheConfigs.jraContainerCacheConfig = config.defaultConfig.jraContainerCache;
    cacheConfigs.jraApplicationServiceCacheConfig = config.defaultConfig.jraApplicationServiceCache;
    cacheConfigs.jraApplicationGroupCacheConfig = config.defaultConfig.jraApplicationGroupCache;

    return cacheConfigs;
}