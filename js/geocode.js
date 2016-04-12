/**
 * Geocoding of pickup and drop off locations
 * reference: https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
 * 
 */

// callback function for google maps javascript api
function initMap() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
        zoom: 8,
        center: latlng
    }
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
}

// called when encode is clicked
function codeAddress() {
    var pickup = $('#pickup').val();
    geocoder.geocode( { 'address': pickup}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            /*
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
            });
            */
            startLat = results[0].geometry.location.lat();
            startLong = results[0].geometry.location.lng();
            //console.log(results[0].geometry.location.lat());
        }
        else {
            alert("Geocode for pickup was not successful for the following reason: " + status);
        }
    });

    var dropoff = $('#dropoff').val();
    geocoder.geocode( { 'address': dropoff}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            destLat = results[0].geometry.location.lat();
            destLong = results[0].geometry.location.lng();
            //console.log(results[0].geometry.location.lng());
        }
        else {
            alert("Geocode for dropoff was not successful for the following reason: " + status);
        }
    });

    /* ----Use input focusout instead of timer
     *  Removes the tbody and buttons before making ajax calls to uber and lyft
     */
    setTimeout(function(){
        //alert(t1 + "-" + t2);
        $( "tbody" ).empty();
        $( ".btn-lyft" ).remove();
        $( ".btn-uber" ).remove();
        // Getting uber and lyft taxi data
        getUberPrice(startLat, startLong, destLat, destLong, uberServerToken);
        getLyftPrice(startLat, startLong, destLat, destLong, lyftBearerToken);
    }, 400);
    
}