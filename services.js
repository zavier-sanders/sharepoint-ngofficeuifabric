angular.module('myApp.services', [])

.factory('EmployeeTerminationFactory', function ($q, $http) {
	var webUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/"; 
	var factory = {};

	//Create new termination request
	factory.createRequest = function(data) {
		var deferred = $q.defer();
		var createRequestURL = webUrl + "web/lists(guid'C723FCE2-D26C-42EC-B096-DBD6A43245DF')/Items"; 
		$http({
			url: createRequestURL,
			method: "POST",
			headers: {
				"accept": "application/json;odata=verbose",
				"X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
				"content-Type": "application/json;odata=verbose"
			},
			data: JSON.stringify(data)
		})
		.success(function (result) {
			deferred.resolve(result);
		})
		.error(function (result, status) {
			deferred.reject(status);
			alert("Status Code: " + status);
		});

		return deferred.promise;
	};

	//Get user id
	factory.getUserId = function (UserName) { 
		var deferred = $q.defer();

		$http({
			url: webUrl + "web/siteusers(@v)?@v='" + encodeURIComponent(UserName) + "'",
			method: "GET",
			headers: {
				"accept": "application/json;odata=verbose"
			}
		})
		.success(function (result) {
			deferred.resolve(result);
		})
		.error(function (result, status) {
			deferred.reject(status);
		});

		return deferred.promise;
	};

	//Search for users 
	factory.searchPeople = function(request) {
		var deferred = $q.defer();
		
		$http({
			url: webUrl + "SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser",
			method: "POST",
			data: JSON.stringify({'queryParams':{
	                '__metadata':{
	                    'type':'SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters'
	                },
	                'AllowEmailAddresses':true,
	                'AllowMultipleEntities':false,
	                'AllUrlZones':false,
	                'MaximumEntitySuggestions':50,
	                'PrincipalSource':15,
	                'PrincipalType': 1,
	                'QueryString':request
	                //'Required':false,
	                //'SharePointGroupID':null,
	                //'UrlZone':null,
	                //'UrlZoneSpecified':false,
	                //'Web':null,
	                //'WebApplicationID':null
	            }
	        }),
			headers: {
				"accept": "application/json;odata=verbose",
				'content-type':'application/json;odata=verbose',
                'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value
			}
		})
		.success(function (result) {
			var data = JSON.parse(result.d.ClientPeoplePickerSearchUser);
			var formattedPeople = [];
			var topResultsGroup = { name: "Top Results", order: 0 };

			if (data.length > 0) {
				angular.forEach(data, function (value, key) {
					//Create user initials from user name
					var name = value.DisplayText;
					var userInitials = name.match(/\b\w/g) || [];
					userInitials = ((userInitials.shift() || '') + (userInitials.pop() || '')).toUpperCase();
					
					//Create people object, used for people picker component
					formattedPeople.push({
						initials: userInitials,
          				primaryText: name,
          				secondaryText: value.EntityData.Department,		
          				presence: 'available',
          				group: topResultsGroup,	
          				color: 'blue',
          				id: value.Key
          			});	
				});

				deferred.resolve(formattedPeople);
			}
			
		})
		.error(function (result, status) {
			
			deferred.reject(status);
			alert("Status Code: " + status);
		});

		return deferred.promise;
	};

	return factory;

});