(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-tourist-proList-proList"],{"0ce8":function(e,t,i){"use strict";i.r(t);var a=i("249c"),n=i.n(a);for(var s in a)"default"!==s&&function(e){i.d(t,e,(function(){return a[e]}))}(s);t["default"]=n.a},"249c":function(e,t,i){"use strict";(function(e){var a=i("4ea4");i("99af"),i("e25e"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=a(i("4ecc")),s={components:{uniLoadMore:n.default},data:function(){return{proList:[],carCode:[],userInfo:{},p:1,pageSize:10,pageCount:"",status:"more",keywords:"",scode:"",ckLevel:{},isCk:!1,ckLeTxt:"",noProducts:!1}},onLoad:function(e){var t=this;uni.getStorage({key:"userInfo",success:function(i){t.userInfo=i.data[0],t.$check.isEmpty(e.keyWord)||(t.keywords=e.keyWord,t.scode=e.keyWord,t.getProduct()),t.$check.isEmpty(e.scode)||(t.scode=e.scode,t.ckLeTxt=e.scode,t.getCar())}})},onReachBottom:function(){this.p<this.pageCount?(this.p++,this.status="loading",this_.$check.isEmpty(this_.keywords)||this.getProduct()):this.status="noMore"},methods:{getCar:function(){var t=this;uni.showLoading(),t.$http.httpTokenRequest({url:t.$api.CarCode+"?code="+t.scode+"&level2=&level3=",method:"GET",data:{}}).then((function(e){uni.hideLoading(),t.$check.isEmpty(e.data)||(t.carCode=e.data,t.getCodePro(t.carCode[0].s_mb001),1==t.carCode.length&&(t.$check.isEmpty(t.carCode[0].s_level2)||(t.ckLevel=t.carCode,t.isCk=!0,t.ckLevel=t.carCode[0])))}),(function(t){e.log(t)}))},levelSel:function(e,t){var i=this;i.proList=[],i.$check.isEmpty(e.s_mb001)||i.getCodePro(e.s_mb001),"1"==t?(i.$check.isEmpty(e.s_level2)||(i.ckLevel=e,i.isCk=!0),i.ckLeTxt=e.s_car_code):"2"==t?i.ckLeTxt=e.s_level2:"3"==t&&(i.ckLeTxt=e.s_level3)},getCodePro:function(t){var i=this;uni.showLoading(),i.$http.httpTokenRequest({url:i.$api.ProductByCode+"?c_id="+i.userInfo.c_id+"&c_type="+i.userInfo.c_type+"&code="+t,method:"GET",data:{}}).then((function(e){uni.hideLoading(),i.proList=e.data}),(function(t){e.log(t)}))},getProduct:function(){var t=this;uni.showLoading(),t.$http.httpTokenRequest({url:t.$api.ProductHome+"?c_id="+t.userInfo.c_id+"&c_type="+t.userInfo.c_type+"&c_ma001="+t.userInfo.c_ma001+"&tag="+t.keywords+"&pageindex="+t.p+"&pagesize="+t.pageSize,method:"GET",data:{}}).then((function(e){uni.hideLoading(),t.p>1?t.proList=t.proList.concat(e.data.rows):t.proList=e.data.rows,0==t.proList.length?t.noProducts=!0:t.noProducts=!1,t.status="more",t.papeTotal(e.data.total)}),(function(t){e.log(t)}))},toDetail:function(e){uni.navigateTo({url:"../detail/detail?code="+e.erpcode+"&type=index"})},collect:function(t){var i=this;i.$http.httpTokenRequest({url:i.$api.AddFavorite,method:"POST",data:{c_id:i.userInfo.c_id,c_ma001:i.userInfo.c_ma001,c_ma002:i.userInfo.c_ma002,i_mb001:t.erpcode}}).then((function(e){e.data.State&&(t.f_id=e.data.centent,uni.showToast({icon:"none",title:"收藏成功",duration:1500}))}),(function(t){e.log(t)}))},collCancle:function(t){var i=this;i.$http.httpTokenRequest({url:i.$api.DelFavorite,method:"POST",data:[{f_id:t.f_id}]}).then((function(e){e.data.State&&(t.f_id=""),uni.showToast({icon:"none",title:"取消收藏",duration:1500})}),(function(t){e.log(t)}))},search:function(e){var t=this;t.scode=t.keywords,t.getProduct()},papeTotal:function(e){var t=this;if(null==e||""==e)return 0;e%t.pageSize==0?t.pageCount=parseInt(e/t.pageSize):t.pageCount=parseInt(e/t.pageSize)+1}}};t.default=s}).call(this,i("5a52")["default"])},"66fe":function(e,t,i){var a=i("d2dd");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var n=i("4f06").default;n("49661058",a,!0,{sourceMap:!1,shadowMode:!1})},"806e":function(e,t,i){"use strict";var a=i("66fe"),n=i.n(a);n.a},b50c:function(e,t,i){"use strict";i.r(t);var a=i("c58c"),n=i("0ce8");for(var s in n)"default"!==s&&function(e){i.d(t,e,(function(){return n[e]}))}(s);i("806e");var o,c=i("f0c5"),l=Object(c["a"])(n["default"],a["b"],a["c"],!1,null,"6efe54e8",null,!1,a["a"],o);t["default"]=l.exports},c58c:function(e,t,i){"use strict";i.d(t,"b",(function(){return n})),i.d(t,"c",(function(){return s})),i.d(t,"a",(function(){return a}));var a={uniTag:i("7a3c").default},n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",{staticClass:"index_container"},[a("v-uni-view",{staticClass:"index-search"},[a("v-uni-view",{staticClass:"index-search-cont"},[a("v-uni-view",{staticClass:"search-input-box",staticStyle:{width:"100%"}},[a("v-uni-input",{staticClass:"index-search-txt",attrs:{"confirm-type":"search",placeholder:"请输入"},on:{confirm:function(t){arguments[0]=t=e.$handleEvent(t),e.search.apply(void 0,arguments)}},model:{value:e.keywords,callback:function(t){e.keywords=t},expression:"keywords"}}),a("v-uni-button",{staticClass:"index-search-btn s-btn",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.search()}}},[e._v("搜索")])],1)],1)],1),e.carCode.length>0?a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],staticClass:"example-body",staticStyle:{"padding-top":"20rpx"}},[e.carCode.length>0?a("v-uni-view",{staticClass:"example-title"},[e._v("原车代码：")]):e._e(),a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:e.isCk,expression:"isCk"}],staticClass:"example-level"},[a("v-uni-view",{staticClass:"example-level-title"},[e._v(e._s(e.ckLevel.s_car_code))]),e._l(e.ckLevel.s_level2,(function(t){return a("v-uni-view",[a("v-uni-view",{class:e.ckLeTxt==t.s_level2?"example-active":"",on:{click:function(i){arguments[0]=i=e.$handleEvent(i),e.levelSel(t,"2")}}},[e._v(e._s(t.s_level2))]),e._l(t.s_level3,(function(t){return a("v-uni-view",[a("v-uni-view",{class:e.ckLeTxt==t.s_level3?"example-active":"",on:{click:function(i){arguments[0]=i=e.$handleEvent(i),e.levelSel(t,"3")}}},[e._v(e._s(t.s_level3))])],1)}))],2)}))],2),e._l(e.carCode,(function(t){return a("v-uni-view",{staticClass:"tag-view example-tag"},[a("uni-tag",{class:e.ckLeTxt==t.s_car_code?"tag-active":"",attrs:{text:t.s_car_code,inverted:"false"},on:{click:function(i){arguments[0]=i=e.$handleEvent(i),e.levelSel(t,"1")}}})],1)})),a("v-uni-view",{staticClass:"am-clear"})],2):e._e(),e.proList.length>0?a("v-uni-view",{staticClass:"index-content"},[a("v-uni-view",{staticClass:"example-title"},[e._v("相关产品：")]),a("v-uni-view",{staticClass:"index-product"},e._l(e.proList,(function(t,i){return a("v-uni-view",{staticClass:"index-list",on:{click:function(i){arguments[0]=i=e.$handleEvent(i),e.toDetail(t)}}},[a("v-uni-image",{staticClass:"index-listImg",attrs:{src:e.$http.imgUrl+t.titlepicurl,mode:"widthFix"}}),a("v-uni-view",{staticClass:"index-uinn"},[a("v-uni-text",{staticClass:"index-title"},[e._v(e._s(t.title))]),a("v-uni-view",{staticClass:"index-txt"},[a("v-uni-text",[e._v("品牌:"+e._s(t.suitable))])],1),a("v-uni-view",{staticClass:"index_collect ub ub-ac"},[t.a_id>0?a("v-uni-text",{staticClass:"ub f32 am-blod"},[e._v("赠")]):e._e(),t.f_id?a("v-uni-text",{staticClass:"iconfont ub umar-l",on:{click:function(i){i.stopPropagation(),arguments[0]=i=e.$handleEvent(i),e.collCancle(t)}}},[e._v("")]):a("v-uni-text",{staticClass:"iconfont ub umar-l",on:{click:function(i){i.stopPropagation(),arguments[0]=i=e.$handleEvent(i),e.collect(t)}}},[e._v("")])],1)],1)],1)})),1)],1):e._e(),a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:e.noProducts,expression:"noProducts"}],staticClass:"example-title"},[a("v-uni-image",{staticClass:"emptyImg",attrs:{src:i("a137"),mode:"widthFix"}})],1)],1)},s=[]},d2dd:function(e,t,i){var a=i("24fb");t=a(!1),t.push([e.i,".umar-l[data-v-6efe54e8]{margin-left:%?10?%}.index-search-txt[data-v-6efe54e8]{width:70%}.index-search-btn[data-v-6efe54e8]{width:18%}.example-tag .tag-active[data-v-6efe54e8]{background-color:#2d79f1;border-radius:%?12?%;-webkit-border-radius:%?12?%}.emptyImg[data-v-6efe54e8]{display:block;margin:0 auto}",""]),e.exports=t}}]);