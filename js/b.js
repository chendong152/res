/**
 * Created by Dong on 2015-08-27.
 */
onerror = function (m) {
    alert(m)
}

function fire(fn) {
    var ag = [];
    for (var i = 1; i < arguments.length; i++) ag.push(arguments[i]);
    window[fn] && window[fn].apply(this, ag);
}

function showPosition(latlng) {
    window.myLocMark ? window.myLocMark.setPosition(latlng) : window.myLocMark = new qq.maps.Marker({
        map: map, position: latlng
    });
    map.panTo(latlng);

    if (window.prevLoc && prevLoc.lat == latlng.lat && prevLoc.lng == latlng.lng) return;
    prevLoc = latlng, fire('locChange', latlng), getAddress();
}

function getLocation() {
    if (window.myLoc) {
        return showPosition(myLoc);
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude, lng = position.coords.longitude;
            qq.maps.convertor.translate(new qq.maps.LatLng(lat, lng), 1, function (res) {
                showPosition(myLoc = res[0]), getAddr(myLoc, function (r) {
                    myAddr = r.detail;
                });
            });
        }, function (e) {
            console.log(e), location.host.match(/^192|localhost/ig) || alert('您取消了定位服务或您的浏览器不支持定位服务：' + e.message)
        });
    }
    else {
        alert("浏览器不支持定位.");
    }
}

function getAddress() {
    window.myLocMark && getAddr(myLocMark.getPosition(), function (r) {
        var d = r.detail, c = d.addressComponents, p = c.country + c.province + (c.province == c.city ? '' : c.city);
        // $(".my-addr").text(c.district + (c.streetNumber || c.town))
        $(".my-addr").text(d.address.replace(p, ''))
    });
}

var sdk = new Controller(), me = {};
$(function () {
    setTimeout(function () {
        $("#map-container>div:first>div:first").siblings().remove();
    }, 1000);
    qq.maps.event.addListener(map, 'click', function (e) {
        showPosition(e.latLng);
    });
    getLocation();
    var cs = new qq.maps.CityService();
    cs.setComplete(function (r) {console.log(r)
        me.city = r.detail;
        sdk.toMyCity(me.city.name) && fire('locChange',me.city.latLng);
    });
    cs.searchLocalCity();
})

