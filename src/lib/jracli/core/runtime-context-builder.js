const fs = require('fs');
const moment = require('moment');
const requestSync = require('sync-request');
const Stopwatch = require("node-stopwatch").Stopwatch;

const logger = require("../util/logger")


const config = require('../config/default-config');
const fsUtils = require('../../commons/util/file-utils');

module.exports = {
    initializeRuntimeContext: function (cliContext) {
        let runtimeContext = new this.RuntimeContext();

        if (cliContext.envs.runtimeEnv == null) {
            // TODO add error handling.  If RuntimeEnv is null for any reason, exit script
        }

        return runtimeContext;
    },

    scanRuntimeContextEnv: function (cliContext) {
        let runtimeContextEnv = new this.RuntimeContextEnv();

        runtimeContextEnv.jraApplicationRuntime = scanRuntimeContextEnvEntry(config.defaultConfig.jraApplicationCache);
        runtimeContextEnv.jraApplicationGroupRuntime = scanRuntimeContextEnvEntry(config.defaultConfig.jraApplicationGroupCache);
        runtimeContextEnv.jraApplicationServiceRuntime = scanRuntimeContextEnvEntry(config.defaultConfig.jraApplicationServiceCache);
        runtimeContextEnv.jraContainerRuntime = scanRuntimeContextEnvEntry(config.defaultConfig.jraContainerCache);
        runtimeContextEnv.jraContainerClusterRuntime = scanRuntimeContextEnvEntry(config.defaultConfig.jraContainerClusterCache);
        runtimeContextEnv.jraContainerClusterNodeRuntime = scanRuntimeContextEnvEntry(config.defaultConfig.jraContainerClusterNodeCache);
        runtimeContextEnv.jraEnvironmentRuntime = scanRuntimeContextEnvEntry(config.defaultConfig.jraEnvironmentCache);

        return runtimeContextEnv;
    },

    RuntimeContext: class {
    },

    RuntimeContextEnv: class {

    },

    getApplicationMetadata,

    getEnvironmentMetadata
}

class CacheMeta {

}

class RuntimeContextEnvEntry {
}

function scanRuntimeContextEnvEntry(cacheConfig) {
    let runtimeContextEnvEntry = new RuntimeContextEnvEntry();

    runtimeContextEnvEntry.config = cacheConfig;

    runtimeContextEnvEntry.cacheFileExists = fsUtils.isFileSync(cacheConfig.cacheFilePath);

    runtimeContextEnvEntry.cacheFilePath = cacheConfig.cacheFilePath;

    if (!runtimeContextEnvEntry.cacheFileExists) {
        runtimeContextEnvEntry.cacheBuildIsNeeded = true;

        return runtimeContextEnvEntry;
    }

    let cacheFileContents;

    try {
        cacheFileContents = JSON.parse(fs.readFileSync(cacheConfig.cacheFilePath, 'utf8'));
    } catch (e) {
        let cacheReadError = {};
        cacheReadError.errorMessage = "Error trying to read cacheFile: '" + cacheConfig.cacheFilePath + "'.  Error:  " + e;
        runtimeContextEnvEntry.cacheHasError = true;
        runtimeContextEnvEntry.cacheBuildIsNeeded = true;
        runtimeContextEnvEntry.cacheReadError = cacheReadError;

        return runtimeContextEnvEntry;
    }

    if (cacheFileContents == null ||
        cacheFileContents.cacheMeta == null ||
        cacheFileContents.cacheMeta.lastRunTimestamp == null ||
        !moment(cacheFileContents.cacheMeta.lastRunTimestamp).isValid())
    {
        runtimeContextEnvEntry.cacheBuildIsNeeded = true;
        return runtimeContextEnvEntry;
    }

    runtimeContextEnvEntry.cacheMeta = cacheFileContents.cacheMeta;

    if (runtimeContextEnvEntry.cacheMeta.nextScheduledRunTimestamp == null ||
        !moment(runtimeContextEnvEntry.cacheMeta.nextScheduledRunTimestamp).isValid())
    {
        let lastRunTimestamp = moment(runtimeContextEnvEntry.cacheMeta.lastRunTimestamp);
        runtimeContextEnvEntry.cacheMeta.nextScheduledRunTimestamp = lastRunTimestamp.add(cacheConfig.cacheDurationSeconds, 'seconds');
    }

    if (moment(runtimeContextEnvEntry.cacheMeta.nextScheduledRunTimestamp) < moment()) {
        runtimeContextEnvEntry.cacheBuildIsNeeded = true;
        return runtimeContextEnvEntry;
    }

    runtimeContextEnvEntry.cacheBuildIsNeeded = false;
    return runtimeContextEnvEntry;
}

/*
 --------------------------------------------------------------------------------------------------------------------
 - Application Runtime Metadata
 --------------------------------------------------------------------------------------------------------------------
*/
class JraApplicationRuntimeMetadata {

}

function getApplicationMetadata(cliContext) {
    let runtimeContext = cliContext.contexts.runtimeContext;

    let jraApplicationRuntime = cliContext.envs.runtimeEnv.jraApplicationRuntime;

    if (jraApplicationRuntime != null && !jraApplicationRuntime.cacheBuildIsNeeded) {
        runtimeContext.jraApplicationContext = loadJraApplicationContextFromCache(cliContext, runtimeContext, jraApplicationRuntime);
    } else {
        runtimeContext.jraApplicationContext = buildJraApplicationsContext(cliContext, runtimeContext, jraApplicationRuntime);
    }

    return runtimeContext.jraApplicationContext;
}

function loadJraApplicationContextFromCache(cliContext, runtimeContext, runtimeEnv) {
    let jraApplicationRuntimeMetadata;

    try {
        jraApplicationRuntimeMetadata = JSON.parse(fs.readFileSync(runtimeEnv.config.cacheFilePath, 'utf8'));
    } catch (e) {
        // TODO add more robust error messaging.  In this case, we're going to return null so we can build a new context.
        // But need to log a warning.
        console.log("Warning.  Error trying to parse json file:  '" + runtimeEnv.config.cacheFilePath + "'.  Error:  '" + e + "'");
        return null;
    }

    return jraApplicationRuntimeMetadata;
}

function buildJraApplicationsContext(cliContext, runtimeContext, runtimeEnv) {
    logger.logBanner("Building JRA Application Metadata...");

    let jraApplicationRuntimeMetadata = new JraApplicationRuntimeMetadata();

    let stopwatch = Stopwatch.create();

    let cacheMeta = startBuildContext(stopwatch, runtimeEnv.config);


    stopBuildContext(cacheMeta, stopwatch, runtimeEnv.config);

    return jraApplicationRuntimeMetadata;
}

/*
 --------------------------------------------------------------------------------------------------------------------
 - Environment Runtime Metadata
 --------------------------------------------------------------------------------------------------------------------
*/
class JraEnvironmentRuntimeMetadata {

}

function getEnvironmentMetadata(cliContext) {
    let runtimeContext = cliContext.contexts.runtimeContext;

    let jraEnvironmentRuntime = cliContext.envs.runtimeEnv.jraEnvironmentRuntime;

    if (jraEnvironmentRuntime != null && !jraEnvironmentRuntime.cacheBuildIsNeeded) {
        runtimeContext.jraEnvironmentContext = loadJraEnvironmentContextFromCache(cliContext, runtimeContext, jraEnvironmentRuntime);
    } else {
        runtimeContext.jraEnvironmentContext = buildJraEnvironmentContext(cliContext, runtimeContext, jraEnvironmentRuntime);
    }

    return runtimeContext.jraEnvironmentContext;
}

function loadJraEnvironmentContextFromCache(cliContext, runtimeContext, runtimeEnv) {
    let jraEnvironmentRuntimeMetadata;

    try {
        jraEnvironmentRuntimeMetadata = JSON.parse(fs.readFileSync(runtimeEnv.config.cacheFilePath, 'utf8'));
    } catch (e) {
        // TODO add more robust error messaging.  In this case, we're going to return null so we can build a new context.
        // But need to log a warning.
        console.log("Warning.  Error trying to parse json file:  '" + runtimeEnv.config.cacheFilePath + "'.  Error:  '" + e + "'");
        return null;
    }

    return jraEnvironmentRuntimeMetadata;
}

function buildJraEnvironmentContext(cliContext, runtimeContext, runtimeEnv) {
    logger.logBanner("Building JRA Environment Metadata...");

    let jraEnvironmentRuntimeMetadata = new JraEnvironmentRuntimeMetadata();

    let stopwatch = Stopwatch.create();

    let cacheMeta = startBuildContext(stopwatch, runtimeEnv.config);


    stopBuildContext(cacheMeta, stopwatch, runtimeEnv.config);

    return jraEnvironmentRuntimeMetadata;
}

/*
 --------------------------------------------------------------------------------------------------------------------
 - Utility Functions
 --------------------------------------------------------------------------------------------------------------------
*/

function startBuildContext(stopwatch, runtimeCache) {
    cacheMeta = new CacheMeta();

    stopwatch.start();

    return cacheMeta;
}

function stopBuildContext(cacheMeta, stopwatch, runtimeCache) {
    stopwatch.stop();

    cacheMeta.lastRunTimestamp = moment();
    cacheMeta.lastRunDurationMilis = stopwatch.elapsedMilliseconds;
    cacheMeta.lastRunDurationDisplay = stopwatch.elapsed.seconds + " seconds";
    cacheMeta.nextScheduledRunTimestamp = cacheMeta.lastRunTimestamp.add(runtimeCache.cacheDurationSeconds, 'seconds');

    return cacheMeta;
}

