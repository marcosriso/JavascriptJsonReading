/**
 * Created by @mriso_dev on 14/09/16.
 */

var app = angular.module('jsonReader', ['angular.filter']);

app.controller('readBrands', function ($scope, $http){

    $scope.brands = [];
    $scope.users = [];
    $scope.interactions = [];
    var calculated = [];

    $scope.readBrandsInfo = function(){
        $http.get('data/brands.json').success(function(data) {
           $scope.brands = data;
        });
    }

    $scope.calculate = function(){
        var userpromise = $http.get('data/users.json').success(function(data) {
            $scope.users = data;
        });
        var intepromise = $http.get('data/interactions.json').success(function(data) {
            $scope.interactions = data;
        });

        intepromise.then(
            function(payload1) {
                userpromise.then(
                    function (payload2) {
                        var users = {};
                        for(var i=0; i < $scope.interactions.length; i++){
                            var int = $scope.interactions[i];
                            if(!users[int.id]){
                                users[int.id] = [];
                            }

                            users[int.id].push(int.type);


                        }

                        console.log(users);
                    }
                )
            }
        );

    }

});