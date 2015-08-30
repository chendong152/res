/**
 * Created by Dong on 2015-08-28.
 */
function CustomOverlay(position, index) {
    this.index = index;
    this.position = position;
}
CustomOverlay.prototype = new qq.maps.Overlay();
//����construct,ʵ������ӿ�����ʼ���Զ����DomԪ��
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
    //��dom��ӵ��������
    var panes = this.getPanes();
    //����panes�Ĳ㼶��overlayMouseTarget�ɽ��յ���¼�
    panes.overlayMouseTarget.appendChild(div);

    var self = this;
    this.div.onclick = function () {
        alert(self.index);
    }
}
//ʵ��draw�ӿ������ƺ͸����Զ����domԪ��
CustomOverlay.prototype.draw = function () {
    var overlayProjection = this.getProjection();
    //���ظ����������������������
    var pixel = overlayProjection.fromLatLngToDivPixel(this.position);
    var divStyle = this.div.style;
    divStyle.left = pixel.x - 8 + "px";
    divStyle.top = pixel.y - 8 + "px";
}
//ʵ��destroy�ӿ���ɾ���Զ����DomԪ�أ��˷�������setMap(null)�󱻵���
CustomOverlay.prototype.destroy = function () {
    this.div.onclick = null;
    this.div.parentNode.removeChild(this.div);
    this.div = null
}


function getAddr(latLng, cb) {
    var geocoder = new qq.maps.Geocoder({complete: cb || function () {}});
    //��ָ����γ�Ƚ��н���
    geocoder.getAddress(latLng);
    //����������ʧ�ܣ����������º���
    geocoder.setError(function () {
        alert("�����ˣ���������ȷ�ľ�γ�ȣ�����");
    });
}