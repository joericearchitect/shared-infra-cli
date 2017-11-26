#!/usr/bin/env node

var program = require('commander');

program
 .version('0.0.1')
 .arguments('<file>')
 .description('JRA DevOps Command Line Interface (CLI).  Used to manage and automate JRA Infrastructure.')
 .option('-e, --env <environment>', 'The JRA environment to execute against')
 .command('swarm-info [name]', 'Information on the swarm').alias('si')
.parse(process.argv);

console.log("<<-- main");