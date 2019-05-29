#!/usr/bin/env node

const inquirer = require('inquirer');
const commander = require('commander');
const chalk = require('chalk');
const _ = require('lodash');
const ora = require('ora');

const fs = require("fs");
const path = require("path");
const program = new commander.Command();

program
    .version("0.0.1")
    // .command('module')
    // .alias('m')
    .description('Create an empty plugin project.')
    .action(option => {

        // if (!program.args[0]) {
        //     console.log(chalk.green('请输入项目名'));
        //     console.log(chalk.blue('create-wow-addons <template>'));
        //     return
        // }

        let config = _.assign({
            moduleTitle: null,
            moduleAuthor: '',
            moduleVersion: '0.0.1',
            moduleNotes: '',
            moduleInterface: '',
            moduleHasVariables: false,
            moduleSavedVariables: '',
            moduleSavedVariablesPerCharacter: ''
        }, option);
        let prompts = [];

        console.log('');
        console.log(chalk.red('Prepare to create a project...'));
        console.log('');

        if (config.moduleTitle !== 'string') {
            prompts.push({
                type: 'input',
                name: 'moduleTitle',
                message: 'Title:',
                validate: function (input) {
                    if (!input) {
                        return 'Can not be empty.'
                    }
                    return true
                }
            })
        }

        if (config.moduleAuthor !== 'string') {
            prompts.push({
                type: 'input',
                name: 'moduleAuthor',
                message: 'Author:'
            })
        }

        if (config.moduleVersion !== 'string') {
            prompts.push({
                type: 'input',
                name: 'moduleVersion',
                message: 'Version:',
                default: '0.0.1'
            })
        }

        if (config.moduleNotes !== 'string') {
            prompts.push({
                type: 'input',
                name: 'moduleNotes',
                message: 'Notes:'
            })
        }

        if (config.moduleInterface !== 'number') {
            prompts.push({
                type: 'number',
                name: 'moduleInterface',
                message: 'Interface:',
                default: 80100,
                validate: function (input) {
                    if (isNaN(input)) {
                        // return typeof input
                        return 'please input Interface.'
                    }
                    return true
                }
            })
        }

        if (config.moduleHasVariables === false) {
            prompts.push({
                type: 'confirm',
                name: 'moduleHasVariables',
                message: 'Do you need variables?',
                default: true,
            })
        }

        if (config.moduleSavedVariables !== 'string') {
            prompts.push({
                type: 'input',
                name: 'moduleSavedVariables',
                message: 'SavedVariables:',
                when: function (answers) {
                    return answers.moduleHasVariables
                }
            })
        }

        if (config.moduleSavedVariablesPerCharacter !== 'string') {
            prompts.push({
                type: 'input',
                name: 'moduleSavedVariablesPerCharacter',
                message: 'SavedVariablesPerCharacter:',
                when: function (answers) {
                    return answers.moduleHasVariables
                }
            })
        }

        inquirer.prompt(prompts).then(function (answers) {
            console.log('');
            createFile(answers)
        })
    });

program.parse(process.argv);

function createFile(answers) {
    const spinner = ora(chalk.green('Download in progress...')).start();
    let filePath = answers.moduleTitle;

    spinner.color = 'yellow';
    spinner.text = `Loading ${chalk.red('Generating file...')}`;

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }

    spinner.succeed();

    fs.writeFileSync(filePath + path.sep + answers.moduleTitle + '.toc', '## Interface: ' + answers.moduleInterface + '\n## Author: ' + answers.moduleAuthor + '\n## Title: ' + answers.moduleTitle + '\n## Notes: ' + answers.moduleNotes + '\n## Version: ' + answers.moduleVersion);

    if (answers.moduleHasVariables) {
        fs.appendFileSync(filePath + path.sep + answers.moduleTitle + '.toc', '\n## SavedVariables: ' + answers.moduleSavedVariables + '\n## SavedVariablesPerCharacter: ' + answers.moduleSavedVariablesPerCharacter);
    }

    fs.appendFileSync(filePath + path.sep + answers.moduleTitle + '.toc', '\n\n' + answers.moduleTitle + '.lua');

    fs.writeFileSync(filePath + path.sep + answers.moduleTitle + '.lua', '');
    spinner.color = 'red';
    spinner.text = `Loading ${chalk.red('Created')}`;

    spinner.succeed();
}