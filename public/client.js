//Step 1
//take user input to find matching activities

$("#activitySearch").submit(function (event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    var
    var userInput = $("#cityState").val();

    if (userInput === "") {
        alert("Sorry that search did not yeild any results. Please enter a city and state and try your search again.");
    } else {
        // console.log(userInput);
        ajaxActiveSearch(userInput);
    }




});

//use that value from above to make the GET call below
function ajaxSearch(searchTerm) {
    $.ajax({
            type: 'GET',
            url: '/activity/' + searchTerm,
            dataType: 'json',
        })
        .done(function (dataResults) {
            displaySearchData(dataOutput.results);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}


//Step 2
//return results to 'search results' container
function displaySearchData(dataMatches) {

    var buildTheHtmlOutput = "";
    $.each(dataMatches, function (dataMatchesKey, dataMatchesValue) {
        buildTheHtmlOutput += ""
    })
}


//Step 3
//on click, move results to 'my planner' container
