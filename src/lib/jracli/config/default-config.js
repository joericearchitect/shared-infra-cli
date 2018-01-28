const os = require('os');

module.exports = {
    defaultConfig: {
        "userJraHomeDir": os.homedir + "/.jra",
        "userJraDevHomeDir": os.homedir + "/.jra/infra",
        "userJraCliHomeDir": os.homedir + "/.jra/infra/cli",
        "userJraCliCacheHomeDir": os.homedir + "/.jra/infra/cli/.cache",
        "devConfigFileName": "config.yml",
        "devConfigFilePath": os.homedir + "/.jra/infra/cli/config.yml",
        "defaultJraGitHome": os.homedir + "/.jra/infra/git",
        "jraApplicationCache" : {
            "displayName": "JRA Application Cache",
            "cacheFilePath": os.homedir + "/.jra/infra/cli/.cache/jra-application-cache.json",
            "cacheDurationSeconds": 28800
        },
        "jraApplicationGroupCache" : {
            "displayName": "JRA Application Group Cache",
            "cacheFilePath": os.homedir + "/.jra/infra/cli/.cache/jra-application-group-cache.json",
            "cacheDurationSeconds": 28800
        },
        "jraApplicationServiceCache" : {
            "displayName": "JRA Application Service Cache",
                "cacheFilePath": os.homedir + "/.jra/infra/cli/.cache/jra-application-service-cache.json",
            "cacheDurationSeconds": 28800
        },
        "jraContainerCache" : {
            "displayName": "JRA Container Cache",
            "cacheFilePath": os.homedir + "/.jra/infra/cli/.cache/jra-container-cache.json",
            "cacheDurationSeconds": 28800
        },
        "jraContainerClusterCache" : {
            "displayName": "JRA Container Cluster Cache",
            "cacheFilePath": os.homedir + "/.jra/infra/cli/.cache/jra-container-cluster-cache.json",
            "cacheDurationSeconds": 28800
        },
        "jraContainerClusterNodeCache" : {
            "displayName": "JRA Container Cluster Node Cache",
            "cacheFilePath": os.homedir + "/.jra/infra/cli/.cache/jra-container-cluster-node-cache.json",
            "cacheDurationSeconds": 28800
        },
        "jraEnvironmentCache" : {
            "displayName": "JRA Environment Cache",
            "cacheFilePath": os.homedir + "/.jra/infra/cli/.cache/jra-environment-cache.json",
            "cacheDurationSeconds": 28800
        }
    }
}
