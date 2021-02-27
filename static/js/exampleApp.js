//
var exampleApp = angular.module('exampleApp',[]);

exampleApp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

exampleApp.service('ajaxService', function ($http,$q) {
    
    this.ajaxHttpGetCall = function (url) {
        var deferred = $q.defer();
        $http.get(url)
        .then(function(response) {
             deferred.resolve(response);
        },function(response){
            deferred.resolve(response);
        });
        return deferred.promise
    };

    this.ajaxHttpPostCall = function (url,data) {
        var deferred = $q.defer();
        $http.post(url,data)
        .then(function(response) {
             deferred.resolve(response);
        },function(response){
            deferred.resolve(response);
        });
        return deferred.promise
    };
});

exampleApp.controller('tableController', function($scope, ajaxService){
    
    $scope.isEditMode = false;
    $scope.checkboxList = [];
    
    $scope.getImages = function(){
        var result = ajaxService.ajaxHttpGetCall("./getImages")
        result.then(function(response){
            $scope.tableContents = response.data;
        });
    };

    
    $scope.uploadImages = function(){
        
        var result = ajaxService.ajaxHttpPostCall("./uploadImages",$scope.form)
        result.then(function(response){
            $scope.form = {} // reset the form contents
            $scope.getImages(); // call get Images to fetch list of updated images
        });    
    };


    //From the Table Contents, get the Objects to be Deleted and Send it to BackEnd..
    $scope.deleteImages = function(){
        var objectsToBeDeleted = {}
        var countChanges = 0;
        for(index in $scope.checkboxList){
            var objectId = $scope.checkboxList[index]
            if(objectId > 0)
            {
                countChanges+=1;
                objectsToBeDeleted[objectId] = true
            }
        }

        if(countChanges == 0){
            //No changes made, just delete button pressed!!!
            $scope.alertMessage = "Please select the Image to be Deleted!!";
            return;
        }

        var result = ajaxService.ajaxHttpPostCall("./deleteImages",objectsToBeDeleted)
        result.then(function(response){
            $scope.disableEditMode(); //exit from edit mode
            $scope.getImages();  // call get images to fetch latest list
        });
    };

    $scope.enableEditMode = function(){
        $scope.checkboxList = []
        $scope.isEditMode = true;
    };

    $scope.disableEditMode = function(){
        $scope.checkboxList = [];
        $scope.isEditMode = false;
    };
    
    $scope.getImages();
}); 