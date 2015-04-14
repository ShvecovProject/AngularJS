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

var helloApp = angular.module('helloApp', ['ui.keypress']);
helloApp.service('notificationArhive',notificationArhive );
helloApp.provider('notificationsService',function(){
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
helloApp.config(function(notificationsServiceProvider){
    notificationsServiceProvider.setMaxLength(15);
});
helloApp.controller('HelloController',function($scope){
    $scope.getName = function(){
        return $scope.name;
    };
});
helloApp.controller('WorldController', function($scope){
   $scope.population = 7000;
   $scope.countries = [
                       {name:'France',population:63.1},
                       {name:'United Kingdom', population:61.8}
                       ];
    $scope.worldsPercentage = function(countryPopulation){
        return (countryPopulation/$scope.population)*100;
    }
});

helloApp.controller("MessageController",function($scope, notificationsService){
        $scope.getCurrentNotif = function(){
          return $scope.notification;
        };
        $scope.addToNotif = function(notification){
            var flag = notificationsService.push(notification);
            if(flag){
                $scope.notification = "";
                console.log("Complete.....");
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


