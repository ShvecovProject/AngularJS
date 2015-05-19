/**
 * Created by Shvecov on 23.03.2015.
 */
var notificationArhive = function(){
    return {
        archive:function(notificationToArchive){
            console.log("NotificationToArhive "+ notificationToArchive);
        }
    }
};

angular.module('helloApp', ['ui.keypress','ngResource'])

.service('notificationArhive',notificationArhive )

.config(function(notificationsServiceProvider){
    notificationsServiceProvider.setMaxLength(15);
})
.config(function(resourceServiceProvider){
        resourceServiceProvider.setPathToService( "https://api.mongolab.com/api/1/databases/angular_js/collections/users/:id");
})

.controller('WorldController', function($scope){
    $scope.population = 7000;
    $scope.countries = [
        {name:'France',population:63.1},
        {name:'United Kingdom', population:61.8}
    ];
    $scope.worldsPercentage = function(countryPopulation){
        return (countryPopulation/$scope.population)*100;
    }
})

.controller("MessageController",function($scope, notificationsService){
    $scope.getCurrentNotif = function(){
        return $scope.notification;
    };
    $scope.addToNotif = function(notification){
        var flag = notificationsService.push(notification);
         if(flag) {
             $scope.notification = "";
             console.log("Complete.....");
         }
    }
})

.controller('HelloController',function($scope){
    $scope.getName = function(){
        return $scope.name;
    };
})

.controller("HttpFunctionsController",function($scope, $http, resourceService){
        $scope.name = "World";
    var getAllUsers = function() {
        $scope.users = resourceService.query({},function(){},function(){
            console.log("Error");
        });
        /*var response = $http.get(httpUrl, {
            params: {
                apiKey: "H7NnGFZwutQwxFP6T8Kc_XhkQe4Z4ygX"
            }
        });
        response.then(function(response){
            $scope.users = response.data;
        },function(response){

        });*/
        /*response.success(function (data, status, headers, config) {
            console.log("Users has been getting " + data);
            $scope.users = data;
        });
        response.error(function () {

        });*/
    };

    var httpUrl = "https://api.mongolab.com/api/1/databases/angular_js/collections/users";
    getAllUsers();


    $scope.addUser = function() {
        var newUser = {
            userName: $scope.userName || 'DefaultUser',
            userEmail: $scope.userEmail || 'default@yandex.ru'
        };
        console.log(JSON.stringify(newUser));
        /* var response = $http.post(httpUrl, newUser, {
         params:{
         apiKey:"H7NnGFZwutQwxFP6T8Kc_XhkQe4Z4ygX"
         }
         });
         response.success(function(data, status, headers, config){
         console.log("User has been added "+ data);
         });
         response.error(function(){

         });*/
        resourceService.save({}, newUser, function(data){
            $scope.users.push(data);
        }, function () {
            console.log("Error");
        });
        $scope.userEmail = "";
        $scope.userName = "";
    };

    $scope.deleteUser=function(user) {
       /* var response = $http.delete(httpUrl,idUser,{
            params: {
                apiKey: "H7NnGFZwutQwxFP6T8Kc_XhkQe4Z4ygX"
            }
        });
        response.success(function (data, status, headers, config) {
            console.log("Users has been delete " + data);
        });
        response.error(function () {

        });*/
      /*  $http.delete(httpUrl+"/"+idUser,{
            params:{
                apiKey:"H7NnGFZwutQwxFP6T8Kc_XhkQe4Z4ygX"
            }
        });*/

        /*$scope.delete = function ( idx ) {
         var person_to_delete = $scope.persons[idx];

         API.DeletePerson({ id: person_to_delete.id }, function (success) {
         $scope.persons.splice(idx, 1);
         });
         };*/
        resourceService.delete({},user, function(){
                $scope.users.splice(user,1);
            },
         function(){
            console.log("Error");
        });

    };

    $scope.SendJsonp = function(){
        $http.jsonp( "http://public-api.wordpress.com/rest/v1/sites/wtmpeachtest.wordpress.com/posts?callback=JSON_CALLBACK",{ //'http://cs621417.vk.me/v621417103/c5f2/VU_ynS7wQL4.jpg?callback=JSON_CALLBACK',{ // 'http://angularjs.org/greet.php?callback=JSON_CALLBACK',{
            params:{
                name:$scope.name
            }
        }).success(function(data){
            $scope.greeting = JSON.stringify(data);
        }).error(function(){
                console.log('error');
            });
    };
})

.controller("ResourceController",function($scope, resourceService){
    $scope.addUserREST=function(){
        resourceService.query({},function(data){
            console.log(data);
        });
        console.log("Hello!");
    };
    /*$scope.users = Users.query({}, function(users){
        console.log($scope.users.length);
    });*/

    })

.provider('notificationsService',function(){
    var config = {
        maxLen:10
    };
    var notifications = [];

    return{
        setMaxLength: function(maxLen){
            config.maxLen = maxLen||config.maxLen;
        },
        $get:function(notificationArhive){
            return {
                push:function(notification){
                    var notificationToArchive,
                        newLen = notifications.unshift(notification);
                   if (newLen > config.maxLen) {
                        notificationToArchive = notifications.pop();
                       notificationArhive.archive(notificationToArchive);
                    }
                    return true;
                },
                getCurrent: function () {
                    return notifications;
                }
            }
        }
    }
})

.factory('Users', function($resource){
        var Users =  $resource(
        "https://api.mongolab.com/api/1/databases/angular_js/collections/users/:id",
        {
            apiKey:"H7NnGFZwutQwxFP6T8Kc_XhkQe4Z4ygX",
            id:'@_id.$oid'
        });
        return Users;
})

.provider('resourceService',function(){
    var config={
        pathToService: "https://api.mongolab.com/api/1/databases/angular_js/collections/users/:id"
    };
    return{
        setPathToService:function(path){
            config.pathToService = path||config.pathToService;
        },
        $get:function($resource){
            return $resource (
                config.pathToService,{
                    apiKey:"H7NnGFZwutQwxFP6T8Kc_XhkQe4Z4ygX",
                    id:'@_id.$oid'
                }
            )
        }
    }
});




/*helloApp.factory('notificationsService',function(notificationArchive, MAX_LEN) {
       var notifications = [];
    return {
        push: function (notification) {
            var notificationToArchive,
                newLen = this.notifications.unshift(notification);
            if (newLen > MAX_LEN) {
                notificationToArchive = notifications.pop();
                notificationArchive.archive(notificationToArchive);
            }
        },
        getCurrent: function () {
            return notifications;
        }
    }
});*/


