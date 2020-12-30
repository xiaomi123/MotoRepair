<template>
	
	<view class="stock-container f28">
		<!-- 手动录入发动机号 -->
		<view class="login-dialog" v-show="isShow">
			<view class="login-dialog-cont">
				<!-- <view class="login-title">为了准确为您和您的客户推送消息，请准确录入您的手机号</view> -->
				<view class="login-list">
					<text class="login-txt">发动机编码</text>
					<input class="uni-input login-input" v-model="engineCode"  placeholder="请录入发动机编码" />
				</view>
				<view class="ub">
					<button type="primary" class="login-dialog-btn" @click="cancel()" style="background-color: #CCCCCC;color:#000000">取消</button>
					<button type="primary" class="login-dialog-btn" @click="submitAgent()">提交</button>
				</view>
			</view>
		</view>
		
		<view class="custpro-main search-cont">
			<!-- 搜索内容开始 -->
			<view class="index-search">
				<view class="index-search-cont">
					<view class="search-input-box" style="width: 100%;">
						<input class="index-search-txt" confirm-type="search" v-model="keyTxt" @input="getList" placeholder="请输入产品编号或规格"  @confirm="toSearch()"  />
						<button class="index-search-btn s-btn" @click="toSearch()">搜索</button>
					</view>
				</view>
			</view>
			
			<!-- 搜索内容结束 -->
			<view class="ub ub-ver am-list-item" v-for="list in stockList">
				<view class="ub ub-ac">
					<view class="ub ub-ver ub-f1">
						<view class="ub">
							<text class="ub ub-f1 am-blod">{{list.spec}}</text>
						</view>
						<view class="ub">
							<text class="ub ub-f1 am-text-primary" @click="flod(list)">查看识别码</text>
							<text class="ub ub-f1">库存:{{list.qty}}</text>
						</view>
						
					</view>
					<text class="zhiding" @click="showTop(list)" :style="{backgroundColor: list.t_top == 1 ? '#CCCCCC' : '#d44242'}">{{list.t_top == 1 ? "取消置顶" : "置顶"}}</text>
					<!-- <view class="ub booking-btn" v-if="userInfo.c_level == 1">
						<button type="warn" size="mini" @click="tobuy(list.erpcode)">进货</button>
					</view> -->
				</view>
				<view class="ub">
					<view class="code-list" v-show="list.isShow">
						<block v-for="items in list.item">
							<view class="code-list-item">{{items.motorid}}</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		
		<view class="ub am-btn-fixed am-bg-white ub-ac">
			<view class="ub ub-f1" style="padding-left: 30rpx;">总计：{{stockTotal}}</view>
			<!-- <view class="ub">
				<button class="am-btn" type="primary" @click="scanEnter()">扫描入库</button>
				<button class="am-btn" type="warn" @click="handEnter()">手动入库</button>
			</view> -->
		</view>
		<view class="tiShiWrap" v-show="tiShi">
			<view class="tiShiWrapCon">{{tiShiText}}</view>
		</view>
	</view>
</template>
<script>
	import wx from '@/common/js/jwweixin.js'
	export default {
		data() {
			return {
				userInfo: {}, //用户信息
				keyTxt:'',//关键字
				isonway : 0, //是否在途 0库存 1在途
				stockTotal : '', //库存总数量
				stockList: [], //订单列表
				isShow : false, //是否显示手动录入窗口
				engineCode : "A",//发动机编码
				tiShi: false,
				tiShiText: ''
			}
		},
		onLoad(option) {
			console.log(option);
			if(option.type == 0){
				var navBarTitle = "库存";
			}else{
				var navBarTitle = "在途";
			}
			uni.setNavigationBarTitle({
				title: navBarTitle
			})
			//读取存储数据
			let this_ = this;
			this_.wxInit();
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					this_.userInfo = res.data[0];
					this_.isonway = option.type;
					this_.getStockList();
					this_.getStockTotal();
				}
			});
		},
		methods: {
			//微信
			wxInit() {
				let this_ = this;
				let _data = {
					url: 'http://dhzx.htqp.com.cn/',
				};
				// 获取微信签名
				this_.$http.httpTokenRequest({
					url: 'JsSdkUiPackage',
					method: 'POST',
					data: _data,
				}).then(res => {
					//请求成功
					this_.wxConfig(res.data.Timestamp, res.data.NonceStr, res.data.Signature, res.data.AppId);
				}, error => {
					console.log(error);
				});
			
			},
			wxConfig(_timestamp, _nonceStr, _signature, _appId) {
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: _appId, // 必填，公众号的唯一标识
					timestamp: _timestamp, // 必填，生成签名的时间戳
					nonceStr: _nonceStr, // 必填，生成签名的随机串
					signature: _signature, // 必填，签名，见附录1
					jsApiList: ['scanQRCode']
					// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			},
			//查询库存
			getStockList() {
				uni.showLoading();
				let this_ = this;
				console.log("c_id:"+this_.userInfo.c_id);
				this_.$http.httpTokenRequest({
					url: this_.$api.CustStorage + '?c_id=' + this_.userInfo.c_id + '&ma002=' + this_.userInfo.c_ma002 + '&level=' + this_.userInfo.c_level + '&m_id=' + this_.userInfo.c_m_id + '&isonway=' + this_.isonway,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					console.log(res);
					for(let i = 0; i < res.data.length; i++){
						this_.$set(res.data[i], 'isShow', false);
					}
					this_.stockList = res.data;
					uni.hideLoading();
				}, error => {
					console.log(error);
				});
			},
			//查询库存总数量
			getStockTotal(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.CustStorageQty + '?ma002=' + this_.userInfo.c_ma002 + '&level=' + this_.userInfo.c_level + '&m_id=' + this_.userInfo.c_m_id + '&isonway=' + this_.isonway,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					console.log(res);
					this_.stockTotal = res.data;
				}, error => {
					console.log(error);
				});
			},
			flod(list){
				list.isShow = !list.isShow;
			},
			//扫描入库
			scanEnter(){
				let this_ = this;
				console.log(this_.userInfo);
				wx.ready(function() {
					wx.scanQRCode({
						needResult: 1,
						scanType: ["qrCode", "barCode"],
						success: function(res) {
							let urlName = res.resultStr;
							let engineCode = urlName.split("?")[1].split("=")[1];
							this_.addStock(engineCode,0);
						},
						error: function(res) {
							alert("失败："+JSON.stringify(res));
						}
					});
				});
			},
			//搜索
			toSearch(){
				let this_ = this;
				if(this_.keyTxt != ""){
					let str = this_.keyTxt.toUpperCase();
					let arr = [];
					for(let i = 0; i < this_.stockList.length; i++){
						// if(this_.stockList[i].erpcode.indexOf(str) >= 0){
						// 	arr.push(this_.stockList[i]);
						// 	this_.stockList = arr;
						// }else 
						if(this_.stockList[i].spec.indexOf(str) >= 0){
							arr.push(this_.stockList[i]);
							this_.stockList = arr;
						}
					}
				}
			},
			//搜索清空
			getList(e){
				let this_ = this;
				if(e.detail.value == ""){
					this_.getStockList();
				}
			},
			//进货
			tobuy(code){
				uni.navigateTo({
					url:'../tobuy/tobuy?code='+code
				})
			},
			//手动录入
			handEnter(){
				let this_ = this;
				this_.isShow = true;
			},
			//手动录入-提交
			submitAgent(){
				let this_ = this;
				this_.addStock(this_.engineCode,1)
			},
			//取消手动录入
			cancel(){
				let this_ = this;
				this_.engineCode = 'A';
				this.isShow = false;
			},
			//增加库存
			addStock(engineCode,type){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.MotorBind + '?ma002=' + this_.userInfo.c_ma002 + '&level=' + this_.userInfo.c_level + '&m_id=' + this_.userInfo.c_m_id,
					method:'POST',
					data:{code:engineCode},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					console.log(res);
					if(res.data.State){
						this_.engineCode = 'A';
						uni.showModal({
						    title: '温馨提示',
						    content: res.data.Message,
							confirmText: '继续扫描',
						    success: function (res) {
						        if (res.confirm) {
						            wx.ready(function() {
						            	wx.scanQRCode({
						            		needResult: 1,
						            		scanType: ["qrCode", "barCode"],
						            		success: function(res) {
						            			let urlName = res.resultStr;
						            			let engineCode = urlName.split("?")[1].split("=")[1];
						            			this_.addStock(engineCode,0);
						            		},
						            		error: function(res) {
						            			alert("失败："+JSON.stringify(res));
						            		}
						            	});
						            });
						        } else if (res.cancel) {
						            //console.log('用户点击取消');
						        }
						    }
						});
						// if(type == 1){
						// 	this_.isShow = !this_.isShow;
						// }
						this.getStockList();
					}else{
						// uni.showToast({
						// 	icon : "none",
						// 	title : res.data.Message,
						// 	duration:1500
						// })
						this.tiShi = true;
						this.tiShiText = res.data.Message;
						this_.engineCode = "";
						//this_.isShow = !this_.isShow;
					}
					
				},error => {
					//uni.hideLoading();
					// uni.showToast({
					// 	icon : "none",
					// 	title : "入库失败",
					// 	duration:1500
					// })
					this.tiShi = true;
					this.tiShiText = "入库失败";
					console.log(error);
				});
			},
			//置顶
			showTop(obj){
				let this_ = this;
				if(obj.t_top == 1){
					this_.$http.httpTokenRequest({
						url:this_.$api.CustStorage+"?c_id=" + this_.userInfo.c_id,
						method:'POST',
						data:{
							erpcode : obj.erpcode
						},
					}).then(res => {
						//请求成功
						console.log("取消");
						console.log(res);
						if(res.data.State){
							obj.t_top = 0;
						}
					},error => {
						console.log(error);
					});
				}else{
					this_.$http.httpTokenRequest({
						url:this_.$api.CustStorage,
						method:'POST',
						data:{
							c_id : this_.userInfo.c_id,
							erpcode : obj.erpcode
						},
					}).then(res => {
						//请求成功
						console.log("置顶");
						console.log(res);
						if(res.data.State){
							obj.t_top = 1;
						}
					},error => {
						console.log(error);
					});
				}
				
			}
		},
		watch:{
			stockList(){
				this.getStockTotal();
			},
			tiShi(){
				setTimeout(()=>{
					this.tiShi = false;
				},5000);
			}
		}
	}
</script>
<style>
.images{
	height: 180rpx;
	width: 180rpx;
}
.desc{
	margin-left: 30rpx;
}
.size{
	padding: 25rpx 0;
}
.am-list-item{
	margin: 20rpx 30rpx;
	border-bottom: 1px solid #eeeeee;
	padding-bottom: 20rpx;
}
.umar-r{
	margin-right: 15rpx;
}
.code-list{
	width: 100%;
	background-color: #EEEEEE;
	padding: 15rpx 30rpx;
	border-radius: 10rpx;
}
.code-list-item{
	width: 50%;
	float: left;
}
.uinn-t{
	padding-top: 20rpx;
}
.stock-container{
	padding-bottom:60rpx;
}
.booking-btn button{
	height: 24px;
	line-height: 24px;
	font-size: 12px;
}
.am-btn-fixed{
	border-top: 1px solid #CCCCCC;
}
.am-btn-fixed .am-btn{
	height: 42px;
	font-size: 15px;
	border-radius:initial;
	padding: 0 30rpx;
}
.zhiding{
	margin-left: 10rpx;
	color: #FFFFFF;
	/* background-color: #d44242; */
	padding: 0 10rpx;
	border-radius: 10rpx;
	font-size: 12px;
}
.tiShiWrap{
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	display: block;
	background: rgba(60,60,60,.8);
	z-index: 2;
}
.tiShiWrapCon{
	border-radius: 10rpx;
	width: 300rpx;
	height: 100rpx;
	line-height: 100rpx;
	text-align: center;
	color: #FF0000;
	position: absolute;
	font-size: 40rpx;
	left: 50%;
	top:50%;
	margin-left: -150rpx;
	background-color: #FFFFFF;
}
</style>