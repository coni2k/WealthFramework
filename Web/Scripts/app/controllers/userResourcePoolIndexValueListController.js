//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

(function () {
    'use strict';

    var controllerId = 'userResourcePoolIndexValueListController';
    angular.module('main')
        .controller(controllerId, ['userResourcePoolIndexValueService',
            'logger',
			userResourcePoolIndexValueListController]);

    function userResourcePoolIndexValueListController(userResourcePoolIndexValueService,
        logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.deleteUserResourcePoolIndexValue = deleteUserResourcePoolIndexValue;
        vm.userResourcePoolIndexValueSet = [];

        initialize();

        function initialize() {
            getUserResourcePoolIndexValueSet();
        };

        function deleteUserResourcePoolIndexValue(userResourcePoolIndexValue) {
            userResourcePoolIndexValueService.deleteUserResourcePoolIndexValue(userResourcePoolIndexValue);

            userResourcePoolIndexValueService.saveChanges()
                .then(function () {
                    vm.userResourcePoolIndexValueSet.splice(vm.userResourcePoolIndexValueSet.indexOf(userResourcePoolIndexValue), 1);
                    logger.logSuccess("Hooray we saved", null, true);
                })
                .catch(function (error) {
                    logger.logError("Boooo, we failed: " + error.message, null, true);
                    // Todo: more sophisticated recovery. 
                    // Here we just blew it all away and start over
                    // refresh();
                })
        };

        function getUserResourcePoolIndexValueSet() {
            userResourcePoolIndexValueService.getUserResourcePoolIndexValueSet(false)
			    .then(function (data) {
                    vm.userResourcePoolIndexValueSet = data;
                });
        }
    };
})();
