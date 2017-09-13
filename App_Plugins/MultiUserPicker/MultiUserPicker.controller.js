//adds the resource to umbraco.resources module:
angular.module('umbraco.resources').factory('multiUserPickerResource',
    function ($q, $http, $routeParams) {
        var apiCallsFactory = {};
        //the factory object returned
        //this cals the Api Controller
        apiCallsFactory.getAllUsers = function () {
            return $http.get("/umbraco/backoffice/CustomEditors/MultiUserPickerApi/GetAllUsers/");
        }
        return apiCallsFactory;
    }
);
angular.module("umbraco")
    .controller("multiUserPickerController", function ($scope, multiUserPickerResource) {
        // Fire when page is loaded and Plugin gets pulled in
        Reload();
        // Loads users from actual Umbraco page
        // Then calls Users API and adds missing users if one was added meanwhile
        function Reload() {
            //Bind Umbraco model to our local model
            $scope.Users = $scope.model.value;
            // Get Users from API
            var promiseGet = multiUserPickerResource.getAllUsers();
            promiseGet.then(function (pl) {
                var usersFromWebApi = pl.data;
                // Check if have some values comming from Actual Umbraco Fields value
                // if not just map all users from API to local model
                if ($scope.Users != "") {
                    angular.forEach(usersFromWebApi, function (usrFromApi, key1) {
                        var found = false;
                        angular.forEach($scope.Users, function (usrFromContent, key2) {
                            if (usrFromApi.Id == usrFromContent.Id) {
                                found = true;
                            }
                        });
                        if (!found) {
                            $scope.Users.push(usrFromApi);
                        }
                    });
                } else {
                    $scope.Users = usersFromWebApi;
                }
            },
            function (errorPl) {
                $log.error('failure loading Users from API', errorPl);
            });
        }
        // Map our local model to Umbraco page model to be autmaticaly saved to database
        $scope.SyncWithUmbracoModel = function (users) {
            $scope.model.value = users;
        };
    });