(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-agent-cate-cate"],{"36b0":function(t,e,n){"use strict";n.r(e);var i=n("375d"),a=n("9092");for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);var s,d=n("f0c5"),c=Object(d["a"])(a["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],s);e["default"]=c.exports},"375d":function(t,e,n){"use strict";var i={uniSegmentedControl:n("bf51").default,uniTag:n("3d9f").default,uniIndexedList:n("6dcf").default},a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"cate-container"},[n("v-uni-view",{staticClass:"index-search"},[n("v-uni-view",{staticClass:"index-search-cont"},[n("v-uni-input",{staticClass:"index-search-txt index-search-agent",attrs:{"confirm-type":"search",placeholder:"请输入机型或车型"},on:{confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.search.apply(void 0,arguments)}},model:{value:t.keywords,callback:function(e){t.keywords=e},expression:"keywords"}})],1)],1),n("v-uni-view",{ref:"tabitem",staticClass:"am-fixedBar"},[n("uni-segmented-control",{attrs:{current:t.tabIndex,values:t.tabItems,"style-type":"text","active-color":"#3079F3"},on:{clickItem:function(e){arguments[0]=e=t.$handleEvent(e),t.onClickTab.apply(void 0,arguments)}}})],1),1==t.tabIndex?n("v-uni-view",{staticClass:"example-body"},[t._l(t.tags,(function(e){return n("v-uni-view",{staticClass:"tag-view"},[n("uni-tag",{attrs:{text:e.title,inverted:"false",type:t.type},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.selected(e)}}})],1)})),n("v-uni-view",{staticClass:"am-clear"})],2):t._e(),0==t.tabIndex?n("v-uni-view",{staticClass:"example-body"},[n("uni-indexed-list",{attrs:{options:t.newCarCodeList,showSelect:!1},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.bindClick.apply(void 0,arguments)}}}),n("v-uni-view",{staticClass:"am-clear"})],1):t._e()],1)},o=[];n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return i}))},9092:function(t,e,n){"use strict";n.r(e);var i=n("f7a1"),a=n.n(i);for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);e["default"]=a.a},f7a1:function(t,e,n){"use strict";(function(t){var i=n("ee27");n("a630"),n("d3b7"),n("6062"),n("3ca3"),n("ddb0"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=i(n("6dcf")),o=i(n("3d9f")),s={components:{uniTag:o.default,uniIndexedList:a.default},data:function(){return{type:"default",tags:[],tabItems:["原车铭牌上发动机型号","相关产品"],state:["0","1","2","3","4"],tabIndex:0,marginTop:"",carCode:[],keywords:"",newCarCodeList:[],winHeight:0,itemHeight:0,winOffsetY:0,touchmove:!1,touchmoveIndex:-1,scrollViewId:"",touchmoveTimeout:"",loaded:!1}},onLoad:function(){this.getCateList(),this.getCartCode()},mounted:function(){this.marginTop=this.$refs.tabitem.$el.getBoundingClientRect().height},methods:{onClickTab:function(t){var e=this;e.tabIndex!==t.currentIndex&&(e.p=1,e.tabIndex=t.currentIndex)},getCateList:function(){var e=this;uni.showLoading(),e.$http.httpTokenRequest({url:e.$api.ProductHome,method:"GET",data:{}}).then((function(t){uni.hideLoading(),e.tags=t.data}),(function(e){t.log(e)}))},selected:function(t){uni.navigateTo({url:"../detail/detail?code="+t.erpcode+"&type=cate"})},getCartCode:function(){var e=this;uni.showLoading(),e.$http.httpTokenRequest({url:e.$api.CarCode,method:"GET",data:{}}).then((function(t){uni.hideLoading(),e.carCode=[],e.carCode=t.data}),(function(e){t.log(e)}))},carCodeSel:function(t){uni.navigateTo({url:"../proList/proList?scode="+t+"&keyWord="})},search:function(){var t=this;uni.navigateTo({url:"../proList/proList?scode=&keyWord="+t.keywords})},bindClick:function(e){var n=this;uni.showLoading(),n.$http.httpTokenRequest({url:n.$api.CarCode+"?code="+e.item.name+"&level2=2&level3=&isexact=1",method:"GET",data:{}}).then((function(t){uni.hideLoading(),uni.navigateTo({url:"../proList/byClickProList?scode=&keyWord=&click="+e.item.name+"&mb001="+t.data[0].s_mb001})}),(function(e){t.log(e)}))}},watch:{carCode:function(){for(var e=[],n=[],i=0;i<this.carCode.length;i++)e.push(this.carCode[i].s_car_code.substring(0,1)),n.push(this.carCode[i].s_car_code);e=Array.from(new Set(e)),t.log(e),t.log(n);for(var a=0;a<e.length;a++){for(var o=[],s=0;s<n.length;s++)e[a]==n[s].substring(0,1)&&o.push(n[s]);this.newCarCodeList.push({letter:e[a],data:o})}t.log(this.newCarCodeList)}}};e.default=s}).call(this,n("5a52")["default"])}}]);