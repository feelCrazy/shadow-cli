const fs = require('fs-extra')
const chalk = require('chalk')

module.exports = class Generator {
    constructor(data, answers, fileName) {
        this.data = data
        this.answers = answers
        this.fileName = fileName
    }
    init() {
        const newData = Object.assign(this.data, this.answers)
        fs.writeFile(
            `${this.fileName}/package.json`,
            JSON.stringify(newData, null, 2),
            err => {
                if (err) {
                    return chalk.red(err)
                }
            }
        )
    }
}
