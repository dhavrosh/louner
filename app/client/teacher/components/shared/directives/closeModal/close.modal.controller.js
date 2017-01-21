(function () {
    "use strict";

    angular
        .module('teacherApp')
        .controller('closeModalController', closeModalController);

    closeModalController.$inject = ['$uibModalInstance', 'warning', 'close', 'dismiss'];

    function closeModalController($uibModalInstance, warning, close, dismiss) {
        const vm = this;

        vm.modal = $uibModalInstance;
        vm.warning = warning;
        vm.close = close;
        vm.dismiss = dismiss;
    }
})();