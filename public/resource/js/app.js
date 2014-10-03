/**
 * Created by lijiahang on 14-10-2.
 */

var visualSSH = angular.module('visualSSH', []);

visualSSH.controller('infoCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
    $scope.host = "";
    $scope.user = "";
    $scope.pass = "";
    $scope.data = [];
    $scope.file = "";
    $scope.canGoBack = false;
    $scope.connected = false;

    var history = [];
    var _dir = "";
    $scope.executions = 0;

    $scope.setConnection = function(callback) {
//        var my_url = '/connect/' + $scope.host;
//        my_url += '/' + $scope.user;
//        my_url += '/' + $scope.pass;

        var my_url = '/connect/' + "cory.eecs.berkeley.edu";
        my_url += '/' + "cs61a-ayc";
        my_url += '/' + "Tak960624";

        $scope.data = ["Loading..."];
        progressBar('data');

        $http.get(my_url).success(function(data) {
            console.log(data);
            callback = (callback) ? callback : displayData;
            $scope.connected = true;

            callback();
        });
    };

    var progressBar = function(str) {
        var value = 0;
        var fadeIn = false;
        $interval(function() {
            value += 10;
            if (!fadeIn) {
                $('#' + str + 'Progressbar').fadeIn(0);
                fadeIn = true;
            }
            if (value == 100) {
                $('#' + str + 'Progressbar').fadeOut(500);
                fadeIn = false;
            }
            $('#' + str + 'Progressbar').progressbar({
                value: value
            });
        }, 100, 10);
    };

    var displayData = function() {
        if ($scope.executions >= 2) {
            $scope.setConnection();
            $scope.executions = 0;
        } else {
            progressBar('data');
            $scope.data = ["Loading"];
            $scope.executions++;
            $http.get('/command/' + 'ls' + _dir).success(function (data) {
                data = data.split("\n");
                data.pop();
                $scope.data = data;
            });
        }
    };

    var readFile = function() {
        if ($scope.executions >= 2) {
            $scope.setConnection(readFile);
            $scope.executions = 0;
        } else {
            $scope.file = ["Loading..."];
            progressBar('file');
            $scope.executions++;
            $http.get('/command/' + 'cat' + _dir.substr(0, _dir.length - 3)).success(function (data) {
                console.log(data);
                $scope.file = data.split("\n");
            });
        }
    };

    $scope.goBack = function() {
        if (history.length == 1)
            $scope.canGoBack = false;
        _dir = history.pop();
        console.log(history);
        $scope.file = "";
        displayData();
    };

    $scope.open = function(name) {
        if (_dir) {
            _dir += name + "%2F";
        } else {
            _dir += " " + name + "%2F";
        }
        if (name.indexOf(".") == -1) {
            history.push(_dir);
            console.log(history);
            $scope.canGoBack = true;
            displayData();
        } else {
            readFile();
        }
    };

    $scope.glookup = function(options) {
        progressBar('file');
        $scope.file = ["Loading..."];
        $http.get('/command/' + 'glookup' + options).success(function (data) {
            $scope.file = data.split("\n");
        });
    };

    $interval(function() {
        $('.button').button();
    }, 10);
}]);

