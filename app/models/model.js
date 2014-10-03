/**
 * Created by lijiahang on 14-10-3.
 */

var SSH = require('simple-ssh');
var SSHConnected = false;
var ssh = null;

var connectSSH = function(infoObj) {
    console.log("[Server] Connecting");
    SSHConnected = true;
    ssh = new SSH({
        host: infoObj.host,
        user: infoObj.user,
        pass: infoObj.pass
    });
};

var executeCommand = function(command, callback, reset) {
    console.log("[Model] Executing Command %s", command);

    ssh.exec(command, {
        out: function (stdout) {
            console.log("[Model] stdout:\n%s", stdout);
            console.log("[Model] execs: %s", ssh.count());
            callback(stdout);
        },
        err: function (err) {
            console.error(err);
        }
    }).start();
};

module.exports = {
    connectSSH: connectSSH,
    executeCommand: executeCommand
};


