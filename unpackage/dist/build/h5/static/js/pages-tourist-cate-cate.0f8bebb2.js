(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-tourist-cate-cate"],{"1aec":function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return a}));var a={uniSegmentedControl:n("9713").default,uniTag:n("7a3c").default,uniIndexedList:n("c971").default},i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"cate-container"},[n("v-uni-view",{staticClass:"index-search"},[n("v-uni-view",{staticClass:"index-search-cont"},[n("v-uni-input",{staticClass:"index-search-txt index-search-agent",attrs:{"confirm-type":"search",placeholder:"请输入"},on:{confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.search.apply(void 0,arguments)}},model:{value:t.keywords,callback:function(e){t.keywords=e},expression:"keywords"}})],1)],1),n("v-uni-view",{ref:"tabitem",staticClass:"am-fixedBar"},[n("uni-segmented-control",{attrs:{current:t.tabIndex,values:t.tabItems,"style-type":"text","active-color":"#3079F3"},on:{clickItem:function(e){arguments[0]=e=t.$handleEvent(e),t.onClickTab.apply(void 0,arguments)}}})],1),1==t.tabIndex?n("v-uni-view",{staticClass:"example-body"},[t._l(t.tags,(function(e){return n("v-uni-view",{staticClass:"tag-view"},[n("uni-tag",{attrs:{text:e.title,inverted:"false",type:t.type},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.selected(e)}}})],1)})),n("v-uni-view",{staticClass:"am-clear"})],2):t._e(),0==t.tabIndex?n("v-uni-view",{staticClass:"example-body"},[n("uni-indexed-list",{attrs:{options:t.newCarCodeList,showSelect:!1},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.bindClick.apply(void 0,arguments)}}}),n("v-uni-view",{staticClass:"am-clear"})],1):t._e()],1)},o=[]},"317f":function(t,e,n){"use strict";n.r(e);var a=n("1aec"),i=n("53f8");for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);var s,c=n("f0c5"),r=Object(c["a"])(i["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],s);e["default"]=r.exports},"53f8":function(t,e,n){"use strict";n.r(e);var a=n("736e"),i=n.n(a);for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);e["default"]=i.a},"736e":function(t,e,n){"use strict";(function(t){var a=n("4ea4");n("a630"),n("d3b7"),n("6062"),n("3ca3"),n("ddb0"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=a(n("c971")),o=a(n("7a3c")),s={components:{uniTag:o.default,uniIndexedList:i.default},data:function(){return{type:"default",tags:[],tabItems:["原车铭牌上发动机型号","相关产品"],state:["0","1","2","3","4"],tabIndex:0,marginTop:"",carCode:[],keywords:"",newCarCodeList:[],winHeight:0,itemHeight:0,winOffsetY:0,touchmove:!1,touchmoveIndex:-1,scrollViewId:"",touchmoveTimeout:"",loaded:!1}},onLoad:function(){this.getCateList(),this.getCartCode()},mounted:function(){this.marginTop=this.$refs.tabitem.$el.getBoundingClientRect().height},methods:{onClickTab:function(t){var e=this;e.tabIndex!==t.currentIndex&&(e.p=1,e.tabIndex=t.currentIndex)},getCateList:function(){var e=this;uni.showLoading(),e.$http.httpTokenRequest({url:e.$api.ProductHome,method:"GET",data:{}}).then((function(t){uni.hideLoading(),e.tags=t.data}),(function(e){t.log(e)}))},selected:function(t){uni.navigateTo({url:"../detail/detail?code="+t.erpcode+"&type=cate"})},getCartCode:function(){var e=this;uni.showLoading(),e.$http.httpTokenRequest({url:e.$api.CarCode,method:"GET",data:{}}).then((function(t){uni.hideLoading(),e.carCode=[],e.carCode=t.data}),(function(e){t.log(e)}))},carCodeSel:function(t){uni.navigateTo({url:"../proList/proList?scode="+t+"&keyWord="})},search:function(){var t=this;uni.navigateTo({url:"../proList/proList?scode=&keyWord="+t.keywords})},bindClick:function(t){uni.showToast({title:"游客身份暂不允许原车代码查询",duration:3e3})}},watch:{carCode:function(){for(var e=[],n=[],a=0;a<this.carCode.length;a++)e.push(this.carCode[a].s_car_code.substring(0,1)),n.push(this.carCode[a].s_car_code);e=Array.from(new Set(e)),t.log(e),t.log(n);for(var i=0;i<e.length;i++){for(var o=[],s=0;s<n.length;s++)e[i]==n[s].substring(0,1)&&o.push(n[s]);this.newCarCodeList.push({letter:e[i],data:o})}t.log(this.newCarCodeList)}}};e.default=s}).call(this,n("5a52")["default"])}}]);