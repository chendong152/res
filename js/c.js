/**
 * Created by Dong on 2015-08-31.
 */

function Controller() {
    this.res = [], this.resClone = [], this.fn = function () {};
    this.init();
}

Controller.prototype.showRes = function (ls) {
    this.res = ls = (ls || this.res).sort(this.fn);
    var li = this.resTmpl = this.resTmpl || $('.rets .list>li:first').prop('outerHTML'), p = $('.rets .list').empty(),
        frag = document.createDocumentFragment();
    for (var i = 0; i < ls.length || 0; i++) {
        $(replace(li, ls[i])).appendTo($(frag));
    }
    p[0].appendChild(frag);
    return this;
}
Controller.prototype.getRes = function (p) {
    var self = this,
        url = 'http://114.215.174.204:8080/xunwei/main?InterfaceId=ShopAction&MethodId=queryByLatLon&Lat=' + p.lat + '&Lon=' + p.lng + '&Distance=0.5';
    url = 'a.php?m=b';
    $.getJSON(url, function (d) {self.resClone = d, self.showRes(d)});
    return this;
};
Controller.prototype.search = function (key) {
    return this.showRes(!key ? this.resClone : this.resClone.filter(function (res) {return new RegExp(key, 'ig').test(res.title) || new RegExp(key, 'ig').test(res.address)}));
};
Controller.prototype.sort = function (t, desc) {
    var fn = t == 'dis' ? function (s1, s2) {return s1.distance - s2.distance;} : function (s1, s2) {return s1.price - s2.price;};
    if (desc) {
        var _fn = fn;
        fn = function (s1, s2) {return -_fn(s1, s2);}
    }
    this.fn = fn;
    return this.showRes();
}
Controller.prototype.loadNews = function (reload) {
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
    return this;
};
Controller.prototype.searchNews = function (key) {alert('news search')
    return this;
};
Controller.prototype.loadCity = function () {
    var cts = [], p = $("header .citys"), tmpl = self.ctTmpl = self.ctTmpl || p.find(">.ct:first").prop('outerHTML'),
        url = "a.php?m=c";
    $.getJSON(url, function (r) {
        p.empty(), r.forEach(function (d, i) {p.append($(replace(tmpl, d)))}), $('header .city').text('[' + r[0].name.replace(/.$/, '') + ']');
    });
    return this;
};
Controller.prototype.init = function () {
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
        self.loadNews(true).loadCity();
    });
    return self;
}