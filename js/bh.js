/**
 * Created by Dong on 2015-08-28.
 */
function CustomOverlay(position, index) {
    this.index = index;
    this.position = position;
}
CustomOverlay.prototype = new qq.maps.Overlay();
//定义construct,实现这个接口来初始化自定义的Dom元素
CustomOverlay.prototype.construct = function () {
    var div = this.div = document.createElement("div");
    var divStyle = this.div.style;
    divStyle.position = "absolute";
    divStyle.width = "1.2em";
    divStyle.height = "1.2em";
    divStyle.backgroundColor = "#FFFFFF";
    divStyle.border = "1px solid #000000";
    divStyle.textAlign = "center";
    divStyle.lineHeight = "1.2em";
    divStyle.borderRadius = "1em";
    divStyle.cursor = "pointer";
    this.div.innerHTML = this.index;
    //将dom添加到覆盖物层
    var panes = this.getPanes();
    //设置panes的层级，overlayMouseTarget可接收点击事件
    panes.overlayMouseTarget.appendChild(div);

    var self = this;
    this.div.onclick = function () {
        alert(self.index);
    }
}
//实现draw接口来绘制和更新自定义的dom元素
CustomOverlay.prototype.draw = function () {
    var overlayProjection = this.getProjection();
    //返回覆盖物容器的相对像素坐标
    var pixel = overlayProjection.fromLatLngToDivPixel(this.position);
    var divStyle = this.div.style;
    divStyle.left = pixel.x - 8 + "px";
    divStyle.top = pixel.y - 8 + "px";
}
//实现destroy接口来删除自定义的Dom元素，此方法会在setMap(null)后被调用
CustomOverlay.prototype.destroy = function () {
    this.div.onclick = null;
    this.div.parentNode.removeChild(this.div);
    this.div = null
}


function getAddr(latLng, cb) {
    var geocoder = new qq.maps.Geocoder({complete: cb || function () {}});
    //对指定经纬度进行解析
    geocoder.getAddress(latLng);
    //若服务请求失败，则运行以下函数
    geocoder.setError(function () {
        alert("出错了，请输入正确的经纬度！！！");
    });
}