#!/usr/bin/env node

const cliContextBuilder = require('./lib/jracli/context/cli-context-builder');
const runtimeContextBuilder = require('./lib/jracli/context/runtime-metadata-builder');

var program = require('commander');

program
   .description('JRA DevOps Command Line Interface (CLI).  Used to manage and automate JRA Infrastructure.')
  .option('-e, --env <environment>', 'The JRA environment to execute against')
  .option('-f, --force', 'force installation')
  .parse(process.argv);

const cliContext = cliContextBuilder.initalizeCliContext();
const jraApplicationRuntimeInfo =runtimeContextBuilder.getApplicationRuntimeInfo(cliContext);
const jraEnvironmentRuntimeInfo =runtimeContextBuilder.getEnvironmentRuntimeInfo(cliContext);

console.log("\n\ninitalizeCliContext:  " + JSON.stringify(cliContext, null, 4));