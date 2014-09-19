require('colors');

var Log = function(name) {

    function format(level, msg) {
        return "[".grey + level + "][".grey + ("" + process.pid).grey + "][".grey + name + "] ".grey + msg.white;
    }

    return {
        name: name,
        debug: function(msg) {
            console.log(format('debug'.yellow, msg));
        },
        info: function(msg) {
            console.log(format('info '.blue, msg));
        },
        error: function(msg, err) {

            if(typeof msg === 'string') {
                console.log(format('error'.red.bold, msg));
            } else if(msg.message && !err) {
                console.log(format('error'.red.bold, msg.message));
                err = msg;
            }

            if(err) {
                var stack = err.stack.replace(/^[^\(]+?[\n$]/gm, '')
                    .replace(/^\s+at\s+/gm, '')
                    .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
                    .split('\n');
                console.error(stack);
            }
        }
    };
};

module.exports = Log;