/**
 * Created by Dong on 2015-08-27.
 */
onerror = function (m) {alert(m)}
function Sdk() {
    this.res = [], this.resClone = [], this.fn = function () {};
    this.init();
}
Sdk.prototype.showRes = function (ls) {
    this.res = ls = (ls || this.res).sort(this.fn);
    var li = this.resTmpl = this.resTmpl || $('.rets .list>li:first').prop('outerHTML'), p = $('.rets .list').empty(),
        frag = document.createDocumentFragment();
    for (var i = 0; i < ls.length || 0; i++) {
        $(replace(li, ls[i])).appendTo($(frag));
    }
    p[0].appendChild(frag);
    return this;
}
Sdk.prototype.getRes = function (p) {
    var self = this,
        url = 'http://114.215.174.204:8080/xunwei/main?InterfaceId=ShopAction&MethodId=queryByLatLon&Lat=' + p.lat + '&Lon=' + p.lng + '&Distance=0.5';
    url = 'a.php?b=1';
    $.getJSON(url, function (d) {self.resClone = d, self.showRes(d)});
    return this;
};
Sdk.prototype.search = function (key) {
    console.debug('search', key)
    return this.showRes(!key ? this.resClone : this.resClone.filter(function (res) {return new RegExp(key, 'ig').test(res.title) || new RegExp(key, 'ig').test(res.address)}));
};
Sdk.prototype.sort = function (t, desc) {
    var fn = t == 'dis' ? function (s1, s2) {return s1.distance - s2.distance;} : function (s1, s2) {s1.price - s2.price;};
    if (desc) {
        var _fn = fn;
        fn = function (s1, s2) {return -_fn(s1, s2);}
    }
    this.fn = fn;
    return this.showRes();
}
Sdk.prototype.loadNews = function (reload) {
    if (this.complete) return;
    var size = 20, start = this.start = reload ? 0 : ( this.start || 0), self = this;
    var url = 'http://114.215.174.204:8080/xunwei/main?InterfaceId=WeixinNewsAction&MethodId=queryAllNews';
    url = 'a.php';
    $.getJSON(url, {
        offset: start, limit: size
    }, function (data) {
        var li = self.newsTmpl = self.newsTmpl || $(".news .list>li:first").prop('outerHTML'), p = $(".news .list");
        self.complete = true;
        if (reload) p.empty();
        for (var i = 0; i < data.items.length; i++)
            $(replace(li, data.items[i])).appendTo(p);
        if (data.total > self.start + size) {
            self.start += size;
            self.complete = false;
        }
    })
}
Sdk.prototype.init = function () {
    var self = this;
    window.locChange = function (p) {self.getRes(p);};
    window.cityChange = function (city) {
        self.getRes(city);
    };
    $(function () {
        $(".news .list").scroll(function () {
            if (this.scrollHeight - $(this).height() - this.scrollTop < 100)
                self.loadNews();
        })
        self.loadNews(true);
    });
    return self;
}

function fire(fn) {
    var ag = [];
    for (var i = 1; i < arguments.length; i++) ag.push(arguments[i]);
    window[fn] && window[fn].call(this, ag);
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
        showPosition(myLoc);
        return;
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude, lng = position.coords.longitude;
            qq.maps.convertor.translate(new qq.maps.LatLng(lat, lng), 1, function (res) {
                showPosition(myLoc = res[0]);
            });
        }, function (e) {
            console.log(e), location.host.match(/^192/ig) || alert('您取消了定位服务或您的浏览器不支持定位服务：' + e.message)
        });
    }
    else {alert("浏览器不支持定位.");}
}

function getAddress() {
    window.myLocMark && getAddr(myLocMark.getPosition(), function (r) {
        var d = r.detail, c = d.addressComponents, p = c.country + c.province + c.city;
        $(".my-addr").text(c.district + (c.streetNumber || c.town))
    });
}

var sdk = new Sdk();
$(function () {
    setTimeout(function () { $("#map-container>div:first>div:first").siblings().remove();}, 1000);
    qq.maps.event.addListener(map, 'click', function (e) {
        showPosition(e.latLng);
    });
})

