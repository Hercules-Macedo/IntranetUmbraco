app.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on(attr.focusOn, function (e) {
            elem[0].focus();
        });
    };
});

//adds the resource to umbraco.resources module:
angular.module('umbraco.resources').factory('CascadeDropDownContentResource',
    function ($q, $http, $routeParams) {
        var apiCallsFactory = {};
        //the factory object returned
        //this cals the Api Controller
        apiCallsFactory.getAllContent = function ($parameters) {
            return $http.post("/umbraco/backoffice/api/DropDownContent/GetAllContent/", $parameters);
        }
        return apiCallsFactory;
    }
);


angular.module("umbraco").controller("CascadeDropDownContentController", function ($scope, CascadeDropDownContentResource) {

    $scope.onCascadeLoad = function () {

        $scope.selectedA = $scope.model.value.Area;
        $scope.selectedB = $scope.model.value.Nucleo;

        var promisePost = CascadeDropDownContentResource.getAllContent({ Id: $scope.model.config.ConteudoA, where: "", compareTo: "" });
        promisePost.then(function (pl) {
            $scope.ListA = pl.data;

            if ($scope.model.value != undefined)
            {
                var promisePost = CascadeDropDownContentResource.getAllContent({ Id: $scope.model.value.Area.Id, where: "", compareTo: "" });
                promisePost.then(function (pl) {
                    $scope.ListB = pl.data;
                },
                function (errorPl) {
                    $log.error('failure loading Users from API', errorPl);
                });
            }
        },
        function (errorPl) {
            $log.error('failure loading Users from API', errorPl);
        });

    };

    $scope.onCascadeLoad();

    var setModel = function (valueA, valueB)
    {
        $scope.model.value = { "Area": { Id: valueA.Id, Name: valueA.Name }, "Nucleo": { Id: valueB.Id, Name: valueB.Name } };
    };

    if($scope.model.value.Area == undefined)
        $scope.selectedA = {};

    $scope.ChangeA = function (preValue)
    {
        $scope.model.value = {};

        $scope.nucleo = {};

        if ($scope.area != undefined) {
            $scope.selectedA = $scope.ListA[$scope.area];
            var promisePost = CascadeDropDownContentResource.getAllContent({ Id: $scope.selectedA.Id, where: "", compareTo: "" });
            promisePost.then(function (pl) {
                $scope.ListB = pl.data;
            },
            function (errorPl) {
                $log.error('failure loading Users from API', errorPl);
            });
        }
    };

    $scope.selectedB = {};
    $scope.ChangeB = function ()
    {
        if ($scope.nucleo == "") {
            $scope.model.value = {};
        } else if ($scope.nucleo != undefined) {
            $scope.selectedB = $scope.ListB[$scope.nucleo];
            setModel($scope.selectedA, $scope.selectedB);
        }
    };

});

angular.module("umbraco").controller("DropDownContentController", function ($scope, CascadeDropDownContentResource) {

    var promisePost = CascadeDropDownContentResource.getAllContent({ Id: $scope.model.config.ConteudoId, where: "", compareTo: "" });
    promisePost.then(function (pl) {
        $scope.List = pl.data;
        $scope.value = $scope.model.value;
    },
    function (errorPl) {
        $log.error('failure loading Users from API', errorPl);
    });

    $scope.Change = function () {
        var obj = $scope.List[$scope.value];
        $scope.model.value = { Id: obj.Id, Name: obj.Name };
    };
});

angular.module("umbraco").controller("SimpleListController", function ($scope) {

    $scope.add = function () {

        if (!(Object.prototype.toString.call($scope.model.value) === '[object Array]')) {
            $scope.model.value = [];
        }
        $scope.model.value.push($scope.text);
        $scope.text = "";
        $scope.$broadcast('new-item-added');
    };

    $scope.remove = function (item) {
        var i = $scope.model.value.indexOf(item);
        if (i != -1) {
            $scope.model.value.splice(i, 1);
        }

        if ($scope.model.value.length == 0)
            $scope.model.value = {};

    };

});