(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-agent-customer-customer"],{"0678":function(t,e,a){"use strict";a("a9e3"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=uni.getSystemInfoSync().platform,n={name:"UniLoadMore",props:{status:{type:String,default:"more"},showIcon:{type:Boolean,default:!0},iconType:{type:String,default:"auto"},iconSize:{type:Number,default:24},color:{type:String,default:"#777777"},contentText:{type:Object,default:function(){return{contentdown:"上拉显示更多",contentrefresh:"正在加载...",contentnomore:"没有更多数据了"}}}},data:function(){return{webviewHide:!1,platform:i}},computed:{iconSnowWidth:function(){return 2*(Math.floor(this.iconSize/24)||1)}},mounted:function(){},methods:{onClick:function(){this.$emit("clickLoadMore",{detail:{status:this.status}})}}};e.default=n},"0cb4":function(t,e,a){"use strict";a.r(e);var i=a("3031"),n=a("6767");for(var o in n)"default"!==o&&function(t){a.d(e,t,(function(){return n[t]}))}(o);a("0f9e");var r,s=a("f0c5"),c=Object(s["a"])(n["default"],i["b"],i["c"],!1,null,"8257e34e",null,!1,i["a"],r);e["default"]=c.exports},"0f9e":function(t,e,a){"use strict";var i=a("408e"),n=a.n(i);n.a},"1a54":function(t,e,a){"use strict";(function(t){var i=a("4ea4");a("99af"),a("a434"),a("e25e"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=i(a("0cb4")),o={components:{uniLoadMore:n.default},data:function(){return{userInfo:{},repaireList:[],p:1,pageSize:10,pageCount:"",status:"more",tabList:[{pagePath:"../index/index",iconPath:"../../../static/images/icon_index_bottom01.png",selectedIconPath:"../../../static/images/icon_index_bottom11.png",text:"首页",badge:""},{pagePath:"../customer/customer",iconPath:"../../../static/images/icon_index_bottom05.png",selectedIconPath:"../../../static/images/icon_index_bottom15.png",text:"代客下单",badge:""},{pagePath:"../user/user",iconPath:"../../../static/images/icon_index_bottom04.png",selectedIconPath:"../../../static/images/icon_index_bottom14.png",text:"我的",badge:""}],tabNum:3,currentTabIndex:1,keyTxt:"",title:["修理厂客户","协议客户"],currentTitle:1}},onLoad:function(t){var e=this;uni.getStorage({key:"userInfo",success:function(t){e.userInfo=t.data[0],1==e.userInfo.c_level&&1==e.userInfo.c_admin&&(e.tabList.splice(1,0,{pagePath:"../tobuy/tobuy",iconPath:"../../../static/images/icon_index_bottom06.png",selectedIconPath:"../../../static/images/icon_index_bottom16.png",text:"进货",badge:""}),e.tabNum=4,e.currentTabIndex=2),e.getNewRepair()}}),uni.setNavigationBarTitle({title:1==this.currentTitle?this.title[0]:this.title[1]})},methods:{getNewRepair:function(){var e=this;t.log("this_.currentTitle:"+e.currentTitle);var a=0;e.$http.httpTokenRequest({url:e.$api.GetUser+"?name="+e.keyTxt+"&tel=&ma001="+e.userInfo.c_ma001+"&m_id="+e.userInfo.c_m_id+"&state="+a+"&pageindex="+e.p+"&pagesize="+e.pageSize+"&c_type="+e.currentTitle,method:"GET",data:{}}).then((function(a){t.log(a),t.log(e.p),e.p>1?(e.repaireList=e.repaireList.concat(a.data.rows),t.log(e.repaireList.length)):e.repaireList=a.data.rows,0<=a.data.total<e.pageSize?e.status="noMore":e.status="more",e.papeTotal(a.data.total)}),(function(e){t.log(e)}))},papeTotal:function(t){var e=this;if(null==t||""==t)return 0;t%e.pageSize==0?e.pageCount=parseInt(t/e.pageSize):e.pageCount=parseInt(t/e.pageSize)+1},toRecomm:function(t){var e=this;e.$set(t,"enter","recomm"),uni.navigateTo({url:"../custpro/custpro?custInfo="+encodeURIComponent(JSON.stringify(t))})},toCusOrder:function(t){var e=this;e.$set(t,"enter","custorder"),uni.navigateTo({url:"../custpro/custpro?custInfo="+encodeURIComponent(JSON.stringify(t))+"&type="+e.currentTitle})},toSearch:function(){var t=this;t.p=1,t.getNewRepair()},onReachBottom:function(){this.p<this.pageCount?(this.p++,this.status="loading",this.getNewRepair()):this.status="noMore"},change:function(t){this.currentTitle=t.detail.value,uni.setNavigationBarTitle({title:1==t.detail.value?this.title[0]:this.title[1]}),this.$refs.popup.close(),this.getNewRepair()}},onNavigationBarButtonTap:function(){this.$refs.popup.open()}};e.default=o}).call(this,a("5a52")["default"])},"298a":function(t,e,a){"use strict";a.r(e);var i=a("1a54"),n=a.n(i);for(var o in i)"default"!==o&&function(t){a.d(e,t,(function(){return i[t]}))}(o);e["default"]=n.a},3031:function(t,e,a){"use strict";var i;a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return o})),a.d(e,"a",(function(){return i}));var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{staticClass:"uni-load-more",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.onClick.apply(void 0,arguments)}}},[!t.webviewHide&&("circle"===t.iconType||"auto"===t.iconType&&"android"===t.platform)&&"loading"===t.status&&t.showIcon?a("svg",{staticClass:"uni-load-more__img uni-load-more__img--android-H5",style:{width:t.iconSize+"px",height:t.iconSize+"px"},attrs:{width:"24",height:"24",viewBox:"25 25 50 50"}},[a("circle",{style:{color:t.color},attrs:{cx:"50",cy:"50",r:"20",fill:"none","stroke-width":3}})]):!t.webviewHide&&"loading"===t.status&&t.showIcon?a("v-uni-view",{staticClass:"uni-load-more__img uni-load-more__img--ios-H5",style:{width:t.iconSize+"px",height:t.iconSize+"px"}},[a("v-uni-image",{attrs:{src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzlBMzU3OTlEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzlBMzU3OUFEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDOUEzNTc5N0Q5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDOUEzNTc5OEQ5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt+ALSwAAA6CSURBVHja1FsLkFZV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",mode:"widthFix"}})],1):t._e(),a("v-uni-text",{staticClass:"uni-load-more__text",style:{color:t.color}},[t._v(t._s("more"===t.status?t.contentText.contentdown:"loading"===t.status?t.contentText.contentrefresh:t.contentText.contentnomore))])],1)},o=[]},"408e":function(t,e,a){var i=a("8a0a");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var n=a("4f06").default;n("6f9bc883",i,!0,{sourceMap:!1,shadowMode:!1})},"442c":function(t,e,a){var i=a("24fb");e=i(!1),e.push([t.i,".umar-r[data-v-408c8189]{margin-right:%?20?%}.am-btn[data-v-408c8189]{font-size:%?24?%}.list-item[data-v-408c8189]{border-bottom:1px solid #eee;padding:%?15?%}.umar-b[data-v-408c8189]{margin-bottom:%?8?%}.popup-box[data-v-408c8189]{background-color:#fff}.popup-box .list-item[data-v-408c8189]{padding:%?30?% %?15?%}",""]),t.exports=e},"654d":function(t,e,a){"use strict";a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return o})),a.d(e,"a",(function(){return i}));var i={uniLoadMore:a("0cb4").default,uniPopup:a("ef48").default,tabBar:a("7ac1").default},n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{staticClass:"newRepair-container"},[a("v-uni-view",{staticClass:"newRepair-main",staticStyle:{"padding-top":"100rpx"}},[a("v-uni-view",{staticClass:"index-search"},[a("v-uni-view",{staticClass:"index-search-cont"},[a("v-uni-view",{staticClass:"search-input-box",staticStyle:{width:"100%"}},[a("v-uni-input",{staticClass:"index-search-txt",attrs:{"confirm-type":"search",placeholder:"名称/电话"},on:{confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.toSearch()}},model:{value:t.keyTxt,callback:function(e){t.keyTxt=e},expression:"keyTxt"}}),a("v-uni-button",{staticClass:"index-search-btn s-btn",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.toSearch()}}},[t._v("搜索")])],1)],1)],1),t.repaireList.length>0?a("v-uni-view",t._l(t.repaireList,(function(e,i){return a("v-uni-view",{staticClass:"list-item"},[1==t.currentTitle?a("v-uni-view",{staticClass:"umar-b"},[t._v("修理厂名称："+t._s(e.c_nickname))]):3==t.currentTitle?a("v-uni-view",{staticClass:"umar-b"},[t._v("协议客户名称："+t._s(e.c_nickname))]):t._e(),a("v-uni-view",{staticClass:"umar-b"},[t._v("联系电话："+t._s(e.c_tel))]),a("v-uni-view",{staticClass:"umar-b"},[t._v("详细地址："+t._s(e.c_prov+e.c_city+e.c_address))]),a("v-uni-view",{staticClass:"ub ub-pe"},[a("v-uni-view",{staticClass:"ub umar-r f28"},[a("v-uni-button",{staticClass:"am-btn",attrs:{type:"warn"},on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.toRecomm(e)}}},[t._v("推荐")])],1),a("v-uni-view",{staticClass:"ub"},[a("v-uni-button",{staticClass:"am-btn",attrs:{type:"primary"},on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.toCusOrder(e)}}},[t._v("代下单")])],1)],1)],1)})),1):t._e(),a("uni-load-more",{staticClass:"am-umar-tbar",attrs:{status:t.status}})],1),a("uni-popup",{ref:"popup",attrs:{type:"top"}},[a("v-uni-view",{staticClass:"popup-box"},[a("v-uni-radio-group",{on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.change.apply(void 0,arguments)}}},[a("v-uni-view",{staticClass:"list-item"},[a("v-uni-label",{staticClass:"radio"},[a("v-uni-radio",{staticStyle:{transform:"scale(0.7)"},attrs:{value:"1",checked:1==t.currentTitle}}),a("v-uni-text",[t._v("修理厂客户")])],1)],1),a("v-uni-view",{staticClass:"list-item"},[a("v-uni-label",{staticClass:"radio"},[a("v-uni-radio",{staticStyle:{transform:"scale(0.7)"},attrs:{value:"3",checked:3==t.currentTitle}}),a("v-uni-text",[t._v("协议客户")])],1)],1)],1)],1)],1),a("tabBar",{attrs:{current:t.currentTabIndex,column:t.tabNum,options:t.tabList}})],1)},o=[]},6767:function(t,e,a){"use strict";a.r(e);var i=a("0678"),n=a.n(i);for(var o in i)"default"!==o&&function(t){a.d(e,t,(function(){return i[t]}))}(o);e["default"]=n.a},"8a0a":function(t,e,a){var i=a("24fb");e=i(!1),e.push([t.i,".uni-load-more[data-v-8257e34e]{\ndisplay:-webkit-box;display:-webkit-flex;display:flex;\n-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;height:40px;-webkit-box-align:center;-webkit-align-items:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center}.uni-load-more__text[data-v-8257e34e]{font-size:12px}.uni-load-more__img[data-v-8257e34e]{width:24px;height:24px;margin-right:8px}.uni-load-more__img--nvue[data-v-8257e34e]{color:#666}.uni-load-more__img--android[data-v-8257e34e],\n.uni-load-more__img--ios[data-v-8257e34e]{width:24px;height:24px;-webkit-transform:rotate(0deg);transform:rotate(0deg)}\n.uni-load-more__img--android[data-v-8257e34e]{-webkit-animation:loading-ios 1s 0s linear infinite;animation:loading-ios 1s 0s linear infinite}@-webkit-keyframes loading-android-data-v-8257e34e{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.uni-load-more__img--ios-H5[data-v-8257e34e]{position:relative;-webkit-animation:loading-ios-H5-data-v-8257e34e 1s 0s step-end infinite;animation:loading-ios-H5-data-v-8257e34e 1s 0s step-end infinite}.uni-load-more__img--ios-H5>uni-image[data-v-8257e34e]{position:absolute;width:100%;height:100%;left:0;top:0}@-webkit-keyframes loading-ios-H5-data-v-8257e34e{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}8%{-webkit-transform:rotate(30deg);transform:rotate(30deg)}16%{-webkit-transform:rotate(60deg);transform:rotate(60deg)}24%{-webkit-transform:rotate(90deg);transform:rotate(90deg)}32%{-webkit-transform:rotate(120deg);transform:rotate(120deg)}40%{-webkit-transform:rotate(150deg);transform:rotate(150deg)}48%{-webkit-transform:rotate(180deg);transform:rotate(180deg)}56%{-webkit-transform:rotate(210deg);transform:rotate(210deg)}64%{-webkit-transform:rotate(240deg);transform:rotate(240deg)}73%{-webkit-transform:rotate(270deg);transform:rotate(270deg)}82%{-webkit-transform:rotate(300deg);transform:rotate(300deg)}91%{-webkit-transform:rotate(330deg);transform:rotate(330deg)}100%{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes loading-ios-H5-data-v-8257e34e{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}8%{-webkit-transform:rotate(30deg);transform:rotate(30deg)}16%{-webkit-transform:rotate(60deg);transform:rotate(60deg)}24%{-webkit-transform:rotate(90deg);transform:rotate(90deg)}32%{-webkit-transform:rotate(120deg);transform:rotate(120deg)}40%{-webkit-transform:rotate(150deg);transform:rotate(150deg)}48%{-webkit-transform:rotate(180deg);transform:rotate(180deg)}56%{-webkit-transform:rotate(210deg);transform:rotate(210deg)}64%{-webkit-transform:rotate(240deg);transform:rotate(240deg)}73%{-webkit-transform:rotate(270deg);transform:rotate(270deg)}82%{-webkit-transform:rotate(300deg);transform:rotate(300deg)}91%{-webkit-transform:rotate(330deg);transform:rotate(330deg)}100%{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}\n.uni-load-more__img--android-H5[data-v-8257e34e]{-webkit-animation:loading-android-H5-rotate-data-v-8257e34e 2s linear infinite;animation:loading-android-H5-rotate-data-v-8257e34e 2s linear infinite;-webkit-transform-origin:center center;transform-origin:center center}.uni-load-more__img--android-H5>circle[data-v-8257e34e]{display:inline-block;-webkit-animation:loading-android-H5-dash-data-v-8257e34e 1.5s ease-in-out infinite;animation:loading-android-H5-dash-data-v-8257e34e 1.5s ease-in-out infinite;stroke:currentColor;stroke-linecap:round}@-webkit-keyframes loading-android-H5-rotate-data-v-8257e34e{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes loading-android-H5-rotate-data-v-8257e34e{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@-webkit-keyframes loading-android-H5-dash-data-v-8257e34e{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:90,150;stroke-dashoffset:-40}100%{stroke-dasharray:90,150;stroke-dashoffset:-120}}@keyframes loading-android-H5-dash-data-v-8257e34e{0%{stroke-dasharray:1,200;stroke-dashoffset:0}50%{stroke-dasharray:90,150;stroke-dashoffset:-40}100%{stroke-dasharray:90,150;stroke-dashoffset:-120}}\n\n\n\n\n\n",""]),t.exports=e},"98f1":function(t,e,a){"use strict";a.r(e);var i=a("654d"),n=a("298a");for(var o in n)"default"!==o&&function(t){a.d(e,t,(function(){return n[t]}))}(o);a("d4ebd");var r,s=a("f0c5"),c=Object(s["a"])(n["default"],i["b"],i["c"],!1,null,"408c8189",null,!1,i["a"],r);e["default"]=c.exports},ab09:function(t,e,a){var i=a("442c");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var n=a("4f06").default;n("3e877b30",i,!0,{sourceMap:!1,shadowMode:!1})},d4ebd:function(t,e,a){"use strict";var i=a("ab09"),n=a.n(i);n.a}}]);