#!/usr/bin/env node

var program = require('commander');

program
   .description('JRA DevOps Command Line Interface (CLI).  Used to manage and automate JRA Infrastructure.')
  .option('-e, --env <environment>', 'The JRA environment to execute against')
  .option('-f, --force', 'force installation')
  .parse(process.argv);

console.log("<<-- executed jra swarm node");
