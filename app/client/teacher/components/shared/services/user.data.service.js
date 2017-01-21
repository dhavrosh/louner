(function() {
    'use strict';

    angular
        .module('teacherApp')
        .service('userData', userData);

    userData.$inject = ['$window', '$http'];

    function userData($window, $http) {
        this.credentials = {
            scope: 'scope',
            userId: 'userId',
            userName: 'userName'
        };

        this.store = (prop, value) => {
            if (this.credentials[prop]) {
                $window.localStorage.setItem(this.credentials[prop], value);
            } else {
                console.log('UserDataService has not that prop');
            }
        };

        this.get = prop => {
            if (this.credentials[prop]) {
                return $window.localStorage.getItem(this.credentials[prop]);
            } else {
                console.log('UserDataService has not that prop');
            }
        };

        this.has = prop => {
            if (this.credentials[prop]) {
                return $window.localStorage.getItem(this.credentials[prop]) != undefined;
            } else {
                console.log('UserDataService has not that prop');
            }
        };

        this.clear = () => {
            this.credentials.forEach(credential => {
                $window.localStorage.removeItem(credential);
            })  
        };

        this.addIdToHttpHeader = () => {
            $http.defaults.headers.common['uid'] = this.get(this.credentials.userId);
        };

        this.removeIdFromHttpHeader = () => {
            $http.defaults.headers.common['id'] = undefined;
        };
    }
})();