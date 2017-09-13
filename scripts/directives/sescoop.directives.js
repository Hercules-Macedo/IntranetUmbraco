

app.directive('dateTimePicker', function ($timeout, $parse) {
    return {
        restrict: 'AE',
        replace: 'false',
        link: function ($scope, element, $attrs) {
            return $timeout(function () {

                var ngModelGetter = $parse($attrs['ngModel']);
                var ngModelGetterRaw = $parse($attrs['ngModelRaw']);

                var minDateValue = $parse($attrs['minDateValue']);
                var maxDateValue = $parse($attrs['maxDateValue']);

                var expressionHandler = $parse($attrs.callback);
                var format = $attrs['pickerFormat'];

                var elememtMinDate = $('.date[ng-model="' + $attrs['elementMinDate'] + '"]');
                var elememtMaxDate = $('.date[ng-model="' + $attrs['elementMaxDate'] + '"]');


                $(element).find('input').unbind('blur').blur(function () {
                    if ($(this).val() == "" || $(this).val() == undefined || $(this).val() == null) {
                        console.log("Clearing date...");
                        ngModelGetter.assign($scope, undefined);
                        ngModelGetterRaw.assign($scope, undefined);

                        //callback
                        if (expressionHandler != undefined) {
                            expressionHandler($scope);
                        }

                    }
                });

                var r = $(element).datetimepicker(
                    {
                        allowInputToggle: false,
                        locale: moment.locale('pt-br'),
                        useCurrent: false,
                        format: format == undefined ? "DD/MM/YYYY HH:mm" : format,
                        icons: {
                            time: 'fa fa-clock-o',
                            date: 'fa fa-calendar',
                            up: 'fa fa-chevron-up',
                            down: 'fa fa-chevron-down',
                            previous: 'fa fa-chevron-left',
                            next: 'fa fa-chevron-right',
                            today: 'fa fa-screenshot',
                            clear: 'fa fa-trash',
                            close: 'fa fa-remove'
                        },
                        tooltips: {
                            today: 'Go to today',
                            clear: 'Clear selection',
                            close: 'Close the picker',
                            selectMonth: 'Select Month',
                            prevMonth: 'Previous Month',
                            nextMonth: 'Next Month',
                            selectYear: 'Select Year',
                            prevYear: 'Previous Year',
                            nextYear: 'Next Year',
                            selectDecade: 'Select Decade',
                            prevDecade: 'Previous Decade',
                            nextDecade: 'Next Decade',
                            prevCentury: 'Previous Century',
                            nextCentury: 'Next Century',
                            pickHour: 'Pick Hour',
                            incrementHour: 'Increment Hour',
                            decrementHour: 'Decrement Hour',
                            pickMinute: 'Pick Minute',
                            incrementMinute: 'Increment Minute',
                            decrementMinute: 'Decrement Minute',
                            pickSecond: 'Pick Second',
                            incrementSecond: 'Increment Second',
                            decrementSecond: 'Decrement Second',
                            togglePeriod: 'Toggle Period',
                            selectTime: 'Select Time'
                        },
                    }).on('dp.change', function (event) {


                        if (elememtMinDate.length > 0) {
                            $($(elememtMinDate)[0]).data("DateTimePicker").minDate(event.date.utc());
                        }

                        if (elememtMaxDate.length > 0) {
                            $($(elememtMaxDate)[0]).data("DateTimePicker").maxDate(event.date.utc());
                        }


                        if (event.oldDate == null ||
                            event.oldDate._d.getDate() != event.date._d.getDate() ||
                            event.oldDate._d.getMonth() != event.date._d.getMonth() ||
                            event.oldDate._d.getFullYear() != event.date._d.getFullYear()) {
                            $(element).data("DateTimePicker").hide();
                        }

                        $scope.$apply(function () {
                            if (event.date && event.date.isValid()) {
                                ngModelGetter.assign($scope, event.date.local().format(format));
                                ngModelGetterRaw.assign($scope, new Date(event.date.local().format("YYYY-MM-DDTHH:mm:ss")));
                            }
                        });

                        $scope.$watch($attrs['ngModel'], function (o, n) {
                            console.log("Valor de {0} para {1}".format(o, n));
                            console.log(element);
                        });

                        //callback
                        if (expressionHandler != undefined) {
                            expressionHandler($scope);
                        }

                    });

                    if (minDateValue != undefined && minDateValue != null && minDateValue != {}) {
                        $(r).data("DateTimePicker").minDate(minDateValue.date.utc());
                    }

                    if (maxDateValue != undefined && maxDateValue != null && maxDateValue != {}) {
                        $(r).data("DateTimePicker").maxDate(maxDateValue.date.utc());
                    }

                    return r;

            });
        }
    };
});

app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$evalAsync(attr.onFinishRender);
            }
        }
    }
});

app.directive("cardUsuarioInfo", function ($timeout) {
    return {
        restrict: 'AE',
        replace: 'true',
        templateUrl: "/scripts/views/pessoas/_card.html",
        link: function (scope, element, attrs) {
            $timeout(function () { 
                scope.imgCardBack = attrs['ngImageCard'];
                scope.textTitleCardInfo = attrs['textTitleCardInfo'];
                scope.iconTitleCardInfo = attrs['iconTitleCardInfo'];
                scope.ngShowDetalhes = attrs['ngShowDetalhes'];
                scope.ngFerias = attrs['ngFerias'];
                scope.ngAdmissao = attrs['ngAdmissao'];
                scope.ngDesligamento = attrs['ngDesligamento'];
            });
        }
    };
});

app.directive("modalShow", function () {
    return {
        restrict: "A",
        templateUrl: "/scripts/views/pessoas/template.modal.pessoa.html",
        link: function (scope, element, attrs) {

            var setupModal = element.find('.modal');
            setupModal.attr("id", attrs.modalName);

            //Hide or show the modal
            scope.showModal = function (visible) {
                
                var modal = $('#' + attrs.modalName);

                if (visible) {
                    modal.appendTo("body").modal("show");
                }else {
                    modal.modal("hide");
                }
                console.log(" scope.showModal: " + visible);
            }

            //Check to see if the modal-visible attribute exists
            if (!attrs.modalVisible) {

                //The attribute isn't defined, show the modal by default
                scope.showModal(true);

            }else {

                //Watch for changes to the modal-visible attribute
                scope.$watch("modalVisible", function (newValue, oldValue) {
                    scope.showModal(newValue);
                    console.log('modal');
                });

                //Update the visible value when the dialog is closed through UI actions (Ok, cancel, etc.)
                $('#' + attrs.modalName).bind("hide.bs.modal", function () {
                    scope.modalVisible = false;
                    if (!scope.$$phase && !scope.$root.$$phase)
                        scope.$apply();
                });

            }

        }
    };

});

app.directive("dashboardCard", function ($timeout) {
    return {
        restrict: 'AE',
        replace: 'true',
        scope: {
            icon: '@',
            url: '@',
            tileClass : '@',
            title: '@',
            value: '=',
            delay: "@",
            numero:"@"
        },
        template: '<div class="dashboard-tile detail {{tileClass}} animate-it" data-delay="{{delay}}"> <div class="content"> <h1 class="text-left timer animated fadeInUp" data-from="0" data-to="180" data-speed="2500" ng-hide="{{value}}"></h1> <a style="color:#FFF; font-size:115%;" href="{{url}}">{{title}}</a> </div> <div class="icon"> <i class="{{icon}}"></i> </div> </div>'
    };
});

app.directive("pagination", function ($timeout) {
    return {
        restrict: 'AE',
        replace: 'true',
        scope: {
            pagining: '=',
            changing: '&'
        },
        templateUrl: "/scripts/views/shared/_pager.html",
        link: function ($scope, element, attrs) {

            //$scope.pagining = {};

            $scope.changePage = function (p) {
                $scope.pagining.currentPage = p;
                $scope.changing();
                return false;
            };

            $scope.totalPages = function () {
                var i = Math.ceil($scope.pagining.totalItems / $scope.pagining.pageSize);
                return $scope.rangeSplit($scope.pagining.currentPage, $scope.pagining.totalItems, $scope.pagining.pageSize);
            };

            $scope.rangeSplit = function (currentPage, totalItems, pageSize) {
                // [1,2,3,4,5,6,7,8,9,10]
                // 1 [1,2,3,4,5]
                // 6 [4,5,6,7,8]
                // 7 [5,6,7,8,9]

                // default to first page
                currentPage = currentPage || 1;

                // default page size is 10
                pageSize = pageSize || 10;

                // calculate total pages
                var totalPages = Math.ceil(totalItems / pageSize);

                if (totalPages <= 10) {
                    // less than 10 total pages so show all
                    $scope.pagining.startPage = 1;
                    $scope.pagining.endPage = totalPages;
                } else {
                    // more than 10 total pages so calculate start and end pages
                    if (currentPage <= 6) {
                        $scope.pagining.startPage = 1;
                        $scope.pagining.endPage = 10;
                    } else if (currentPage + 4 >= totalPages) {
                        $scope.pagining.startPage = totalPages - 9;
                        $scope.pagining.endPage = totalPages;
                    } else {
                        $scope.pagining.startPage = currentPage - 5;
                        $scope.pagining.endPage = currentPage + 4;
                    }
                }

                // calculate start and end item indexes
                var startIndex = (currentPage - 1) * pageSize;
                var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

                // create an array of pages to ng-repeat in the pager control
                // var pages = _.range(startPage, endPage + 1);
                var pages = [];
                for (var i = $scope.pagining.startPage; i <= $scope.pagining.endPage; i++) {
                    pages.push( i );
                }
                return pages;
            };

            $scope.range = function (start, end) {
                var ret = [];
                if (!end) {
                    end = start;
                    start = 0;
                }
                for (var i = start; i < end; i++) {
                    ret.push(i);
                }
                return ret;
            };

            $scope.prevPage = function () {
                if ($scope.pagining.currentPage > 0) {
                    $scope.pagining.currentPage--;
                    $scope.changing();
                }
            };

            $scope.nextPage = function () {
                if ($scope.pagining.currentPage < $scope.totalPages().length - 1) {
                    $scope.pagining.currentPage++;
                    $scope.changing();
                }
            };

        }
    };
});

app.directive('uiMoney', function () {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ngModelCtrl) {
            element.mask("#.##0,00", { reverse: true });
            ngModelCtrl.$parsers.unshift(function (value) {
                return element.val();
            });
            ngModelCtrl.$formatters.unshift(function (value) {
                return element.masked(parseFloat( value ).toFixed(2));
            });
        }
    };
});