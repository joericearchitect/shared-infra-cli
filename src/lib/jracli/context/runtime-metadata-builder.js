const fs = require('fs');
const moment = require('moment');
const requestSync = require('sync-request');
const Stopwatch = require("node-stopwatch").Stopwatch;
const AWS = require('aws-sdk');
const deasync = require("deasync");

const logger = require("../util/logger")


const defaultConfig = require('../config/default-config');
const fsUtils = require('../../commons/util/file-utils');

module.exports = {
    initializeRuntimeInfo: function (cliContext) {
        let runtimeInfo = new CliContextRuntimeInfo();

        return runtimeInfo;
    },

    buildRuntimeMetadata: function (cliContext) {
        let runtimeMetadata = new CliContextRuntimeMetadata();
        let cacheConfigs = cliContext.configuration.cacheConfigs;

        runtimeMetadata.jraApplicationMetadata = scanRuntimeMetadata(cacheConfigs.jraApplicationCacheConfig);
        runtimeMetadata.jraApplicationGroupMetadata = scanRuntimeMetadata(cacheConfigs.jraApplicationGroupCacheConfig);
        runtimeMetadata.jraApplicationServiceMetadata = scanRuntimeMetadata(cacheConfigs.jraApplicationServiceCacheConfig);
        runtimeMetadata.jraContainerMetadata = scanRuntimeMetadata(cacheConfigs.jraContainerCacheConfig);
        runtimeMetadata.jraContainerClusterMetadata = scanRuntimeMetadata(cacheConfigs.jraContainerClusterCacheConfig);
        runtimeMetadata.jraContainerClusterNodeMetadata = scanRuntimeMetadata(cacheConfigs.jraContainerClusterNodeCacheConfig);
        runtimeMetadata.jraEnvironmentMetadata = scanRuntimeMetadata(cacheConfigs.jraEnvironmentCacheConfig);

        return runtimeMetadata;
    },

    getApplicationRuntimeInfo: getApplicationRuntimeInfo,

    getEnvironmentRuntimeInfo: getEnvironmentRuntimeInfo
}

class CacheMeta {

}

class CliContextRuntimeInfo {

}

class CliContextRuntimeMetadata {

}

class CliContextRuntimeMetadataEntry {

}

function scanRuntimeMetadata(cacheConfig) {
    let runtimeMetadata = new CliContextRuntimeMetadataEntry();

    runtimeMetadata.cacheConfig = cacheConfig;

    runtimeMetadata.cacheFileExists = fsUtils.isFileSync(cacheConfig.cacheFilePath);

    runtimeMetadata.cacheFilePath = cacheConfig.cacheFilePath;

    if (!runtimeMetadata.cacheFileExists) {
        runtimeMetadata.cacheBuildIsNeeded = true;

        return runtimeMetadata;
    }

    let cacheFileContents;

    try {
        cacheFileContents = JSON.parse(fs.readFileSync(cacheConfig.cacheFilePath, 'utf8'));
    } catch (e) {
        let cacheReadError = {};
        cacheReadError.errorMessage = "Error trying to read cacheFile: '" + cacheConfig.cacheFilePath + "'.  Error:  " + e;
        runtimeMetadata.cacheHasError = true;
        runtimeMetadata.cacheBuildIsNeeded = true;
        runtimeMetadata.cacheReadError = cacheReadError;

        return runtimeMetadata;
    }

    if (cacheFileContents == null ||
        cacheFileContents.cacheMeta == null ||
        cacheFileContents.cacheMeta.lastRunTimestamp == null ||
        !moment(cacheFileContents.cacheMeta.lastRunTimestamp).isValid())
    {
        runtimeMetadata.cacheBuildIsNeeded = true;
        return runtimeMetadata;
    }

    runtimeMetadata.cacheMeta = cacheFileContents.cacheMeta;

    if (runtimeMetadata.cacheMeta.nextScheduledRunTimestamp == null ||
        !moment(runtimeMetadata.cacheMeta.nextScheduledRunTimestamp).isValid())
    {
        let lastRunTimestamp = moment(runtimeMetadata.cacheMeta.lastRunTimestamp);
        runtimeMetadata.cacheMeta.nextScheduledRunTimestamp = lastRunTimestamp.add(cacheConfig.cacheDurationSeconds, 'seconds');
    }

    if (moment(runtimeMetadata.cacheMeta.nextScheduledRunTimestamp) < moment()) {
        runtimeMetadata.cacheBuildIsNeeded = true;
        return runtimeMetadata;
    }

    runtimeMetadata.cacheBuildIsNeeded = false;
    return runtimeMetadata;
}

/*
 --------------------------------------------------------------------------------------------------------------------
 - Application Runtime Metadata
 --------------------------------------------------------------------------------------------------------------------
*/
class JraApplicationRuntimeInfo {

}

function getApplicationRuntimeInfo(cliContext) {
    let runtimeInfo = cliContext.runtimeInfo;

    if (runtimeInfo.jraApplicationRuntimeInfo != null) {
        return runtimeInfo.jraApplicationRuntimeInfo;
    }

    let jraApplicationMetadata = cliContext.runtimeMetadata.jraApplicationMetadata;

    if (jraApplicationMetadata != null && !jraApplicationMetadata.cacheBuildIsNeeded) {
        runtimeInfo.jraApplicationRuntimeInfo = loadJraApplicationRuntimeInfoFromCache(cliContext, jraApplicationMetadata);
    } else {
        runtimeInfo.jraApplicationRuntimeInfo = buildJraApplicationsRuntimeInfo(cliContext, jraApplicationMetadata);
    }

    return runtimeInfo.jraApplicationRuntimeInfo;
}

function loadJraApplicationRuntimeInfoFromCache(cliContext, jraApplicationMetadata) {
    let jraApplicationRuntimeInfo;

    try {
        jraApplicationRuntimeInfo = JSON.parse(fs.readFileSync(jraApplicationMetadata.cacheConfig.cacheFilePath, 'utf8'));
    } catch (e) {
        // TODO add more robust error messaging.  In this case, we're going to return null so we can build a new context.
        // But need to log a warning.
        console.log("Warning.  Error trying to parse json file:  '" + jraApplicationMetadata.cacheConfig.cacheFilePath + "'.  Error:  '" + e + "'");
        return null;
    }

    return jraApplicationRuntimeInfo;
}

function buildJraApplicationsRuntimeInfo(cliContext, jraApplicationMetadata) {
    logger.logBanner("Building JRA Application Runtime Info...");

    let jraApplicationRuntimeInfo = new JraApplicationRuntimeInfo();

    let stopwatch = Stopwatch.create();

    let cacheMeta = startBuildContext(stopwatch, jraApplicationMetadata.cacheConfig);


    stopBuildContext(cacheMeta, stopwatch, jraApplicationMetadata.cacheConfig);

    return jraApplicationRuntimeInfo;
}

/*
 --------------------------------------------------------------------------------------------------------------------
 - Environment Runtime Metadata
 --------------------------------------------------------------------------------------------------------------------
*/
class JraEnvironmentRuntimeInfo {

}

function getEnvironmentRuntimeInfo(cliContext) {
    let runtimeInfo = cliContext.runtimeInfo;

    if (runtimeInfo.jraEnvironmentRuntimeInfo != null) {
        return runtimeInfo.jraEnvironmentRuntimeInfo;
    }

    let jraEnvironmentMetadata = cliContext.runtimeMetadata.jraEnvironmentMetadata;

    if (jraEnvironmentMetadata != null && !jraEnvironmentMetadata.cacheBuildIsNeeded) {
        runtimeInfo.jraEnvironmentRuntimeInfo = loadJraEnvironmentRuntimeInfoFromCache(cliContext, jraEnvironmentMetadata);
    } else {
        runtimeInfo.jraEnvironmentRuntimeInfo = buildJraEnvironmentRuntimeInfo(cliContext, jraEnvironmentMetadata);
    }

    return runtimeInfo.jraEnvironmentRuntimeInfo;
}

function loadJraEnvironmentRuntimeInfoFromCache(cliContext, jraEnvironmentMetadata) {
    let jraEnvironmentRuntimeInfo;

    try {
        jraEnvironmentRuntimeInfo = JSON.parse(fs.readFileSync(jraEnvironmentMetadata.cacheConfig.cacheFilePath, 'utf8'));
    } catch (e) {
        // TODO add more robust error messaging.  In this case, we're going to return null so we can build a new context.
        // But need to log a warning.
        console.log("Warning.  Error trying to parse json file:  '" + jraEnvironmentMetadata.cacheConfig.cacheFilePath + "'.  Error:  '" + e + "'");
        return null;
    }

    return jraEnvironmentRuntimeInfo;
}

function buildJraEnvironmentRuntimeInfo(cliContext, jraEnvironmentMetadata) {
    logger.logBanner("Building JRA Environment Runtime Info...");

    let jraEnvironmentRuntimeInfo = new JraEnvironmentRuntimeInfo();

    let stopwatch = Stopwatch.create();

    // ----------------------- build logic START ---------------------------------------------------------------------

    // ----------------------- build logic END ---------------------------------------------------------------------

    stopBuildContext(cacheMeta, stopwatch, jraEnvironmentMetadata.cacheConfig);

    return jraEnvironmentRuntimeInfo;
}

/*
 --------------------------------------------------------------------------------------------------------------------
 - Utility Functions
 --------------------------------------------------------------------------------------------------------------------
*/

function startBuildContext(stopwatch, runtimeMetadataCacheConfig) {
    cacheMeta = new CacheMeta();

    stopwatch.start();

    return cacheMeta;
}

function stopBuildContext(cacheMeta, stopwatch, runtimeMetadataCacheConfig) {
    stopwatch.stop();

    cacheMeta.lastRunTimestamp = moment();
    cacheMeta.lastRunDurationMilis = stopwatch.elapsedMilliseconds;
    cacheMeta.lastRunDurationDisplay = stopwatch.elapsed.seconds + " seconds";
    cacheMeta.nextScheduledRunTimestamp = cacheMeta.lastRunTimestamp.add(runtimeMetadataCacheConfig.cacheDurationSeconds, 'seconds');

    return cacheMeta;
}

