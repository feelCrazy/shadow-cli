#!/usr/bin/env node

'use strict'

// const inquirer = require("inquirer");
const chalk = require('chalk')
const figlet = require('figlet')
const shell = require('shelljs')
const program = require('commander')
const fs = require('fs')
const symbols = require('log-symbols')

const Creator = require('./lib/Creator')

var currentNodeVersion = process.versions.node
var semver = currentNodeVersion.split('.')
var major = semver[0]

const init = () => {
    console.log(
        chalk.green(
            figlet.textSync('Shadow CLI', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    )

    if (major < 8) {
        console.error(
            chalk.red(
                'You are running Node ' +
                    currentNodeVersion +
                    '.\n' +
                    'Create React App requires Node 4 or higher. \n' +
                    'Please update your version of Node.'
            )
        )
        process.exit(1)
    }
}

init()
program
    .version(require('./package.json').version, '-v, --version')
    .usage('<command> [options]')

program
    .command('init <app-name>')
    .description('create a new project powered by wang xiaoming')
    .option('-p, --peper', 'test1')
    .action((packageName, options) => {
        if (!fs.existsSync(packageName)) {
            const create = new Creator(packageName)
            create.create()
        } else {
            console.log(
                symbols.error,
                chalk.red('项目：' + packageName + ' 已存在')
            )
        }
    })

program.parse(process.argv)
