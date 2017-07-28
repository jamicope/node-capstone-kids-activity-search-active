//Step 1
//take user input to find matching activities

$("#criteria").submit(function (event) {
    //if the page refreshes when you submit the form use "preventDefault()" to force JavaScript to handle the form submission
    event.preventDefault();
    var userActivity = $("#activity").val();
    var userState = $("#cityState").val();
    console.log(userActivity);
    console.log(userState);

    if (userState === "") {
        alert("Sorry that search did not yeild any results. Please enter a city and state and try your search again.");
    } else if (userActivity === "") {
        alert("Please select an activity")
    } else {
        // console.log(userInput);
        ajaxSearch(userActivity, userState);
    }

});

//use that value from above to make the GET call below
function ajaxSearch(activity, state) {
    $.ajax({
            type: 'GET',
            url: '/activity/' + activity + '/' + state,
            dataType: 'json',
        })
        .done(function (dataResults) {
            console.log(dataResults);
            displaySearchData(dataResults.results);
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
    console.log(dataMatches);
    var buildTheHtmlOutput = "";
    $.each(dataMatches, function (dataMatchesKey, dataMatchesValue) {
        buildTheHtmlOutput += "<li class='activities'>"
        buildTheHtmlOutput += "<div class='my-planner'>";
        var utcDate = dataMatchesValue.activityStartDate; // ISO-8601 formatted date returned from server
        buildTheHtmlOutput += "<form class='addToPlanner'>";
        buildTheHtmlOutput += "<input type='hidden' class='addToPlannerValue' value='" + dataMatchesValue.assetName + "'>";
        buildTheHtmlOutput += "<input type='hidden' class='addToPlannerDateValue' value='" + new Date(utcDate) + "'>";
        buildTheHtmlOutput += "<input type='hidden' class='addToPlannerPlaceValue' value='" + dataMatchesValue.place.cityName + "'>";
        buildTheHtmlOutput += "<input type='hidden' class='addToPlannerUrlValue' value='" + dataMatchesValue.registrationUrlAdr + "'>";
        buildTheHtmlOutput += "<button type='submit' class='addToPlannerButton'>";
        buildTheHtmlOutput += "<img src='images/circle-add-to-planner.png' class='add-to-planner-icon'>";
        buildTheHtmlOutput += "</button>";
        buildTheHtmlOutput += "</form>";
        buildTheHtmlOutput += "</div>";
        buildTheHtmlOutput += "<div class='activity-description'>";

        var linkUrl = dataMatchesValue.activityUrlAdr;
        if (linkUrl === undefined) {
            buildTheHtmlOutput += '<h4><a target="_blank" href="www.active.com">' + dataMatchesValue.assetName + '</a></h4>';
        } else {
            buildTheHtmlOutput += '<h4><a target="_blank" href="' + dataMatchesValue.registrationUrlAdr + '" >' + dataMatchesValue.assetName + '</a></h4>';
        }

        var showDistance = dataMatchesValue.assetAttributes[0];
        if (showDistance === undefined) {
            buildTheHtmlOutput += "";
        } else {
            buildTheHtmlOutput += '<p class="event">' + dataMatchesValue.assetAttributes[0].attribute.attributeValue + '</p>';
        }

        buildTheHtmlOutput += '<p class="city">' + dataMatchesValue.place.cityName + '</p>';

        buildTheHtmlOutput += '<p class="date">' + new Date(utcDate) + '</p>';

        var showDescription = dataMatchesValue.assetDescriptions[0];
        if (showDescription === undefined) {
            buildTheHtmlOutput += "";
        } else {
            buildTheHtmlOutput += "<div class='auto-populated-description'>" + dataMatchesValue.assetDescriptions[0].description + "</div>";
        }

        buildTheHtmlOutput += '</div>';
        buildTheHtmlOutput += '</li>';
    });

    $(".display-results").html(buildTheHtmlOutput);
}


//Step 3
//on click, move results to 'my planner' container

function populatePlannerContainer() {
    $.ajax({
            type: "GET",
            url: "/populate-planner/",
            dataType: 'json',
        })
        .done(function (dataOutput) {
            console.log(dataOutput);

            var buildTheHtmlOutput = "";

            $.each(dataOutput, function (dataOutputKey, dataOutputValue) {
                buildTheHtmlOutput += "<li class='planner'>";
                buildTheHtmlOutput += "<div class='deleteFromPlanner'>";
                buildTheHtmlOutput += "<form class='deleteFromPlannerValue'>";
                buildTheHtmlOutput += "<input type='hidden' class='deleteFromPlannerValueInput' value='" + dataOutputValue._id + "'>";
                buildTheHtmlOutput += "<button type='submit' class='deleteFromPlannerButton'>";
                buildTheHtmlOutput += "<img src='/images/circle-delete-from-planner.png' class='delete-from-planner-icon'>";
                buildTheHtmlOutput += "</button>";
                buildTheHtmlOutput += "</form>";
                buildTheHtmlOutput += "</div>";
                buildTheHtmlOutput += '<h4><a target="_blank" href="' + dataOutputValue.url + '" >' + dataOutputValue.name + '</a></h4>';
                var showCity = dataOutputValue.place;
                if ((showCity === undefined) || (showCity == "undefined")) {
                    buildTheHtmlOutput += "";
                } else {
                    buildTheHtmlOutput += '<p>' + showCity + '<p>'
                }
                buildTheHtmlOutput += '<p>' + dataOutputValue.date + '</p>'
                buildTheHtmlOutput += "</li>"

                console.log(dataOutput);
            });
            $(".planner-results").html(buildTheHtmlOutput);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

$(function () {
    populatePlannerContainer();

});

//add activity to planner section

$(document).on('click', '.display-results .addToPlannerButton', function (event) {

    event.preventDefault();

    $(this).toggleClass("highlight");

    var plannerValue = $(this).parent().find('.addToPlannerValue').val();
    var plannerDateValue = $(this).parent().find('.addToPlannerDateValue').val();
    var plannerPlaceValue = $(this).parent().find('.addToPlannerPlaceValue').val();
    var plannerUrlValue = $(this).parent().find('.addToPlannerUrlValue').val();

    var nameObject = {
        'name': plannerValue,
        'date': plannerDateValue,
        'place': plannerPlaceValue,
        'url': plannerUrlValue
    };

    $.ajax({
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(nameObject),
            url: '/add-to-planner/',
        })
        .done(function (result) {

            populatePlannerContainer();
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
});

$(document).on('submit', '.deleteFromPlannerValue', function (event) {

    event.preventDefault();

    var plannerIdToDelete = $(this).parent().find('.deleteFromPlannerValueInput').val();



    $.ajax({
            method: 'DELETE',
            dataType: 'json',
            contentType: 'application/json',
            url: '/delete-planner/' + plannerIdToDelete
        })
        .done(function (result) {
            populatePlannerContainer();
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
});
