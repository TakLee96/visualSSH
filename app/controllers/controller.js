/**
 * Created by lijiahang on 14-10-3.
 */

var model = require('../models/model');

var connect = function(req, res) {
    var infoObj = {
        host: req.params.host,
        user: req.params.user,
        pass: req.params.pass
    };
    console.log("[Server] Connection Request Received");
    model.connectSSH(infoObj);
    res.status(200).end("[Server] Connection Success");
 };

var execute = function(req, res) {
    var command = req.params.command.replace("%20", " ").replace("%2F", "/");
    console.log("[Server] Executing %s", command);
    model.executeCommand(command, function(data){
        res.status(200).end(data);
    });
};

module.exports = {
    connect: connect,
    execute: execute
};