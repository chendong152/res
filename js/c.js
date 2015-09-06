/**
 * Created by Dong on 2015-08-31.
 */

function Controller() {
    this.res = [], this.resClone = [], this.fn = function (s1, s2) {
        return s1.distance - s2.distance;
    };
    this.init();
}

Controller.prototype.showRes = function (ls) {
    this.res = ls = (ls || this.res).sort(this.fn);
    var li = this.resTmpl = this.resTmpl || $('.rets .list>li:first').prop('outerHTML'), p = $('.rets .list').empty(),
        frag = document.createDocumentFragment();
    for (var i = 0; i < ls.length || 0; i++) {
        ls[i].spend = parseFloat(ls[i].spend).toFixed(0);
        ls[i].distance = parseFloat(ls[i].distance).toFixed(2);
        $(replace(li, ls[i])).appendTo($(frag));
    }
    p[0].appendChild(frag);
    return this;
}
Controller.prototype.getRes = function (p, kw) {
    var self = this, isLoc = p instanceof (qq.maps.LatLng), myPos = window.myLoc || {},
        url = kw
            ? 'http://114.215.174.204:8080/xunwei/main?InterfaceId=ShopAction&MethodId=queryByTitleLike'
            : (isLoc
            ? 'http://114.215.174.204:8080/xunwei/main?InterfaceId=ShopAction&MethodId=queryByLatLon'
            : 'http://114.215.174.204:8080/xunwei/main?InterfaceId=ShopAction&MethodId=queryByCityIdAndPosition'),
        d = kw
            ? {TitleLike: kw, CityId: p, Lat: myPos.lat, Lon: myPos.lng}
            : isLoc ? {Lat: p.lat, Lon: p.lng, Distance: 3} : {CityId: p};
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
    var fn = t == 'dis' ? this.fn : function (s1, s2) {
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
        url = 'http://114.215.174.204:8080/xunwei/main?InterfaceId=WeixinNewsAction';
    this.newsLoading = true , $.getJSON(url, {
        MethodId: kw ? 'queryNewsByTitleLike' : 'queryAllNews', offset: start, limit: size, TitleLike: kw
    }, function (data) {
        var li = self.newsTmpl = self.newsTmpl || $(".news .list>li:first").prop('outerHTML'), p = $(".news .list");
        self.complete = true;
        if (reload) p.empty();
        if (!data) return;
        for (var i = 0; i < data.items.length; i++)
            data.items[i].creatDate = data.items[i].creatDate.substr(0, 10), $(replace(li, data.items[i])).appendTo(p);
        if (data.total > self.start + size) {
            self.start += size, self.complete = false;
        }
        self.newsLoading = false;
    });
    return this;
};
Controller.prototype.searchNews = function (key) {
    return this.loadNews(true, key);
};
Controller.prototype.loadCity = function () {
    var self = this, p = $("header .citys"), tmpl = self.ctTmpl = self.ctTmpl || p.find(">.ct:first").prop('outerHTML'),
        url = "http://114.215.174.204:8080/xunwei/main?InterfaceId=AreaAction&MethodId=queryAllCity";
    $.getJSON(url, function (r) {
        p.empty(), (self.cities = r).forEach(function (d, i) {
            p.append($(replace(tmpl, d)))
        });//, $('header .city').data('id', r[0].id).text('[' + r[0].name.replace(/.$/, '') + ']');
        self.toMyCity();
    });
    return this;
};
Controller.prototype.toMyCity = function (ct) {
    if (!this.cities || !me.city)return this;
    this.cities.forEach(function (c) {
        if (c.name.match(new RegExp(ct || me.city.name, 'ig')))
            $('header .city').data('id', myCityId = c.areaId).text('[' + c.name.replace(/.$/, '') + ']')
    })
    return this;
};
Controller.prototype.init = function () {
    var self = this;
    window.locChange = function (p) {
        self.getRes(p);
    };
    window.cityChange = function (city) {
        console.log(city)
        self.getRes(city);
    };
    $(function () {
        $(".news .list").scroll(function () {
            if (this.scrollHeight - $(this).height() - this.scrollTop < 100)
                self.loadNews();
        });
        self.loadCity().loadNews(true);
    });
    return self;
}