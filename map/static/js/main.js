var map;
var directionsService;

var markerArr = [];
var directions = [];
var jsonArray = [];
var json = [];
var res = [];

function initMap() {
    directionsService = new google.maps.DirectionsService();
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 55.78087891775124,

            lng: 37.7325491846689
        },
        zoom: 13,

    });
    university = new google.maps.LatLng(55.78087891775124, 37.73253845583292);

    google.maps.event.addListener(map, 'click', function(e) {
        placeMarker(e.latLng);
    });
}


function placeMarker(position) {
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        draggable: true
    });
    google.maps.event.addListener(marker, 'dragend', function(marker) {
        calculateAndDisplayRoute();
    });
    marker.addListener("click", () => {
        for (let i = 0; i < markerArr.length; i++) {
            if (markerArr[i] == marker) {
                markerArr[i].setMap(null);
                markerArr = markerArr.filter(elem => elem.map != null);
            }
        }
        calculateAndDisplayRoute();
    });
    markerArr.push(marker);
    calculateAndDisplayRoute();
}

function calculateAndDisplayRoute() {
    for (var i = 0; i < directions.length; i++) {
        directions[i].setMap(null);
    }
    directions = [];
    res = [];
    for (let i = 0; i < markerArr.length - 1; i++) {
        directionsService.route({
                origin: new google.maps.LatLng(markerArr[i].position.lat(), markerArr[i].position.lng()),
                destination: new google.maps.LatLng(markerArr[i + 1].position.lat(), markerArr[i + 1].position.lng()),
                travelMode: google.maps.TravelMode.WALKING
            },
            (result, status) => {
                if (status === "OK") {

                    var dirRenderer = new google.maps.DirectionsRenderer({
                        map: map,
                        suppressMarkers: true,
                        suppressInfoWindows: true
                    });

                    dirRenderer.setDirections(result);
                    directions.push(dirRenderer);

                    var pointsArray = [];
                    for (var p of result.routes) {
                        pointsArray = p.overview_path;
                        for (var point of pointsArray) {
                            var point_cords = {
                                "lat": point.lat(),
                                "lng": point.lng()
                            }
                            res.push(point_cords);
                        }
                    }

                }
            }
        );
    }
}
window.onload = function() {
    document.getElementById("submit-button").onclick = function() {
        jsonArray = JSON.stringify(res)
        json = [jsonArray];
        var blob1 = new Blob(json, { type: "json;charset=utf-8" });

        //Check the Browser.
        var isIE = false || !!document.documentMode;
        if (isIE) {
            window.navigator.msSaveBlob(blob1, "Data.json");
        } else {
            var url = window.URL || window.webkitURL;
            link = url.createObjectURL(blob1);
            var a = document.createElement("a");
            a.download = "Data.json";
            a.href = link;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
};