/**
 * Created by lijiahang on 14-10-2.
 */

var visualSSH = angular.module('visualSSH', []);

visualSSH.controller('infoCtrl', ['$scope', '$http', function($scope, $http){
    $scope.host = "";
    $scope.user = "";
    $scope.pass = "";
    $scope.data = "";
    $scope.file = "";

    var _dir = "";
    $scope.executions = 0;

    $scope.setConnection = function(callback) {
//        var my_url = '/connect/' + $scope.host;
//        my_url += '/' + $scope.user;
//        my_url += '/' + $scope.pass;

        var my_url = '/connect/' + "cory.eecs.berkeley.edu";
        my_url += '/' + "cs61a-ayc";
        my_url += '/' + "Tak960624";

        $http.get(my_url).success(function(data){
            console.log(data);
            callback = (callback) ? callback : displayData;
            callback();
        });
    };

    var displayData = function(){
        if ($scope.executions > 3) {
            $scope.setConnection();
            $scope.executions = 0;
        } else {
            $scope.executions++;
            $http.get('/command/' + 'ls' + _dir).success(function (data) {
                $scope.data = data.split("\n");
            });
        }
    };

    var readFile = function(){
        if ($scope.executions >= 3) {
            $scope.setConnection(readFile);
            $scope.executions = 0;
        } else {
            $scope.executions++;
            $http.get('/command/' + 'cat' + _dir.substr(0, _dir.length - 3)).success(function (data) {
                $scope.file = data;
            });
        }
    };

    $scope.open = function(name) {
        if (_dir) {
            _dir += name + "%2F";
        } else {
            _dir += " " + name + "%2F";
        }
        if (name.indexOf(".") == -1) {
            displayData();
        } else {
            readFile();
        }
    }
}]);