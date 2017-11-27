#!/usr/bin/env node

var program = require('commander');

program
  .description('JRA DevOps Command Line Interface (CLI).  Used to manage and automate JRA Infrastructure.')
  .command('info', 'Information on the swarm').alias('i')
  .command('node', 'Information on the swarm').alias('n')
  .command('service', 'Information on the swarm').alias('sv')
  .command('load-balancer', 'Information on the swarm').alias('lb')
  .command('endpoint', 'Information on the swarm').alias('ep')
  .parse(process.argv);

console.log("<<-- executed jra swarm");