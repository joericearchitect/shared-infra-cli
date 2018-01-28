#!/usr/bin/env node

var program = require('commander');

program
  .description('JRA DevOps Command Line Interface (CLI).  Used to manage and automate JRA Infrastructure.')
  .command('info', 'Information about the swarm')
  .command('node', 'operations on swarm nodes')
  .command('service', 'Information on the swarm')
  .command('load-balancer', 'Information on the swarm')
  .command('endpoint', 'Information on the swarm')
  .parse(process.argv);

console.log("<<-- executed jracli swarm");