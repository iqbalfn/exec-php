/**
 * Execute PHP function within NodeJS application
 * @package exec-php
 * @version 0.0.6
 */

let fs   = require('fs'),
    path = require('path'),
    cli  = require('./lib/cli.js'),
    exec = require('child_process').exec

/**
 * Create exec-php object that contain user php functions.
 * @param {string} file, Path to user php file.
 * @param {string} bin, Path to php bin file.
 * @param {function} callback, Callback function.
 *  @arg {mixed} error message.
 *  @arg {object} methods Collection of user php functions.
 *  @arg {string} printed string on requiring user php file.
 */
module.exports = (file, bin, callback) => {
    if (!callback) {
        if (typeof bin === 'function') {
            callback = bin
            bin = null
        } else {
            callback = function() {}
        }
    }

    if (!bin) {
        bin = 'php'
    }

    let absFile = file
    let tmpPath = process.cwd()
    let tmpParents = Object.values(require.cache)
        .filter(m => {
            if (!m.children || !m.children.length)
                return

            return m.children.includes(module)
        })

    if (tmpParents && tmpParents.length)
        tmpPath = tmpParents[0].path

    absFile = path.resolve(tmpPath, file)

    let cacheName = `{#CACHE#}${absFile}`

    if (require.cache[cacheName])
        return callback.apply(this, require.cache[cacheName])

    if(!fs.existsSync(absFile))
        throw new Error(`File '${file}' not found.`)

    let token = '{#SEPARATOR#}';
    let sc = `include '${absFile}'; echo '${token}'; echo json_encode(get_defined_functions()['user']);`
    let cmd = [bin, `-r "${sc}";`].join(' ')
    let output = null

    exec(cmd, {cwd: path.dirname(absFile)}, (err, sout, serr) => {
        if (err)
            return callback(err)

        let souts = sout.split(token)

        output = souts[0]

        let funcs = JSON.parse(souts[1])
        let php = {}
        funcs.forEach(func => {
            if (func.includes('\\'))
                return

            php[func] = ((file, bin, func) => {
                return function() {
                    let args = Array.prototype.slice.call(arguments, 0)
                    cli.execute(file, bin, func, args)
                }
            })(absFile, bin, func)
        })

        require.cache[cacheName] = [false, php, output]
        callback(false, php, output)
    })
}
