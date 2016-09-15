/**
 * Created by @mriso_dev on 14/09/16.
 */

var app = angular.module('jsonReader', ['angular.filter']);

app.filter("ucwords", function () {
    return function (input){
        if(input) { //when input is defined the apply filter
            return (input + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                return $1.toUpperCase();
            });
        }
        return input;
    }
})



app.controller('readBrands', function ($scope, $http){

    $scope.brands = [];
    $scope.users = [];
    $scope.interactions = [];
    $scope.table = {};
    $scope.filterId = null;
    $scope.filter = 'All Brands';

    $scope.updateFilter = function(brand_id, name){
        $scope.filterId = brand_id;
        $scope.filter = name;
        $scope.calculate();
    };

    $scope.reset = function(){
        $scope.filterId = null;
        $scope.filter = 'All Brands';
        $scope.calculate();
    }

    $scope.readBrandsInfo = function(){
        $http.get('data/frontend_data/brands.json').success(function(data) {
           $scope.brands = data;
        });
    };

    $scope.calculate = function(){
        var userpromise = $http.get('data/frontend_data/users.json').success(function(data) {
            $scope.users = data;
        });
        var intepromise = $http.get('data/frontend_data/interactions.json').success(function(data) {
            $scope.interactions = data;
        });

        intepromise.then(
            function(payload1) {
                userpromise.then(
                    function (payload2) {

                     var result =  $scope.interactions.reduce(function (res, obj) {
                            var rObj = {};
                            if($scope.filterId != null){
                                if(obj.brand == $scope.filterId){
                                    rObj = obj;
                                }
                            }else{
                                rObj = obj;
                            }

                            if (!(rObj.user in res)) {
                                res.__array.push(res[rObj.user] = rObj);
                                res[rObj.user].count = 1;
                            } else {
                                res[rObj.user].count += 1;
                            }
                            return res;
                        }, {__array: []}).__array
                            .sort(function (a, b) {
                                return b.count - a.count;
                            });

                        var optimized = [];
                        for(var i=0; i < result.length; i++){
                            for(var z=0; z < $scope.users.length; z++){
                                if(result[i].user == $scope.users[z].id){
                                    optimized.push({
                                        userid: result[i].user,
                                        username: $scope.users[z].name,
                                        useremail: $scope.users[z].email,
                                        userpic: $scope.users[z].picture.thumbnail,
                                        userloc: $scope.users[z].location,
                                        interactions: result[i].count
                                    });
                                }
                            }
                        }
                        $scope.table = optimized;
                    }

                )
            }
        );

    };

});