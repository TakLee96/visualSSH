/**
 * Created by lijiahang on 14-10-2.
 */

var visualSSH = angular.module('visualSSH', []);

visualSSH.controller('infoCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
    $scope.data = [];
    $scope.file = "";
    $scope.canGoBack = false;
    $scope.connected = false;
    $scope.showFile = false;
    $scope.fileName = "";

    var history = [];
    var _dir = "";
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
    var replaceAll = function(str, before, after) {
        if (str.indexOf(before) == -1) {
            return str;
        } else {
            return replaceAll(str.replace(before, after), before, after);
        }
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
            $scope.setConnection(readFile, null, true);
            $scope.executions = 0;
        } else {
            $scope.showFile = true;
            $scope.file = "Loading...";
            progressBar('file');
            $scope.executions++;
            $http.get('/command/' + 'cat' + _dir).success(function (data) {
                $scope.file = data;
            });
        }
    };

    $scope.executions = 0;
    $scope.setConnection = function(callback, option, noRefresh) {
        var my_url = '/connect/' + $('#host').val();
        my_url += '/' + $('#user').val();
        my_url += '/' + $('#pass').val();

        if (!noRefresh) {
            $scope.data = ["Loading..."];
            progressBar('data');
        }

        $http.get(my_url).success(function(data) {
            //console.log(data);
            callback = (callback) ? callback : displayData;
            $scope.connected = true;

            if (option) {
                callback(option)
            } else {
                callback();
            }
        });
    };
    $scope.goBack = function() {
        if (history.length == 1)
            $scope.canGoBack = false;
        _dir = history.pop();
        console.log(history);
        $scope.file = "";
        $scope.showFile = false;
        displayData();
    };
    $scope.open = function(name) {
        if (name.indexOf(".") == -1) {
            history.push(_dir);
            if (_dir) {
                _dir += name + "%2F";
            } else {
                _dir += " " + name + "%2F";
            }
            console.log("%s %s", history, _dir);
            $scope.file = "";
            $scope.showFile = false;
            $scope.canGoBack = true;
            displayData();
        } else {
            if (_dir == "") {
                _dir = " " + name;
            } else if (_dir.indexOf(name) == -1) {
                _dir += name;
            }
            $scope.fileName = name;
            readFile();
        }
    };
    $scope.glookup = function(options) {
        if ($scope.executions >= 2) {
            $scope.setConnection($scope.glookup, options, true);
            $scope.executions = 0;
        } else {
            $scope.showFile = true;
            $scope.executions++;
            progressBar('file');
            $scope.file = ["Loading..."];
            options = (options) ? options : "";
            $http.get('/command/' + 'glookup' + options).success(function (data) {
                $scope.file = data;
            });
        }
    };
    $scope.exit = function() {
        location.reload();
    };

    $('#host').autocomplete({
        source: ["cory.eecs.berkeley.edu"]
    });
    $('#user').autocomplete({
        source: [
            "cs61a-",
            "cs61b-",
            "cs61c-",
            "cs70-"
        ]
    });
    $interval(function() {
        $('.button').button();
    }, 25)
}]);

