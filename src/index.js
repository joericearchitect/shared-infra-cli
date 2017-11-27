#!/usr/bin/env node

var program = require('commander');

program
 .version('0.0.1')
 .description('JRA DevOps Command Line Interface (CLI).  Used to manage and automate JRA Infrastructure.')
 .option('-e, --env <environment>', 'The JRA environment to execute against')
 .command('environment', 'Manage and operate on a service').alias('env')
 .command('swarm', 'Manage and operate on a Docker Swarm').alias('sw')
 .command('stack', 'Manage and operate on a service').alias('st')
 .command('service', 'Manage and operate on a service').alias('sv')
.parse(process.argv);

console.log("<<-- executed jra");

console.log("jra env:  %s", program.env);