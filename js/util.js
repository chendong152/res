/**
 * Created by Dong on 2015-08-01.
 */
function getParam(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function replace(str, obj) {
    for (var key in obj)
        str = str.replace(new RegExp('\{' + key + '\}', 'ig'), obj[key]);
    return str;
}

