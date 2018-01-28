#!/usr/bin/env node

var program = require('commander');

program
 .version('0.0.1')
 .description('JRA DevOps Command Line Interface (CLI).  Used to manage and automate JRA Infrastructure.')
 .option('-e, --env <environment>', 'The JRA environment to execute against')
 .command('env', 'Manage and operate on a service')
 .command('swarm', 'Manage and operate on a Docker Swarm')
 .command('stack', 'Manage and operate on a service')
 .command('service', 'Manage and operate on a service')
.parse(process.argv);

console.log("<<-- executed jracli");

console.log("jracli env:  %s", program.env);