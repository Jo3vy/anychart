if(!_.bullet){_.bullet=1;(function($){var F5=function(a,b){return $.cj($.vj,a,b||"bar")},G5=function(){$.X.call(this);this.hb("defaultRangeMarkerSettings");this.ss=null;$.T(this.za,[["type",4,9],["value",4,9],["layout",4,9],["fill",16,1],["stroke",16,1]])},H5=function(a,b){$.n(b)&&(b=F5(b,a.lh("type")),a.lh("type")!=b&&(a.pa.type=b,$.n(a.ye("type"))||a.u(4,9)))},sha=function(a,b){if("horizontal"==a)switch(b){default:case "bar":return function(a,b){var c=this.scale().transform(0);c=(0,window.isNaN)(c)?0:$.Ya(c,0,1);var d=this.ka(),h=this.Ql(),
k=$.$m(h)?$.M(h,d.height):d.height*h;h=d.left+c*d.width;var l=d.top+k/2;c=(b-c)*d.width;d=d.height-k;a.clear().moveTo(h,l).lineTo(h+c,l).lineTo(h+c,l+d).lineTo(h,l+d).close()};case "line":return function(a,b){var c=this.ka(),d=this.Ql(),h=Math.round(c.left+c.width*b),k=Math.round(c.top+c.height/2);c=c.height-($.$m(d)?$.M(d,c.height):c.height*d);a.clear().moveTo(h-1,k-c/2).lineTo(h-1,k+c/2).lineTo(h+1,k+c/2).lineTo(h+1,k-c/2).close()};case "ellipse":return function(a,b){var c=this.ka(),d=this.Ql(),
h=c.left+c.width*b,k=c.top+c.height/2;c=(c.height-($.$m(d)?$.M(d,c.height):c.height*d))/2;d=c/4;a.clear();a.Xd(h,k,d,c,0,360).close()};case "x":return function(a,b){var c=this.ka(),d=this.Ql(),h=Math.round(c.left+c.width*b),k=Math.round(c.top+c.height/2);c=(c.height-($.$m(d)?$.M(d,c.height):c.height*d))/2;d=c/1.5;a.clear().moveTo(h-d-1,k-c).lineTo(h+d-1,k+c).lineTo(h+d+1,k+c).lineTo(h-d+1,k-c).moveTo(h+d-1,k-c).lineTo(h-d-1,k+c).lineTo(h-d+1,k+c).lineTo(h+d+1,k-c).close()}}else switch(b){default:case "bar":return function(a,
b){var c=this.scale().transform(0);c=(0,window.isNaN)(c)?0:$.Ya(c,0,1);var d=this.ka(),h=this.Ql(),k=$.$m(h)?$.M(h,d.width):d.width*h;h=d.left+k/2;var l=d.Na()-d.height*b;k=d.width-k;c=(b-c)*d.height;a.clear().moveTo(h-.25,l-.5).lineTo(h+k+.25,l-.5).lineTo(h+k+.25,l+c-.5).lineTo(h-.25,l+c-.5).close()};case "line":return function(a,b){var c=this.ka(),d=this.Ql(),h=Math.round(c.left+c.width/2),k=Math.round(c.Na()-c.height*b);c=c.width-($.$m(d)?$.M(d,c.width):c.width*d);a.clear().moveTo(h-c/2,k-1).lineTo(h+
c/2,k-1).lineTo(h+c/2,k+1).lineTo(h-c/2,k+1).close()};case "ellipse":return function(a,b){var c=this.ka(),d=this.Ql(),h=Math.round(c.left+c.width/2),k=Math.round(c.Na()-c.height*b);c=(c.width-($.$m(d)?$.M(d,c.width):c.width*d))/2;d=c/4;a.clear();a.Xd(h,k,c,d,0,360).close()};case "x":return function(a,b){var c=this.ka(),d=this.Ql(),h=Math.round(c.left+c.width/2),k=Math.round(c.Na()-c.height*b);c=(c.width-($.$m(d)?$.M(d,c.width):c.width*d))/2;d=c/1.5;a.clear().moveTo(h-c-1,k-d).lineTo(h+c-1,k+d).lineTo(h+
c+1,k+d).lineTo(h-c+1,k-d).moveTo(h+c-1,k-d).lineTo(h-c-1,k+d).lineTo(h-c+1,k+d).lineTo(h+c+1,k-d).close()}}},I5=function(a,b){$.fv.call(this);this.hb("bullet");this.qd=[];this.nd=[];this.Pv=!0;this.data(a||null,b);$.No(this.za,"layout",114820,9)},uha=function(a){(0,$.le)(a.nd,function(a){$.Zc(a)});a.nd.length=0;var b=a.wa.aa().reset();for(b.Ob();b.advance();)tha(a,b)},tha=function(a,b){var c=b.ja(),d=new G5;d.hb("bullet.defaultMarkerSettings");$.V(d);a.nd[c]=d;$.L(a,d);d.scale(a.scale());d.O(a.Va);
H5(d,a.ef().fc(c));d.value(b.get("value"));d.type(b.get("type"));d.Ql(b.get("gap"));d.fill(b.get("fill"));d.stroke(b.get("stroke"));d.ba(!1);$.U(d,a.I4,a)},J5=function(a,b){var c=new I5(a,b);c.fa(!0,$.Qk("bullet"));return c};$.H(G5,$.X);var K5={};$.Mo(K5,[[0,"type",F5],[0,"value",$.O],[0,"layout",$.qj],[1,"fill",$.ip],[1,"stroke",$.hp]]);$.Zo(G5,K5);var vha={x:"30%",line:"30%",ellipse:"30%",bar:"50%"};$.g=G5.prototype;$.g.ua=$.X.prototype.ua;$.g.oa=$.X.prototype.oa|20;
$.g.Ql=function(a){return $.n(a)?(this.ss!=a&&(this.ss=a,this.u(4,9)),this):null===this.ss?vha[this.i("type")]:this.ss};$.g.Ab=function(){return"horizontal"==this.i("layout")};$.g.scale=function(a){if($.n(a)){if(a=$.yr(this.ma,a,null,3,null,this.Kca,this)){var b=this.ma==a;this.ma=a;a.ba(b);b||this.u(4,9)}return this}return this.ma};$.g.Kca=function(a){var b=0;$.W(a,4)&&(b|=4);$.W(a,2)&&(b|=1);this.u(4,b|8)};
$.g.W=function(){if(!this.scale())return $.Pj(2),this;if(!this.Bc())return this;var a=this.O()?this.O().Da():null,b=a&&!a.Ne();b&&a.suspend();this.g||(this.g=$.Vi(),$.L(this,this.g));if(this.J(8)){var c=this.zIndex();this.g.zIndex(c);this.I(8)}this.J(2)&&(c=this.O(),this.g.parent(c),this.I(2));this.J(16)&&(this.g.stroke(this.i("stroke")),this.g.fill(this.i("fill")),this.I(16));this.J(4)&&(c=this.i("value"),c=this.scale().transform(c,0),this.g.clear(),(0,window.isNaN)(c)||(c=$.Ya(c,0,1),sha(this.i("layout"),
this.i("type")).call(this,this.g,c)),this.I(4));b&&a.resume();return this};$.g.remove=function(){this.g&&this.g.parent(null)};$.H(I5,$.fv);I5.prototype.oa=$.fv.prototype.oa|126976;I5.prototype.La=function(){return"bullet"};I5.prototype.data=function(a,b){return $.n(a)?(this.Hg!==a&&(this.Hg=a,$.K(a,$.Wp)?this.wa=a.Ll():$.K(a,$.fq)?this.wa=a.we():(a=$.A(a)||$.z(a)?a:null,this.wa=(new $.fq(a,b)).we()),$.U(this.wa,this.Ke,this),this.u(127232,1)),this):this.wa};I5.prototype.Ke=function(a){$.W(a,16)&&this.u(127232,1)};var L5={};$.R(L5,0,"layout",$.qj);$.Zo(I5,L5);$.g=I5.prototype;$.g.Ab=function(){return"horizontal"==this.i("layout")};
$.g.scale=function(a){this.ma||(this.ma=$.ur(),this.ma.bv(0),this.ma.Zu(0),this.ma.Ka().count(3,5));if($.n(a)){if(a=$.yr(this.ma,a,"linear",3))this.ma=a,a.ba(!1),this.u(122880,1);return this}return this.ma};$.g.axis=function(a){this.ad||(this.ad=new $.hw,this.ad.lb(this),$.L(this,this.ad),$.U(this.ad,this.J4,this),this.u(114692,9));return $.n(a)?(this.ad.N(a),this):this.ad};$.g.J4=function(a){var b=0,c=0;$.W(a,1)&&(b|=16384,c|=1);$.W(a,8)&&(b|=4);this.u(b,c)};
$.g.ce=function(a,b){var c=$.O(a);if((0,window.isNaN)(c)){c=0;var d=a}else c=a,d=b;var e=this.qd[c];e||(e=new $.xx,e.hb("bullet.defaultRangeMarkerSettings"),this.qd[c]=e,$.L(this,e),$.U(e,this.Hca,this),this.u(32768,1));return $.n(d)?(e.N(d),this):e};$.g.Hca=function(){this.u(32768,1)};$.g.UK=function(a){this.b||(this.b=new $.Yq,$.U(this.b,this.Gca,this),$.L(this,this.b),$.Pp(this,"rangePalette",this.b),this.b.xr(!1));return $.n(a)?(this.b.N(a),this):this.b};
$.g.Gca=function(a){$.W(a,2)&&this.u(32768,1)};$.g.ef=function(a){this.Qe||(this.Qe=new $.$q,$.U(this.Qe,this.Fca,this),$.L(this,this.Qe),$.Pp(this,"markerPalette",this.Qe));return $.n(a)?(this.Qe.N(a),this):this.Qe};$.g.Fca=function(a){$.W(a,2)&&this.u(65536,1)};
$.g.kb=function(){var a,b=this.scale();b.pg()&&b.Mg();var c=0;for(a=this.nd.length;c<a;c++){var d=this.nd[c];null!=d&&(d.scale(b),"bar"==d.i("type")&&b.Vc(0),b.Vc(d.i("value")))}c=0;for(a=this.qd.length;c<a;c++)d=this.qd[c],null!=d&&(d.scale(b),b.Vc(d.i("from")),b.Vc(d.i("to"))),b.pg()&&b.Ug();this.axis().scale(this.scale())};$.g.kk=function(){var a=this.Ab(),b=this.title(),c=this.axis();a?($.iw(c,"bottom"),$.Qt(b,"left")):($.iw(c,"left"),$.Qt(b,"bottom"));return I5.B.kk.call(this)};
$.g.Mj=function(a){if(this.Bc()){this.J(4096)&&(uha(this),this.I(4096));this.J(8192)&&(this.kb(),this.I(8192));var b=this.axis();this.J(16388)&&($.V(b),!b.O()&&b.enabled()&&b.O(this.Va),b.ka(a),b.padding(0),b.ba(!1),b.W(),this.I(16384));var c=b.enabled()?b.jd():a;if(this.J(32772)){a=0;for(b=this.qd.length;a<b;a++){var d=this.qd[a];if(d){$.V(d);$.yx(d,this.Ab()?"vertical":"horizontal");var e=d,f=this.UK().fc(a);f=$.Lb(f);f!=e.lh("fill")&&($.ap(e.pa,$.sD,{fill:f}),e.u(16,1));d.ka(c);d.O(this.Va);d.Xm(0);
d.W();d.ba(!1)}}this.I(32768)}if(this.J(65540)){a=0;for(b=this.nd.length;a<b;a++)d=this.nd[a],$.V(d),d.ka(c),H5(d,this.ef().fc(a)),e=d,f=this.i("layout"),$.n(f)&&(f=$.qj(f,e.lh("layout")),e.lh("layout")!=f&&(e.pa.layout=f,$.n(e.ye("layout"))||e.u(4,9))),d.W(),d.ba(!1);this.I(65536)}}};$.g.I4=function(){this.u(65536,1)};
$.g.Wf=function(a){var b;"pointIndex"in a?b=a.pointIndex:"labelIndex"in a?b=a.labelIndex:"markerIndex"in a&&(b=a.markerIndex);b=$.O(b);a.pointIndex=b;var c=a.type;switch(c){case "mouseout":c="pointmouseout";break;case "mouseover":c="pointmouseover";break;case "mousemove":c="pointmousemove";break;case "mousedown":c="pointmousedown";break;case "mouseup":c="pointmouseup";break;case "click":c="pointclick";break;case "dblclick":c="pointdblclick";break;default:return null}var d=this.data().aa();d.select(b)||
d.reset();return{type:c,actualTarget:a.target,pie:this,iterator:d,sliceIndex:b,pointIndex:b,target:this,originalEvent:a}};$.g.Yh=function(){return this};$.g.Uh=function(){return this};$.g.Se=function(){return[this]};$.g.Xk=function(a){return $.n(a)?(a=$.dj(a),a!=this.Th&&(this.Th=a),this):this.Th};$.g.uk=function(){for(var a=this.wa?this.wa.aa().Ob():0,b=0,c=this.nd.length,d=0;d<c;d++){var e=this.nd[d];if(e&&!e.enabled())b++;else break}return!a||!c||b==c};
$.g.F=function(){var a=I5.B.F.call(this);a.type="bullet";$.lp(this,L5,a);a.data=this.data().F();a.rangePalette=this.UK().F();a.markerPalette=this.ef().F();a.scale=this.scale().F();a.axis=this.axis().F();for(var b=[],c=0;c<this.qd.length;c++)b.push(this.qd[c].F());a.ranges=b;return{chart:a}};
$.g.Y=function(a,b){I5.B.Y.call(this,a,b);this.data(a.data);$.bp(this,L5,a);this.UK().fa(!!b,a.rangePalette);this.ef().fa(!!b,a.markerPalette);var c=a.scale;if($.z(c))var d=$.sr(c,null);else $.D(c)?(d=$.sr(c.type,!1),d.N(c)):d=null;d&&this.scale(d);this.axis(a.axis);c=a.ranges;if($.A(c))for(d=0;d<c.length;d++)this.ce(d,c[d])};var M5=I5.prototype;M5.data=M5.data;M5.rangePalette=M5.UK;M5.markerPalette=M5.ef;M5.scale=M5.scale;M5.axis=M5.axis;M5.range=M5.ce;M5.isHorizontal=M5.Ab;M5.getType=M5.La;
M5.noData=M5.rn;$.no.bullet=J5;$.G("anychart.bullet",J5);}).call(this,$)}
