'use strict'
const inquirer = require('inquirer')
const download = require('download-git-repo')
const ora = require('ora')
const symbols = require('log-symbols')
const chalk = require('chalk')
const Metalsmith = require('metalsmith')
const path = require('path')
const fs = require('fs-extra')
const Generator = require('./Generator')

let originData
module.exports = class Creator {
    constructor(name) {
        this.name = name
        this.askQuestions = this.askQuestions.bind(this)
        this.downloadGenerate = this.downloadGenerate.bind(this)
    }
    async askQuestions() {
        const questions = [
            {
                type: 'input',
                name: 'version',
                message: '项目版本号',
                default: () => {
                    return '1.0.0'
                },
                validate: val => {
                    const pass = val.match(/^[0-9]+\.[0-9]+[0-9+a-zA-Z\.\-]+$/)
                    if (pass) {
                        return true
                    }
                    return '输入正确的版本号例如: 1.0.0'
                }
            },
            {
                name: 'description',
                type: 'input',
                message: '项目描述',
                default: () => {
                    return 'react project'
                }
            },
            {
                name: 'author',
                type: 'input',
                message: '作者',
                default: () => {
                    return 'xiaoming'
                }
            },
            {
                type: 'list',
                name: 'type',
                message: '项目类型',
                choices: ['react', 'vue', 'node'],
                filter: val => val
            }
        ]
        const answers = await inquirer.prompt(questions)
        const hasSlash = this.name.indexOf('/') > -1

        if (hasSlash) {
            this.downloadGenerate(name, answers)
        } else {
            const officialTemplate = 'feelCrazy/react-demo'
            this.downloadGenerate(officialTemplate, this.name, answers)
        }
    }

    downloadGenerate(template, name, answers) {
        const spinner = ora('正在下载模板...')
        spinner.start()
        download(template, name, err => {
            spinner.stop()
            if (err) {
                console.log(
                    symbols.error,
                    chalk.red(
                        '项目' + name + '初始化失败:' + err.message.trim()
                    )
                )
            } else {
                fs.readJson(`${name}/package.json`, (err, data) => {
                    if (err) {
                        return console.log(chalk.red(err))
                    }
                    const generator = new Generator(data, answers, name)
                    generator.init()
                })

                console.log()
                console.log(symbols.success, chalk.green('项目初始化成功！！'))

                // spinner.succeed("项目初始化完成")
            }
        })
    }

    create() {
        this.askQuestions()
    }
}
