(function($){
    'use strict';
    angular
        .module('main',[
            'base'
        ])
        .service('mainService',['$http','$rootScope','$q','baseService','CONFIG',function($http,$rootScope,$q,baseService,CONFIG){

            var bs=baseService;

            var o={

            };
            return o;
        }])
        .controller('mainController',['$scope','$http','$rootScope','$q','mainService','baseService','CONFIG',function($scope,$http,$rootScope,$q,mainService,baseService,CONFIG){
            var ms=$scope.ms=mainService,
                bs=$scope.bs=baseService,
                cfg=$scope.CONFIG=CONFIG;


        }])

})(jQuery);