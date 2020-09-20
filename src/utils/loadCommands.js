const path = require('path')
const fs = require('fs')

module.exports = function loadCommands(Clientcommands, client, dir) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const categories = fs.readdirSync(path.join(__dirname, '../', dir)).filter(el=> fs.lstatSync(path.join(__dirname, '../', dir, el)).isDirectory())
    categories.forEach(category => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const commands = fs.readdirSync(path.join(__dirname, '../', dir, category)).filter(el=> !fs.lstatSync(path.join(__dirname, '../', dir, category, el)).isDirectory() && el.split('.').pop() === 'js')
        commands.forEach(command => {
            // eslint-disable-next-line security/detect-non-literal-require
            let cmd = require(path.join(__dirname, '../', dir, category, command))
            cmd.category = category
            Clientcommands.set(command.split('.').shift(), new cmd(client))
        })
    })

    console.log(`[LOAD] Loaded ${Clientcommands.size} commands`)
}