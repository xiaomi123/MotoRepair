(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-agent-newrepair-newrepair"],{"110a":function(t,e,n){"use strict";n.r(e);var i=n("cb16"),a=n("6548");for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);var s,r=n("f0c5"),c=Object(r["a"])(a["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],s);e["default"]=c.exports},"2d76":function(t,e,n){"use strict";n("a9e3"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i={name:"UniSegmentedControl",props:{current:{type:Number,default:0},values:{type:Array,default:function(){return[]}},activeColor:{type:String,default:"#007aff"},styleType:{type:String,default:"button"},badge:{type:Array,default:function(){return[]}}},data:function(){return{currentIndex:0}},watch:{current:function(t){t!==this.currentIndex&&(this.currentIndex=t)}},created:function(){this.currentIndex=this.current},methods:{_onClick:function(t){this.currentIndex!==t&&(this.currentIndex=t,this.$emit("clickItem",{currentIndex:t}))}}};e.default=i},3238:function(t,e,n){"use strict";(function(t){var i=n("4ea4");n("99af"),n("a434"),n("e25e"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=i(n("9ca7")),o={components:{uniIcons:a.default},data:function(){return{userInfo:{},repaireList:[],tabItems:["待审核","已审核","已拒绝"],badge:[0,0,0],tabIndex:0,marginTop:"",p:1,pageSize:10,pageCount:"",status:"more",agentInfo:{},isEdit:!1,passIndex:-1,models:[{type:"国产车"},{type:"合资车"},{type:"高端车"}],timer:null,keyTxt:""}},onLoad:function(t){var e=this;uni.getStorage({key:"userInfo",success:function(t){e.userInfo=t.data[0],e.getNewRepair(),e.getRepairQty(),e.timer=setInterval((function(){e.getRepairQty()}),5e3)}})},onUnload:function(){var t=this;t.timer&&(clearInterval(t.timer),t.timer=null)},mounted:function(){this.marginTop=this.$refs.tabitem.$el.getBoundingClientRect().top},onReachBottom:function(){this.p<this.pageCount?(this.p++,this.status="loading",this.getNewRepair()):this.status="noMore"},methods:{tel:function(t){uni.makePhoneCall({phoneNumber:t})},onClickTab:function(t){var e=this;e.tabIndex!==t.currentIndex&&(this.keyTxt="",e.p=1,e.tabIndex=t.currentIndex,e.getNewRepair())},getNewRepair:function(){uni.showLoading();var e=this,n=1;1==e.tabIndex?n="-1,0":2==e.tabIndex&&(n="2"),e.$http.httpTokenRequest({url:e.$api.GetUser+"?name="+e.keyTxt+"&tel=&ma001="+e.userInfo.c_ma001+"&m_id="+e.userInfo.c_m_id+"&state="+n+"&pageindex="+e.p+"&pagesize="+e.pageSize,method:"GET",data:{}}).then((function(n){t.log(n),e.p>1?e.repaireList=e.repaireList.concat(n.data.rows):e.repaireList=n.data.rows,0<=n.data.total<e.pageSize?e.status="noMore":e.status="more",e.papeTotal(n.data.total),uni.hideLoading()}),(function(e){t.log(e)}))},papeTotal:function(t){var e=this;if(null==t||""==t)return 0;t%e.pageSize==0?e.pageCount=parseInt(t/e.pageSize):e.pageCount=parseInt(t/e.pageSize)+1},edit:function(t,e){this.agentInfo=t,this.passIndex=e,this.isEdit=!0},toPass:function(e,n){t.log(e);var i=this;i.isEdit=!0,i.agentInfo=e,i.passIndex=n},cancelOption:function(){var t=this;t.isEdit=!1},okOption:function(){var t=this;t.isEdit=!1,t.passOption("0","switch")},passOption:function(e,n){var i=this;if("cancel"==n)i.isEdit=!1;else{if(i.$check.isEmpty(i.agentInfo.c_nickname))return uni.showToast({icon:"none",title:"修理厂名称不能为空",duration:1500}),!1;if(i.$check.isEmpty(i.agentInfo.c_tel))return uni.showToast({icon:"none",title:"联系电话不能为空",duration:1500}),!1;if(!i.$check.ckTel(i.agentInfo.c_tel))return uni.showToast({icon:"none",title:"手机号格式不正确",duration:1500}),!1;if(i.$check.isEmpty(i.agentInfo.c_prov))return uni.showToast({icon:"none",title:"省份不能为空",duration:1500}),!1;if(i.$check.isEmpty(i.agentInfo.c_city))return uni.showToast({icon:"none",title:"区域不能为空",duration:1500}),!1;if(i.$check.isEmpty(i.agentInfo.c_address))return uni.showToast({icon:"none",title:"详细地址不能为空",duration:1500}),!1;i.$http.httpTokenRequest({url:i.$api.UserState+"?c_id="+i.agentInfo.c_id,method:"POST",data:{c_nickname:i.agentInfo.c_nickname,c_prov:i.agentInfo.c_prov,c_city:i.agentInfo.c_city,c_address:i.agentInfo.c_address,c_tel:i.agentInfo.c_tel,c_tel1:i.agentInfo.c_tel1,c_state:e,c_main:i.agentInfo.c_main}}).then((function(t){i.isEdit=!1,t.data.State&&("applay"==n&&"0"==e?(uni.showToast({icon:"none",title:"已通过",duration:1500}),i.repaireList.splice(i.passIndex,1)):"switch"==n&&"0"==e?uni.showToast({icon:"none",title:"已启用",duration:1500}):"switch"==n&&"-1"==e&&uni.showToast({icon:"none",title:"已停用",duration:1500}),i.getNewRepair())}),(function(e){t.log(e)}))}},radioChange:function(t){this.agentInfo.c_main=t.detail.value},getRepairQty:function(){var e=this;e.$http.httpTokenRequest({url:e.$api.UserQty+"?c_ma001="+e.userInfo.c_ma001+"&m_id="+e.userInfo.c_m_id,method:"GET",data:{}}).then((function(t){for(var n=0;n<t.data.length;n++)1==t.data[n].c_state?e.badge[0]=t.data[n].qty:0==t.data[n].c_state?e.badge[1]=t.data[n].qty:2==t.data[n].c_state&&(e.badge[2]=t.data[n].qty);e.$set(e.badge,!0)}),(function(e){t.log(e)}))},toSearch:function(){var t=this;t.p=1,t.getNewRepair()}}};e.default=o}).call(this,n("5a52")["default"])},"39ac":function(t,e,n){"use strict";var i=n("a7c3"),a=n.n(i);a.a},6548:function(t,e,n){"use strict";n.r(e);var i=n("3238"),a=n.n(i);for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);e["default"]=a.a},"9ed6":function(t,e,n){var i=n("24fb");e=i(!1),e.push([t.i,".segmented-control[data-v-63986d46]{\ndisplay:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-sizing:border-box;box-sizing:border-box;\n-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;height:36px;overflow:hidden}.segmented-control-icon[data-v-63986d46]{position:absolute;top:0;right:%?10?%;color:red}.segmented-control__item[data-v-63986d46]{\ndisplay:-webkit-inline-box;display:-webkit-inline-flex;display:inline-flex;-webkit-box-sizing:border-box;box-sizing:border-box;\nposition:relative;-webkit-box-flex:1;-webkit-flex:1;flex:1;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.segmented-control__item--button[data-v-63986d46]{border-style:solid;border-top-width:1px;border-bottom-width:1px;border-right-width:1px;border-left-width:0}.segmented-control__item--button--first[data-v-63986d46]{border-left-width:1px;-webkit-border-top-left-radius:5px;border-top-left-radius:5px;-webkit-border-bottom-left-radius:5px;border-bottom-left-radius:5px}.segmented-control__item--button--last[data-v-63986d46]{-webkit-border-top-right-radius:5px;border-top-right-radius:5px;-webkit-border-bottom-right-radius:5px;border-bottom-right-radius:5px}.segmented-control__item--text[data-v-63986d46]{border-bottom-style:solid;border-bottom-width:3px}.segmented-control__text[data-v-63986d46]{font-size:16px;line-height:20px;text-align:center}",""]),t.exports=e},a7c3:function(t,e,n){var i=n("9ed6");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var a=n("4f06").default;a("ff3c31b8",i,!0,{sourceMap:!1,shadowMode:!1})},ba3c:function(t,e,n){"use strict";var i;n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return i}));var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"segmented-control",class:["text"===t.styleType?"segmented-control--text":"segmented-control--button"],style:{borderColor:"text"===t.styleType?"":t.activeColor}},t._l(t.values,(function(e,i){return n("v-uni-view",{key:i,staticClass:"segmented-control__item",class:["text"===t.styleType?"segmented-control__item--text":"segmented-control__item--button",i===t.currentIndex&&"button"===t.styleType?"segmented-control__item--button--active":"",0===i&&"button"===t.styleType?"segmented-control__item--button--first":"",i===t.values.length-1&&"button"===t.styleType?"segmented-control__item--button--last":""],style:{backgroundColor:i===t.currentIndex&&"button"===t.styleType?t.activeColor:"",borderColor:i===t.currentIndex&&"text"===t.styleType||"button"===t.styleType?t.activeColor:"transparent"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t._onClick(i)}}},[n("v-uni-text",{staticClass:"segmented-control__text",style:{color:i===t.currentIndex?"text"===t.styleType?t.activeColor:"#fff":"text"===t.styleType?"#000":t.activeColor}},[t._v(t._s(e))]),n("v-uni-text",{staticClass:"segmented-control-icon"},[t._v(t._s(t.badge[i]))])],1)})),1)},o=[]},cb16:function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return i}));var i={uniSegmentedControl:n("e29b").default,uniIcons:n("9ca7").default},a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"newRepair-container"},[n("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:t.isEdit,expression:"isEdit"}],staticClass:"login-dialog",staticStyle:{"z-index":"999"}},[n("v-uni-view",{staticClass:"login-dialog-cont"},[n("v-uni-view",{staticClass:"login-title"},[t._v("为了能更好的为您提供服务，请准确录入您的信息"),n("v-uni-text",{staticClass:"iconfont login-dialog-close",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.isEdit=!1}}},[t._v("")])],1),n("v-uni-view",{staticClass:"login-list"},[n("v-uni-text",{staticClass:"login-txt"},[t._v("修理厂名称")]),n("v-uni-input",{staticClass:"uni-input login-input",attrs:{placeholder:"请录入修理厂名称"},model:{value:t.agentInfo.c_nickname,callback:function(e){t.$set(t.agentInfo,"c_nickname",e)},expression:"agentInfo.c_nickname"}})],1),n("v-uni-view",{staticClass:"login-list"},[n("v-uni-text",{staticClass:"login-txt"},[t._v("联系电话")]),n("v-uni-input",{staticClass:"uni-input login-input",attrs:{placeholder:"请录入联系电话"},model:{value:t.agentInfo.c_tel,callback:function(e){t.$set(t.agentInfo,"c_tel",e)},expression:"agentInfo.c_tel"}})],1),n("v-uni-view",{staticClass:"login-list02"},[n("v-uni-view",{staticClass:"login-list02-content"},[n("v-uni-view",{staticClass:"login-list"},[n("v-uni-text",{staticClass:"login-txt",staticStyle:{width:"80%"}},[t._v("省份")]),n("v-uni-input",{staticClass:"uni-input login-input",attrs:{placeholder:"请录入省份"},model:{value:t.agentInfo.c_prov,callback:function(e){t.$set(t.agentInfo,"c_prov",e)},expression:"agentInfo.c_prov"}})],1)],1),n("v-uni-view",{staticClass:"login-list02-content"},[n("v-uni-view",{staticClass:"login-list"},[n("v-uni-text",{staticClass:"login-txt",staticStyle:{width:"35%","text-align":"right"}},[t._v("区域")]),n("v-uni-input",{staticClass:"uni-input login-input",attrs:{placeholder:"请录入区域"},model:{value:t.agentInfo.c_city,callback:function(e){t.$set(t.agentInfo,"c_city",e)},expression:"agentInfo.c_city"}})],1)],1)],1),n("v-uni-view",{staticClass:"login-list",staticStyle:{"border-bottom":"none"}},[n("v-uni-text",{staticClass:"login-txt"},[t._v("详细地址")]),n("v-uni-view",{staticClass:"login-area"},[n("v-uni-textarea",{staticClass:"login-area-txt",attrs:{placeholder:"请录入详细地址"},model:{value:t.agentInfo.c_address,callback:function(e){t.$set(t.agentInfo,"c_address",e)},expression:"agentInfo.c_address"}})],1)],1),n("v-uni-view",{staticClass:"login-list"},[n("v-uni-text",{staticClass:"login-txt"},[t._v("主修车型")]),n("v-uni-view",{staticClass:"radio-group"},[n("v-uni-radio-group",{on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.radioChange.apply(void 0,arguments)}}},t._l(t.models,(function(e){return n("v-uni-view",{staticClass:"radio-item"},[n("v-uni-label",{staticClass:"radio",staticStyle:{"margin-right":"30rpx"}},[n("v-uni-radio",{staticStyle:{transform:"scale(0.7)"},attrs:{value:e.type,checked:t.agentInfo.c_main==e.type}}),t._v(t._s(e.type))],1)],1)})),1)],1)],1),0==t.tabIndex||2==t.tabIndex?n("v-uni-view",{staticClass:"login-dialog-btncont"},[0==t.tabIndex?n("v-uni-button",{staticClass:"login-dialog-btn",attrs:{type:"default"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.passOption("2","applay")}}},[t._v("不通过")]):t._e(),2==t.tabIndex?n("v-uni-button",{staticClass:"login-dialog-btn",attrs:{type:"default"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.passOption("2","cancel")}}},[t._v("取消")]):t._e(),n("v-uni-button",{staticClass:"login-dialog-btn",attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.passOption("0","applay")}}},[t._v("通过")])],1):t._e(),1==t.tabIndex?n("v-uni-view",{staticClass:"login-dialog-btncont"},[n("v-uni-button",{staticClass:"login-dialog-btn",attrs:{type:"default"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.cancelOption()}}},[t._v("取消")]),n("v-uni-button",{staticClass:"login-dialog-btn",attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.okOption()}}},[t._v("确定")])],1):t._e()],1)],1),n("v-uni-view",{staticClass:"index-search"},[n("v-uni-view",{staticClass:"index-search-cont"},[n("v-uni-view",{staticClass:"search-input-box",staticStyle:{width:"100%"}},[n("v-uni-input",{staticClass:"index-search-txt",attrs:{"confirm-type":"search",placeholder:"名称/电话"},on:{confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.toSearch()}},model:{value:t.keyTxt,callback:function(e){t.keyTxt=e},expression:"keyTxt"}}),n("v-uni-button",{staticClass:"index-search-btn s-btn",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.toSearch()}}},[t._v("搜索")])],1)],1)],1),n("v-uni-view",{staticClass:"newRepair-main"},[n("v-uni-view",{ref:"tabitem",staticClass:"am-fixedBar",staticStyle:{top:"44px","z-index":"998"}},[n("uni-segmented-control",{attrs:{current:t.tabIndex,values:t.tabItems,badge:t.badge,"style-type":"text","active-color":"#3079F3"},on:{clickItem:function(e){arguments[0]=e=t.$handleEvent(e),t.onClickTab.apply(void 0,arguments)}}})],1),n("v-uni-view",{style:{marginTop:t.marginTop+"px"}},[t.repaireList.length>0?n("v-uni-view",t._l(t.repaireList,(function(e,i){return n("v-uni-view",{staticClass:"newRepair-list ub-ac"},[n("v-uni-view",{staticClass:"newRepair-fl"},[n("v-uni-view",[t._v("修理厂名称："+t._s(e.c_nickname))]),n("v-uni-view",{on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.tel(e.c_tel)}}},[t._v("联系电话："),n("a",{staticStyle:{"background-color":"rgb(48, 121, 243)","border-radius":"3rpx",padding:"0 5px",color:"#F1F1F1"}},[n("uni-icons",{attrs:{type:"phone",size:"16",color:"#FFFFFF"}}),t._v(t._s(e.c_tel))],1)]),n("v-uni-view",[t._v("备用电话："+t._s(e.c_tel1))]),n("v-uni-view",[t._v("详细地址："+t._s(e.c_prov+e.c_city+e.c_address))])],1),0==t.tabIndex||2==t.tabIndex?n("v-uni-button",{staticClass:"newRepair-fr",attrs:{type:"primary"},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.toPass(e,i)}}},[t._v("审核")]):n("v-uni-button",{staticClass:"newRepair-fr",attrs:{type:"primary"},on:{click:function(n){arguments[0]=n=t.$handleEvent(n),t.edit(e,i)}}},[t._v("编辑")])],1)})),1):t._e(),0==t.repaireList.length?n("v-uni-view",{staticClass:"com-nodata"},[t._v("暂无数据")]):t._e()],1)],1)],1)},o=[]},e29b:function(t,e,n){"use strict";n.r(e);var i=n("ba3c"),a=n("f2cb");for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);n("39ac");var s,r=n("f0c5"),c=Object(r["a"])(a["default"],i["b"],i["c"],!1,null,"63986d46",null,!1,i["a"],s);e["default"]=c.exports},f2cb:function(t,e,n){"use strict";n.r(e);var i=n("2d76"),a=n.n(i);for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);e["default"]=a.a}}]);