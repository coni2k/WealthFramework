﻿(function () {
    'use strict';

    var resourcePoolEditorDirectiveId = 'resourcePoolEditor';

    angular.module('main')
        .directive(resourcePoolEditorDirectiveId, ['resourcePoolService',
            'userService',
            //'elementService',
            //'userElementCellService',
            '$rootScope',
            'logger',
            resourcePoolEditor]);

    function resourcePoolEditor(resourcePoolService,
        userService,
        //elementService,
        //userElementCellService,
        $rootScope,
        logger) {

        // Logger
        logger = logger.forSource(resourcePoolEditorDirectiveId);

        function link(scope, elm, attrs) {

            scope.userId = 0;
            scope.resourcePool = null;
            scope.chartConfig = {
                options: {
                    plotOptions: {
                        column: {
                            allowPointSelect: true,
                            pointWidth: 15
                        },
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    xAxis: { categories: [''] },
                    yAxis: {
                        allowDecimals: false,
                        min: 0
                    }
                }
            };

            //scope.resourcePool = new Object();
            //scope.resourcePool.currentElement = null;

            //// TODO Just for test            
            //scope.currentElementIndex = 0;
            //scope.toggleCurrentElement = function () {

            //    scope.currentElementIndex++;

            //    if (typeof scope.resourcePool.ElementSet[scope.currentElementIndex] === 'undefined') {
            //        scope.currentElementIndex = 0;
            //    }

            //    scope.resourcePool.currentElement = scope.resourcePool.ElementSet[scope.currentElementIndex];
            //}

            ////scope.updateValueFilter = updateValueFilter;
            //scope.toggleValueFilter = function () {
            //    scope.valueFilter = scope.valueFilter === 1 ? 2 : 1;
            //    getResourcePool();
            //}

            //scope.valueFilterText = function () {
            //    return scope.valueFilter === 1 ? "Only My Ratings" : "All Ratings";
            //}

            //// Value filter
            //scope.valueFilter = 1;

            //// Highchart initial config
            //scope.chartConfig = {
            //    elementId: null,
            //    options: {
            //        chart: {
            //            type: ''
            //        },
            //        plotOptions: {
            //            column: {
            //                allowPointSelect: true,
            //                pointWidth: 15
            //            },
            //            pie: {
            //                allowPointSelect: true,
            //                cursor: 'pointer',
            //                dataLabels: {
            //                    enabled: false
            //                },
            //                showInLegend: true
            //            }
            //        },
            //        xAxis: { categories: [''] },
            //        yAxis: {
            //            allowDecimals: false,
            //            min: 0
            //        }
            //    }
            //};

            // Get userId and initialize
            userService.getUserInfo()
                .then(function (userInfo) {
                    // TODO Obsolete?
                    scope.userId = userInfo.Id;
                    initialize(userInfo.Id);
                });

            function initialize(currentUserId) {

                // Event handlers

                // TODO 'Does the event belongs to me' check?
                $rootScope.$on('resourcePoolCurrentElementChanged', function () {
                    loadChartData(scope.resourcePool.currElement());
                });
                $rootScope.$on('elementMultiplierIncreased', saveChanges);
                $rootScope.$on('elementMultiplierDecreased', saveChanges);
                $rootScope.$on('elementMultiplierReset', saveChanges);
                $rootScope.$on('indexRatingIncreased', saveChanges);
                $rootScope.$on('indexRatingDecreased', saveChanges);

                // Get the current resource pool
                scope.$watch('resourcePoolId', function () {

                    resourcePoolService.getResourcePoolCustomEdit(scope.resourcePoolId)
                        .then(function (data) {
                            scope.resourcePool = data[0];
                            scope.resourcePool.currentUserId = currentUserId;
                            loadChartData(scope.resourcePool.currElement());
                        })
                        .catch(function (error) {
                            // TODO User-friendly message?
                        });

                    // getResourcePool();
                }, true);


                //scope.$watch('chartHeight', function () {
                //    scope.chartConfig.options.chart.height = scope.chartHeight;
                //}, true);

            }

            //// Listen resource pool updated event
            //$rootScope.$on('resourcePool_ResourcePoolRateUpdated', resourcePoolUpdated);
            //$rootScope.$on('resourcePool_Saved', resourcePoolUpdated);

            //$rootScope.$on('element_MultiplierIncreased', elementUpdated);
            //$rootScope.$on('element_MultiplierDecreased', elementUpdated);
            //$rootScope.$on('element_MultiplierReset', elementUpdated);

            //function resourcePoolUpdated(event, resourcePoolId) {
            //    if (scope.resourcePoolId === resourcePoolId)
            //        getResourcePool();
            //}

            //function elementUpdated(event, elementId) {
            //    // TODO Can it be done through element.ResourcePool = resourcePool or somethin'?
            //    for (var i = 0; i < scope.resourcePool.ElementSet.length; i++) {
            //        if (scope.resourcePool.ElementSet[i].Id === elementId) {
            //            getResourcePool();
            //            break;
            //        }
            //    }
            //}

            function loadChartData(element) {

                scope.chartConfig.title = { text: element.Name };
                scope.chartConfig.options.chart = { type: element.resourcePoolField() ? 'column' : 'pie' };
                scope.chartConfig.options.yAxis.title = { text: element.resourcePoolField() ? 'Total Income' : '' };
                scope.chartConfig.series = [];

                if (element.resourcePoolField()) {
                    // Column type
                    for (var i = 0; i < element.ElementItemSet.length; i++) {
                        var elementItem = element.ElementItemSet[i];
                        var item = new columnChartItem(elementItem);
                        scope.chartConfig.series.push(item);
                    }
                } else {
                    // Pie type
                    var chartData = [];
                    for (var i = 0; i < element.ElementItemSet.length; i++) {
                        var elementItem = element.ElementItemSet[i];
                        for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
                            var elementCell = elementItem.ElementCellSet[x];
                            if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
                                var chartItem = new pieChartItem(elementCell);
                                chartData.push(chartItem);
                            }
                        }
                    }
                    scope.chartConfig.series = [{ data: chartData }];
                }
            }

            function saveChanges() {

                resourcePoolService.saveChanges()
                    .then(function (result) {

                    })
                    .catch(function (error) {
                        // Conflict (Concurrency exception)
                        if (error.status !== 'undefined' && error.status === '409') {
                            // TODO Try to recover!
                        } else if (error.entityErrors !== 'undefined') {
                            // vm.entityErrors = error.entityErrors;
                        }
                    })
                    .finally(function () {

                    });
            }

            // TODO Store these in a better place?
            function columnChartItem(elementItem) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get: function () { return elementItem.Name; }
                });

                Object.defineProperty(self, "data", {
                    enumerable: true,
                    configurable: true,
                    get: function () { return [elementItem.totalIncome()]; }
                });
            }

            function pieChartItem(elementCell) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get: function () { return elementCell.ElementItem.Name; }
                });

                Object.defineProperty(self, "y", {
                    enumerable: true,
                    configurable: true,
                    get: function () { return elementCell.valuePercentage(); }
                });
            }

            //function getResourcePool() {

            //    resourcePoolService.getResourcePoolCustom(scope.resourcePoolId, scope.valueFilter)
            //        .success(function (resourcePool) {

            //            // Resource pool
            //            scope.resourcePool = resourcePool;

            //            // ResourcePool functions
            //            resourcePool.updateResourcePoolRate = updateResourcePoolRate;

            //            // Elements
            //            for (var elementIndex = 0; elementIndex < resourcePool.ElementSet.length; elementIndex++) {
            //                var element = resourcePool.ElementSet[elementIndex];

            //                // Set current element
            //                if (!scope.resourcePool.currentElement && element.IsMainElement) {
            //                    // logger.log('getResourcePool - scope.resourcePool.currentElement', scope.resourcePool.currentElement);
            //                    scope.resourcePool.currentElement = element;
            //                }

            //                // Element functions
            //                element.increaseMultiplier = increaseMultiplier;
            //                element.decreaseMultiplier = decreaseMultiplier;
            //                element.resetMultiplier = resetMultiplier;

            //                // Fields
            //                for (var fieldIndex = 0; fieldIndex < element.ElementFieldSet.length; fieldIndex++) {
            //                    var field = element.ElementFieldSet[fieldIndex];

            //                    // Field functions
            //                    if (field.ElementFieldType === 6) {
            //                        field.setCurrentElement = setCurrentElement;
            //                    }
            //                }

            //                // Items
            //                for (var i = 0; i < element.ElementItemSet.length; i++) {
            //                    var elementItem = element.ElementItemSet[i];

            //                    // Cells
            //                    for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
            //                        var elementCell = elementItem.ElementCellSet[x];

            //                        // Cell functions
            //                        if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
            //                            elementCell.increaseIndexCellValue = function () {
            //                                updateIndexCellValue(this, 'increase');
            //                            }

            //                            elementCell.decreaseIndexCellValue = function () {
            //                                updateIndexCellValue(this, 'decrease');
            //                            }
            //                        }
            //                    }
            //                }
            //            }

            //            loadChart();
            //        });

            //    function setCurrentElement() {
            //        scope.resourcePool.currentElement = this.SelectedElement;
            //        logger.log('setCurrentElement - scope.resourcePool.currentElement', scope.resourcePool.currentElement);

            //        loadChart();

            //        // getResourcePool();
            //    }

            //    function updateResourcePoolRate(rate) {
            //        resourcePoolService.updateResourcePoolRate(scope.resourcePoolId, rate);
            //    }

            //    function increaseMultiplier() {
            //        elementService.increaseMultiplier(this.Id);
            //    }

            //    function decreaseMultiplier() {
            //        elementService.decreaseMultiplier(this.Id);
            //    }

            //    function resetMultiplier() {
            //        elementService.resetMultiplier(this.Id);
            //    }

            //    function updateIndexCellValue(elementCell, type) {

            //        userElementCellService.getUserElementCellSetByElementCellId(elementCell.Id, true)
            //            .then(function (userElementCellSet) {

            //                var userElementCell = null;

            //                if (userElementCellSet.length > 0) {
            //                    userElementCell = userElementCellSet[0];
            //                    userElementCell.DecimalValue = type === 'increase'
            //                        ? userElementCell.DecimalValue + 10
            //                        : userElementCell.DecimalValue - 10;

            //                    var rowVersion = userElementCell.RowVersion;
            //                    userElementCell.RowVersion = '';
            //                    userElementCell.RowVersion = rowVersion;
            //                }
            //                else {
            //                    // TODO UserId?
            //                    userElementCell.ElementCellId = elementCell.Id;
            //                    userElementCell.DecimalValue = type === 'increase' // TODO ?
            //                        ? 55
            //                        : 45;
            //                    userElementCellService.createUserElementCell(userElementCell);
            //                }

            //                userElementCellService.saveChanges()
            //                    .then(function () {
            //                        getResourcePool();
            //                    });
            //            });
            //    }
            //}

            //function loadChart() {
            //    // Update Highchart data
            //    scope.chartConfig.loading = true;

            //    // New or existing?
            //    //if (typeof scope.chartConfig.resourcePoolId === 'undefined'
            //    //    || scope.chartConfig.resourcePoolId !== resourcePool.Id) {

            //    if (!scope.chartConfig.elementId
            //        || scope.chartConfig.elementId !== scope.resourcePool.currentElement.Id) {

            //        //scope.chartConfig.resourcePoolId = resourcePool.Id;
            //        scope.chartConfig.elementId = scope.resourcePool.currentElement.Id;
            //        scope.chartConfig.title = scope.resourcePool.Name;
            //        scope.chartConfig.series = [];

            //        // Column type
            //        if (scope.resourcePool.currentElement.HasResourcePoolField) {

            //            scope.chartConfig.options.chart.type = 'column';
            //            scope.chartConfig.options.yAxis.title = { text: 'Total Income' };

            //            for (var i = 0; i < scope.resourcePool.currentElement.ElementItemSet.length; i++) {
            //                var elementItem = scope.resourcePool.currentElement.ElementItemSet[i];
            //                var chartDataItem = {
            //                    name: elementItem.Name,
            //                    data: [elementItem.TotalIncome]
            //                };
            //                scope.chartConfig.series.push(chartDataItem);
            //            }
            //        } else {

            //            // Pie type
            //            scope.chartConfig.options.chart.type = 'pie';
            //            scope.chartConfig.options.yAxis.title = { text: '' };

            //            var chartData = [];
            //            for (var i = 0; i < scope.resourcePool.currentElement.ElementItemSet.length; i++) {
            //                var elementItem = scope.resourcePool.currentElement.ElementItemSet[i];

            //                for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
            //                    var elementCell = elementItem.ElementCellSet[x];

            //                    if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
            //                        var chartDataItem = {
            //                            name: elementItem.Name,
            //                            y: elementCell.ValuePercentage
            //                        };
            //                        chartData.push(chartDataItem);
            //                    }
            //                }
            //            }

            //            scope.chartConfig.series = [{ data: chartData }];
            //        }
            //    } else {
            //        if (scope.resourcePool.currentElement.HasResourcePoolField) {
            //            for (var i = 0; i < scope.resourcePool.currentElement.ElementItemSet.length; i++) {
            //                var elementItem = scope.resourcePool.currentElement.ElementItemSet[i];
            //                var chartDataItem = scope.chartConfig.series[i];
            //                chartDataItem.data = [elementItem.TotalIncome];
            //            }
            //        } else {
            //            for (var i = 0; i < scope.resourcePool.currentElement.ElementItemSet.length; i++) {
            //                var elementItem = scope.resourcePool.currentElement.ElementItemSet[i];

            //                for (var x = 0; x < elementItem.ElementCellSet.length; x++) {
            //                    var elementCell = elementItem.ElementCellSet[x];

            //                    if (elementCell.ElementField.ElementFieldIndexSet.length > 0) {
            //                        var chartDataItem = scope.chartConfig.series[0].data[i];
            //                        chartDataItem.y = elementCell.ValuePercentage;
            //                    }
            //                }
            //            }
            //        }
            //    }

            //    scope.chartConfig.loading = false;

            //}
        }

        return {
            restrict: 'E',
            templateUrl: '/App/views/directives/resourcePoolEditor.html',
            scope: {
                resourcePoolId: '=',
                chartHeight: '='
            },
            link: link
        };
    };

    /* Element Editor */

    var elementEditorDirectiveId = 'elementEditor';

    angular.module('main')
        .directive(elementEditorDirectiveId, ['logger',
            elementEditor]);

    function elementEditor(logger) {
        logger = logger.forSource(elementEditorDirectiveId);

        function link(scope, elm, attrs) {

            // Watches
            //scope.$watch('element', function () {
            //    if (typeof scope.element !== 'undefined') {
            //        logger.log('element', scope.element);
            //    }
            //}, true);

            scope.$watch('resourcePool', function () {

                // This is just a shortcut
                if (scope.resourcePool && scope.resourcePool.currentElement) {
                    scope.element = scope.resourcePool.currentElement;
                }

            }, true);
        }

        return {
            restrict: 'E',
            templateUrl: '/App/views/directives/elementEditor.html',
            scope: {
                // TODO Try to replace this with only currentElement?
                resourcePool: '='
            },
            link: link
        };
    }

    var breadcrumbDirectiveId = 'breadcrumb';

    angular.module('main')
        .directive(breadcrumbDirectiveId, ['logger',
            breadcrumb]);

    function breadcrumb(logger) {
        logger = logger.forSource(breadcrumbDirectiveId);

        function link(scope, elm, atts) {

        }

        return {
            restrict: 'E',
            templateUrl: '/App/views/directives/breadcrumb.html',
            scope: {
                element: '='
            },
            link: link
        };
    }

})();
