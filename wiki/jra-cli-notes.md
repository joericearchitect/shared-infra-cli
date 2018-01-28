Random Notes


*Stuff to do in initialization*

* Create Configuration Object
  - Get hardcoded default config values
  - Check for config files
  - Check for environment variables
  - Check for runtime parameters passed in
  
* Do we need to run first-time initialization
  - git hub project present
  
* Validate environment
  - aws pem, access keys / screts present
  - required configuration properties present

  
*Model Objects*

Context
  - EnvMetadata
  - Configuration
  - RuntimeMetadata

  
Operations

* Scan Environment - EnvMetadata

* Build Configuration - Configuration

* Build RuntimeMetadata - RuntimeMetadata

* Validate Environment - Actions

* Initialize Environment - 

* Perform Operation
  - GetRuntimeInfo

Context JSON Outline

{
    "environment-metadata": {
    },
    "configuration": {
    },
    "runtime-metadata": {
    },
    "runtime-info": {
    }
}


    cliContextEnvMetadata: class {
    },

    cliContextConfiguration: class {
    },

    cliContextRuntimeMetadata: class {
    },

    CliContextRuntimeIno: class {
    }