(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-repairShop-auth-auth"],{"532b":function(a,t,e){"use strict";e.r(t);var n=e("a5d2"),i=e.n(n);for(var s in n)"default"!==s&&function(a){e.d(t,a,(function(){return n[a]}))}(s);t["default"]=i.a},"65b4":function(a,t,e){"use strict";var n;e.d(t,"b",(function(){return i})),e.d(t,"c",(function(){return s})),e.d(t,"a",(function(){return n}));var i=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("v-uni-view",[e("v-uni-view",{},[e("v-uni-form",{staticClass:"am-form uinn-t"},[e("v-uni-view",{staticClass:"ub ub-f1 ub-ac am-form-group am-bg-white"},[e("v-uni-view",{staticClass:"ub am-label"},[a._v("联系电话:")]),e("v-uni-view",{staticClass:"ub ub-f1"},[e("v-uni-input",{staticClass:"f32",attrs:{type:"number",maxlength:"11",placeholder:"请录入联系电话",value:"",disabled:!0},model:{value:a.agentInfo.c_tel,callback:function(t){a.$set(a.agentInfo,"c_tel",t)},expression:"agentInfo.c_tel"}})],1)],1),e("v-uni-view",{staticClass:"ub ub-f1 ub-ac am-form-group am-bg-white"},[e("v-uni-view",{staticClass:"ub am-label"},[a._v("修理厂名称:")]),e("v-uni-view",{staticClass:"ub ub-f1"},[e("v-uni-input",{staticClass:"f32",attrs:{type:"text",placeholder:"请录入修理厂名称",value:"",disabled:!0},model:{value:a.agentInfo.c_nickname,callback:function(t){a.$set(a.agentInfo,"c_nickname",t)},expression:"agentInfo.c_nickname"}})],1)],1),e("v-uni-view",{staticClass:"ub ub-f1 ub-ac am-form-group am-bg-white"},[e("v-uni-view",{staticClass:"ub am-label"},[a._v("省份:")]),e("v-uni-view",{staticClass:"ub ub-f1"},[e("v-uni-input",{staticClass:"f32",attrs:{type:"text",placeholder:"请录入省份",value:"",disabled:!0},model:{value:a.agentInfo.c_prov,callback:function(t){a.$set(a.agentInfo,"c_prov",t)},expression:"agentInfo.c_prov"}})],1)],1),e("v-uni-view",{staticClass:"ub ub-f1 ub-ac am-form-group am-bg-white"},[e("v-uni-view",{staticClass:"ub am-label"},[a._v("区域:")]),e("v-uni-view",{staticClass:"ub ub-f1"},[e("v-uni-input",{staticClass:"f32",attrs:{type:"text",placeholder:"请录入区域",value:"",disabled:!0},model:{value:a.agentInfo.c_city,callback:function(t){a.$set(a.agentInfo,"c_city",t)},expression:"agentInfo.c_city"}})],1)],1),e("v-uni-view",{staticClass:"ub ub-f1 ub-ac am-form-group am-bg-white"},[e("v-uni-view",{staticClass:"ub am-label"},[a._v("详细地址:")]),e("v-uni-view",{staticClass:"ub ub-f1"},[e("v-uni-input",{staticClass:"f32",attrs:{type:"text",placeholder:"请录入详细地址",value:"",disabled:!0},model:{value:a.agentInfo.c_address,callback:function(t){a.$set(a.agentInfo,"c_address",t)},expression:"agentInfo.c_address"}})],1)],1)],1)],1)],1)},s=[]},"78c7":function(a,t,e){"use strict";var n=e("e548"),i=e.n(n);i.a},a24d:function(a,t,e){"use strict";e.r(t);var n=e("65b4"),i=e("532b");for(var s in i)"default"!==s&&function(a){e.d(t,a,(function(){return i[a]}))}(s);e("78c7");var u,c=e("f0c5"),o=Object(c["a"])(i["default"],n["b"],n["c"],!1,null,"14c08a64",null,!1,n["a"],u);t["default"]=o.exports},a5d2:function(a,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={data:function(){return{agentInfo:{c_tel:"",c_nickname:"",c_prov:"",c_city:"",c_address:"",c_state:"1"}}},onLoad:function(){var a=this;uni.getStorage({key:"userInfo",success:function(t){a.userInfo=t.data[0],a.agentInfo.c_nickname=a.userInfo.c_nickname,a.agentInfo.c_tel=a.userInfo.c_tel,a.agentInfo.c_address=a.userInfo.c_address,a.agentInfo.c_prov=a.userInfo.c_prov,a.agentInfo.c_city=a.userInfo.c_city}})},methods:{}};t.default=n},e4b4:function(a,t,e){var n=e("24fb");t=n(!1),t.push([a.i,"uni-page-body[data-v-14c08a64]{background-color:#f8f8f8;font-size:%?32?%}.uinn-t[data-v-14c08a64]{padding-top:%?20?%}.am-form .am-form-group[data-v-14c08a64]{border-bottom:1px solid #eee;margin-bottom:0;-webkit-border-radius:0;border-radius:0}body.?%PAGE?%[data-v-14c08a64]{background-color:#f8f8f8}",""]),a.exports=t},e548:function(a,t,e){var n=e("e4b4");"string"===typeof n&&(n=[[a.i,n,""]]),n.locals&&(a.exports=n.locals);var i=e("4f06").default;i("69d71b72",n,!0,{sourceMap:!1,shadowMode:!1})}}]);