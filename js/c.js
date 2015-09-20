/**
 * Created by Dong on 2015-08-31.
 */

function Controller() {
    this.res = [], this.resClone = [], this._defFn = this.fn = function (s1, s2) {
        return s1.distance - s2.distance;
    };
    this.init();
}

Controller.prototype.showRes = function (ls) {
    this.res = ls = (ls || this.res).sort(this.fn);
    var li = this.resTmpl = this.resTmpl || $('.rets .list>script.tmpl').html(), p = $('.rets .list').empty(),
        frag = document.createDocumentFragment();
    for (var i = 0; i < ls.length || 0; i++) {
        ls[i].spend = parseFloat(ls[i].spend).toFixed(0);
        ls[i].distance = parseFloat(ls[i].distance).toFixed(ls[i].distance > 10 ? 0 : 2);
        $(replace(li, ls[i])).appendTo($(frag));
    }
    p[0].appendChild(frag);
    var m = document.cookie.match(/resTop=\d+/ig);
    m && $('.rets .list').scrollTop(m[0].match(/\d+/));
    return this;
}
Controller.prototype.getRes = function (p, kw) {
    var self = this, p = myLocMark.position, isLoc = p instanceof (qq.maps.LatLng), myPos = window.myLoc || {},
        url = kw
            ? 'http://114.215.174.204:8080/xunwei/main?InterfaceId=ShopAction&MethodId=queryByTitleLike'
            : 'http://114.215.174.204:8080/xunwei/main?InterfaceId=ShopAction&MethodId=queryByLatLon',
        c = self.getCityByName(me.curCity.name),
        d = $.extend({Lat: p.lat, Lon: p.lng}, kw ? {TitleLike: kw, CityId: c && c.areaId} : {Distance: 5});
    $.getJSON(url, d, function (d) {
        d = d || [], self.resClone = d, self.showRes(d);
    });
    return this;
};
Controller.prototype.search = function (key) {
    /*return this.showRes(!key ? this.resClone : this.resClone.filter(function (res) {
     return new RegExp(key, 'ig').test(res.title) || new RegExp(key, 'ig').test(res.address)
     }));*/
    return this.getRes(key || !window.myLocMark ? myCityId : myLocMark.position, key);
};
Controller.prototype.sort = function (t, desc) {
    var fn = t == 'dis' ? this._defFn : function (s1, s2) {
        return s1.spend - s2.spend;
    };
    if (desc) {
        var _fn = fn;
        fn = function (s1, s2) {
            return -_fn(s1, s2);
        }
    }
    return this.fn = fn , this.showRes();
}
Controller.prototype.loadNews = function (reload, kw) {
    if (this.newsLoading || (this.complete && !reload)) return this;
    var size = 20, start = this.start = reload ? 0 : ( this.start || 0), self = this,
        url = 'http://114.215.174.204:8080/xunwei/main?InterfaceId=AutoArticleAction';
    this.newsLoading = true , $.getJSON(url, {
        MethodId: kw ? 'queryNewsByTitleLike' : 'queryAllNews', offset: start, limit: size, TitleLike: kw
    }, function (data) {
        var li = self.newsTmpl = self.newsTmpl || $(".news .list>script.tmpl").html(), p = $(".news .list");
        self.complete = true;
        if (reload) p.empty();
        if (!data) return;
        for (var i = 0; i < data.items.length; i++)
            data.items[i].creatDate = data.items[i].creatDate.substr(0, 10), $(replace(li, data.items[i])).appendTo(p);
        if (data.total > self.start + size) {
            self.start += size, self.complete = false;
        }
        var m = document.cookie.match(/newsTop=\d+/ig);
        self.newsLoading = false, m && $('.news .list').scrollTop(m[0].match(/\d+/));
    });
    return this.newsKw = kw, this;
};
Controller.prototype.searchNews = function (key) {
    return this.loadNews(true, key);
};
Controller.prototype.loadCity = function () {
    var self = this, p = $("header .citys"), tmpl = self.ctTmpl = self.ctTmpl || p.find(">.ct:first").prop('outerHTML'),
        url = "http://114.215.174.204:8080/xunwei/main?InterfaceId=AreaAction&MethodId=queryAllCity";
    $.getJSON(url, function (r) {
        p.empty(), items = (self.cities = r).slice(0), items.push({
            areaId: 0,
            name: '即将上线<br/>更多城市市'
        }), items.forEach(function (d, i) {
            d = $.extend({}, d), d.name = d.name.replace('市', ''), p.append($(replace(tmpl, d)))
        });//, $('header .city').data('id', r[0].id).text('[' + r[0].name.replace(/.$/, '') + ']');
        self.toMyCity();
    });
    return this;
};
Controller.prototype.toMyCity = function (ct) {
    if (!this.cities || !me.city)return this;
    this.cities.forEach(function (c, i) {
        if (c.name.match(new RegExp(ct || me.city.name, 'ig')))
            $('header .city').data('id', myCityId = c.areaId).text('[' + c.name.replace(/.$/, '') + ']'), $(".citys .ct:eq(" + i + ")").addClass("active")
    })
    return this;
};
Controller.prototype.init = function () {
    var self = this;
    window.locChange = function (p) {
        self.getRes(p);
    };
    window.cityChange = function (city) {
        //self.getRes(city);
        setTimeout(function cg() {
            if (!self.cities) return setTimeout(cg, 200);
            var p = me.curCity = self.getCity(city), loc = myCurLoc = me.isInMyCity() && window.myLoc ? myLoc : p.latLng;
            showPosition(loc), changeState('');
        }, 200);
    };
    $(function () {
        qq.maps.event.addListener(map, 'click', function (e) {
            showPosition(e.latLng);
        });
        getLocation();
        var cs = new qq.maps.CityService();
        cs.setComplete(function (r) {
            me.curCity = me.city = $.extend(me.city, r.detail), me.isInMyCity = function () {
                return !!me.curCity && me.city.name == me.curCity.name;
            };
            !window.myLoc && showPosition(myCurLoc = me.city.latLng), sdk.toMyCity(me.city.name);
        });
        cs.searchLocalCity();
        $(".news .list").scroll(function () {
            if (this.scrollHeight - $(this).height() - this.scrollTop < 100)
                self.loadNews(false, self.newsKw);
        });
        self.loadCity().loadNews(true);
    });
    return self;
};
Controller.prototype.getCity = function (cId) {
    if (!this.cities) return null;
    var p = null;
    for (var i = 0; i < this.cities.length; i++) if (this.cities[i].areaId == cId) p = this.cities[i];
    return $.extend(p, {latLng: new qq.maps.LatLng(p.lat, p.lon)});
};
Controller.prototype.getCityByName = function (cName) {
    if (!this.cities) return null;
    var p = null;
    for (var i = 0; i < this.cities.length; i++) if (cName.indexOf(this.cities[i].name) > -1) p = this.cities[i];
    return $.extend(p, {latLng: new qq.maps.LatLng(p.lat, p.lon)});
};
//myLoc = new qq.maps.LatLng(39.91545763858768, 116.40220642089844);
