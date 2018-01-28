#!/usr/bin/env node

const cliContextBuilder = require('./lib/jracli/core/cli-metadata-builder');
const runtimeContextBuilder = require('./lib/jracli/core/runtime-context-builder');

var program = require('commander');

program
   .description('JRA DevOps Command Line Interface (CLI).  Used to manage and automate JRA Infrastructure.')
  .option('-e, --env <environment>', 'The JRA environment to execute against')
  .option('-f, --force', 'force installation')
  .parse(process.argv);

const cliContext = cliContextBuilder.initalizeCliMetadata();
const jraApplicationRuntimeMetadata =runtimeContextBuilder.getApplicationMetadata(cliContext);
const jraEnvironmentRuntimeMetadata =runtimeContextBuilder.getEnvironmentMetadata(cliContext);

console.log("\n\ninitalizeCliContext:  " + JSON.stringify(cliContext, null, 4));
console.log("\n\njraApplicationRuntimeMetadata:  " + JSON.stringify(jraApplicationRuntimeMetadata, null, 4));
console.log("\n\njraEnvironmentRuntimeMetadata:  " + JSON.stringify(jraEnvironmentRuntimeMetadata, null, 4));
