#!/usr/bin/env node

'use strict';

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];


const init = () => {
    console.log(
        chalk.green(
            figlet.textSync("Shadow CLI", {
                font: "Ghost",
                horizontalLayout: "default",
                verticalLayout: "default",
            })
        )
    );
};

const askQuestions = () => {
    const questions = [{
            name: "FILENAME",
            type: "input",
            message: "What is the name of the file without extension?"
        },
        {
            type: "list",
            name: "EXTENSION",
            message: "What is the file extension?",
            choices: [".rb", ".js", ".php", ".css"],
            filter: function (val) {
                return val.split(".")[1];
            }
        }
    ];
    return inquirer.prompt(questions);
};

const createFile = (filename, extension) => {
    const filePath = `${process.cwd()}/${filename}.${extension}`
    shell.touch(filePath);
    return filePath;
};

const success = filepath => {
    console.log(
        chalk.white.bgGreen.bold(`Done! File created at ${filepath}`)
    );
};

const run = async () => {
    // show script introduction
    init();

    // ask questions
    const answers = await askQuestions();
    const {
        FILENAME,
        EXTENSION
    } = answers;

    // create the file
    const filePath = createFile(FILENAME, EXTENSION);

    // show success message
    success(filePath);
};

if (major < 4) {
    console.error(
        chalk.red(
            'You are running Node ' +
            currentNodeVersion +
            '.\n' +
            'Create React App requires Node 4 or higher. \n' +
            'Please update your version of Node.'
        )
    );
    process.exit(1);
}
run();