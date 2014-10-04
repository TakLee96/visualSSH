/**
 * Created by lijiahang on 14-10-3.
 */

var SSH = require('simple-ssh');
var ssh = null;

var connectSSH = function(infoObj) {
    console.log("[Server] Connecting");
    ssh = new SSH({
        host: infoObj.host,
        user: infoObj.user,
        pass: infoObj.pass
    });
};

var executeCommand = function(command, callback) {
    console.log("[Model] Executing Command %s", command);

    ssh.exec(command, {
        out: function (stdout) {
            console.log("[Model] stdout");
            console.log("[Model] execs: %s", ssh.count());
            callback(stdout);
        },
        err: function (err) {
            console.error(err);
            callback(err);
        },
        exit: function (code, stdout, strerr) {
            if (strerr) {
                console.error(strerr);
                callback(null);
            } else {
                console.log("[Model] Exit");
                callback(stdout);
            }
        }
    }).start({
        success: function() {
            console.log("[Model] Connection Success");
        },
        fail: function (err) {
            console.error(err);
            callback(null);
        }
    });
};

module.exports = {
    connectSSH: connectSSH,
    executeCommand: executeCommand
};


