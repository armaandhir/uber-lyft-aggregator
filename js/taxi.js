/**
 * Functions and ajax calls to get Uber and Lyft data are defined here
 * Methods are used in geocode.js file
 *     - getUberPrice(startLat, startLong, destLat, destLong, uberServerToken);
 *     - getLyftPrice(startLat, startLong, destLat, destLong, lyftBearerToken);
 */


/*
 * gets the estimates for a user based on pick and drop location
 * @param  {[type]} startLat  [description]
 * @param  {[type]} startLong [description]
 * @param  {[type]} destLat   [description]
 * @param  {[type]} destLong  [description]
 * @return {[type]}           [description]
 */
function getUberPrice(startLat, startLong, destLat, destLong, serverToken) {
    console.log("making call");
    $.ajax({
        url: "https://api.uber.com/v1/estimates/price",
        headers: {
            Authorization: "Token " + serverToken
        },
        data: {
            start_latitude: startLat,
            start_longitude: startLong,
            end_latitude: destLat,
            end_longitude: destLong
        },
        success: function(priceResult) {
            var pricesData = priceResult["prices"];
            if(typeof pricesData != typeof undefined){
                for (var i = 0; i < pricesData.length; i++) {
                    if (pricesData[i].display_name != "ASSIST" && pricesData[i].display_name != "uberWAV")
                    {
                        //console.log(pricesData[i].product_id);
                        // update the table and make ETA call
                        $('#uber-table').find('tbody').append('<tr"><td>' + pricesData[i].display_name + '</td><td id="'+ pricesData[i].product_id + '">-</td><td>' + pricesData[i].estimate + '</td></tr>');
                        getUberETA(startLat, startLong, pricesData[i].product_id ,serverToken);
                    }
                }
                var content = '<button class="btn btn-block btn-uber">Request UBER</button>';
                $(content).insertAfter('#uber-table');
                console.log(pricesData);
            }
        }
    });
}

//
function getUberETA(startLat, startLong, productId, serverToken) {
    console.log("making uber ETA call");
    $.ajax({
        url: "https://api.uber.com/v1/estimates/time",
        headers: {
            Authorization: "Token " + serverToken
        },
        data: {
            start_latitude: startLat,
            start_longitude: startLong,
            product_id: productId
        },
        success: function(timeResult) {
            var timesData = timeResult["times"];
            $('#' + timesData[0].product_id).text(timesData[0].estimate/60 + ' min');
            console.log(timesData[0]);
        }
    });
}

/* -------------------- LYFT -------------------- */

//
function getLyftETA(startLat, startLong, bearerToken) {
  console.log("making Lyft ETA call");
  $.ajax({
    url: "https://api.lyft.com/v1/eta",
    headers: {
        Authorization: "Bearer " + bearerToken
    },
    data: {
        lat: startLat,
        lng: startLong
        //ride_type: something
    },
    success: function(timeResult) {
        var timesData = timeResult["eta_estimates"];
        
        for (var i = 0; i < timesData.length; i++) {
            if (timesData[i].ride_type != "lyft_line")
            {
                //console.log(pricesData[i].ride_type);
                // update the table and make ETA call
                $('#' + timesData[i].ride_type).text(Math.round(timesData[i].eta_seconds/60) + ' min');
            }
        }
        //$('#' + timesData.ride_type).text(timesData.eta_seconds/60 + ' min');
        console.log(timesData);
    }
  });
}

//
function getLyftPrice(startLat, startLong, destLat, destLong, bearerToken) {
  console.log("making Lyft Price call");
  $.ajax({
    url: "https://api.lyft.com/v1/cost",
    headers: {
        Authorization: "Bearer " + bearerToken
    },
    data: {
        start_lat: startLat,
        start_lng: startLong,
        end_lat: destLat,
        end_lng: destLong
        //ride_type: optional
    },
    success: function(priceResult) {
        var pricesData = priceResult["cost_estimates"];
        if(typeof pricesData != typeof undefined){
            for (var i = 0; i < pricesData.length; i++) {
                if (pricesData[i].ride_type != "lyft_line")
                {
                    $('#lyft-table').find('tbody').append('<tr><td>' + pricesData[i].display_name + '</td><td id="'+ pricesData[i].ride_type + '">-</td><td>$' + Math.round(pricesData[i].estimated_cost_cents_min/100) + '-' + Math.round(pricesData[i].estimated_cost_cents_max/100) + '</td></tr>');
                }
            }
            getLyftETA(startLat, startLong, bearerToken);
            var content = '<button class="btn btn-block btn-lyft">Request Lyft</button>';
            $(content).insertAfter('#lyft-table');
            console.log(priceResult);
        }
    }
  });
}

//getUberPrice(startLat, startLong, destLat, destLong, uberServerToken);
//getLyftPrice(startLat, startLong, destLat, destLong, lyftBearerToken);