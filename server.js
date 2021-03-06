/**
 * Created by lijiahang on 14-10-2.
 */

var express = require("express");
var bodyParser = require("body-parser");

var app = express();

require('./route')(app);
app.use(function(req, res, next){console.log("%s %s", req.method, req.url); next();});
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Server Listening to Port
var server = app.listen((process.env.PORT || 5000), function(){
    console.log("server is running at %s", server.address().port);
});

module.exports = app;