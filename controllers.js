angular.module('myApp.controllers', [])

.controller('MainController', function ($scope, $q, $timeout, EmployeeTerminationFactory) {
	init();

	function init() {

		//Define values for department dropdown directive
		$scope.Departments = {
			'Finance': 'Finance',
			'HR': 'HR',
			'IT': 'IT',
			'Sales': 'Sales'
		};

		//object used to store selected department
		$scope.user = {
			department: []
		};

		//Define the termination request scope object
		$scope.terminationRequest = {
		
            Title: '',

            EmployeeDepartment: '',

            LastDayOfWork: new Date().toISOString(),

            ExitInterviewerId: null,

            ExitInterviewer: [],

            NewPlaceEmployment: '',

            WasTwoWeekNoticeGiven: false,

            PTO: '',

            DateOfNotice: new Date().toISOString(),

            HRComments: '',

            NextJobStartDate: new Date().toISOString(),

            ReasonForTermination: '',

            __metadata: { 'type': 'SP.Data.EmployeeTerminationListItem' }
		};

	}

	var asyncExitInterviewer = [];

	var getPeople = function (people, searchQuery) {
		if (!searchQuery) {
	      return [];
	    }

	    console.log("Searching for " + searchQuery);
	    return people;
	}

	//Find userId when a user is selected from peoplepicker
	$scope.getSelectedUserId = function (data) {
		
		//Set ExitInterviewerId
		var exitInterviewerId = data.ExitInterviewer[0].id;

		EmployeeTerminationFactory.getUserId(exitInterviewerId).then(function (results) {
			data.ExitInterviewerId = results.d.Id;
			console.log(results.d.Id);

			exitInterviewerId = null;
		});
		
	}

	//Create new termination request
	$scope.submitRequest = function (data) {
		
		delete data.ExitInterviewer;
		data.EmployeeDepartment = $scope.user.department;
		

		console.log(data);

		EmployeeTerminationFactory.createRequest(data).then(function (results) {
			// Code block

			return results;
			console.log(results);
			// history.go(-1);

		});
		

		{history.go(-1);};
	}

 	//Search users asynchronously 
	$scope.getExitInterviewer = function (query) {
		var deferred = $q.defer();

		EmployeeTerminationFactory.searchPeople(query).then(function (results) {

			asyncExitInterviewer = JSON.parse(JSON.stringify(results));

			$scope.asyncExitInterviewerResults = getPeople(asyncExitInterviewer, query);

			if (!$scope.asyncExitInterviewerResults || $scope.asyncExitInterviewerResults.length === 0) {

				return $scope.asyncExitInterviewerResults;

			}

			deferred.resolve($scope.asyncExitInterviewerResults);

		});

		return deferred.promise;

	}

	//Remove user
    $scope.removePerson = function (person) {
      var indx = $scope.selectedAsyncPeople.indexOf(person);
      $scope.selectedAsyncPeople.splice(indx, 1);

    }

    //Cancel form and go back to previous page
    $scope.cancel = function() {
    	history.go(-1);
    };
});