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

angular.module('helloApp', ['ui.keypress'])
.service('notificationArhive',notificationArhive )
.config(function(notificationsServiceProvider){
    notificationsServiceProvider.setMaxLength(15);
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

.controller("HttpFunctionsController",function($scope, $http){
    var getAllUsers = function() {
        var response = $http.get(httpUrl, {
            params: {
                apiKey: "H7NnGFZwutQwxFP6T8Kc_XhkQe4Z4ygX"
            }
        });
        response.success(function (data, status, headers, config) {
            console.log("Users has been getting " + data);
            $scope.users = data;
        });
        response.error(function () {

        });
    };

    var httpUrl = "https://api.mongolab.com/api/1/databases/angular_js/collections/users";
    getAllUsers();


    $scope.addUser = function() {
        var newUser = {
            userName: $scope.userName || 'DefaultUser',
            userEmail: $scope.userEmail || 'default@yandex.ru'
        };
        console.log(JSON.stringify(newUser));
        var response = $http.post(httpUrl, newUser, {
            params:{
                apiKey:"H7NnGFZwutQwxFP6T8Kc_XhkQe4Z4ygX"
            }
        });
        response.success(function(data, status, headers, config){
            console.log("User has been added "+ data);
        });
        response.error(function(){

        });

        $scope.userEmail = "";
        $scope.userName = "";
        getAllUsers();
    };
    $scope.deleteUser=function(idUser) {
        var response = $http.put(httpUrl+'/'+idUser.$oid,{
            params: {
                apiKey: "H7NnGFZwutQwxFP6T8Kc_XhkQe4Z4ygX"
            }
        });
        response.success(function (data, status, headers, config) {
            console.log("Users has been delete " + data);
        });
        response.error(function () {

        });
        getAllUsers();
    };
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


