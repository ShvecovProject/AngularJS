/**
 * Created by Shvecov on 23.03.2015.
 */
var helloApp = angular.module('helloApp', []);
helloApp.value('notificationArchive', new NotificationArchive());
helloApp.constant('MAX_LEN',10);
//helloApp.service('notificationService', NotificationService);
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
helloApp.provider('notificationsService',function(){
   var config = {
     maxLen:10
   };
    var notifications = [];

    return{
        setMaxLength: function(maxLen){
            config.maxLen = maxLen||config.maxLen;
        },
        $get:function(notificationArchive){
            return {
                push:function(){
                    var notificationToArchive,
                        newLen = this.notifications.unshift(notification);
                    if (newLen > config.maxLen) {
                        notificationToArchive = notifications.pop();
                        notificationArchive.archive(notificationToArchive);
                    }
                },
                getCurrent: function () {
                    return notifications;
                }
            }
        }
    }
});
