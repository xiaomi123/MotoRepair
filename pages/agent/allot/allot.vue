<template>
	<view class="myorder_container f28">
		<view>
			<view class="order-list-item ub-box-shadow">
				<view class="list-item ub ub-ac am-bg-active am-text-white order-uinn">
					<view class="ub ub-f1">订单号：{{allotCode}}</view>
					<view class="ub">{{allotState}}</view>
				</view>
				<view class="order-uinn">
					<view class="list-item umar-b"><text class="am-text-99">修理厂名称：</text>{{mName}}</view>
					<view class="list-item umar-b"><text class="am-text-99">收货地址：</text>{{mAddress}}</view>
					<view style="margin-top: 8rpx;">
						<view class="detail-table">
							<view class="detail-tr no-ubb" v-if="allotList.length>0">
								<view class="detail-td">商品名称</view>
								<view class="detail-td codenum">发动机号</view>
							</view>
							<view class="detail-tr ub-ac" v-for="(list,index) in allotList">
								<view class="detail-td">{{list.i_ma003}}</view>
								<view class="detail-td codenum">
									<view class="ub ub-ac" @click="delCode(list,index)" :ref="index">
										<view class="ub umar-rs">{{list.i_code}}</view>
										<image src="../../../static/images/del.png" class="ub icon-del"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="ub am-btn-panel ub-ac">
						<view class="ub ub-f1 ub-pe">
							<view class="ub umar-r">
								<button class="f24 am-btn-danger uinn-a1" @click="handOut()">手动出库</button>
							</view>
							<view class="ub umar-r">
								<button class="f24 am-btn-danger uinn-a1" @click="scanOut()">扫描出库</button>
							</view>
							<view class="ub umar-r">
								<button class="f24 am-btn-primary uinn-a1" @click="orderOk()">确认发货</button>
							</view>
							<view class="ub">
								<button class="f24 uinn-a1" @click="cancelAllot()">删除</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
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
				allotList: [], //订单列表
				allotCode:'',//单号
				aId:'',//aId
				mId:'',//m_id
				mName:'',//名称
				mAddress:'',//地址
				allotState:'',//状态
				isShow : false, //是否显示手动录入窗口
				engineCode : "A",//发动机编码
				tiShi: false,
				tiShiText: ''
			}
		},
		onLoad(option) {
			//读取存储数据
			let this_ = this;
			this_.wxInit();
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					this_.userInfo = res.data[0];
					this_.mId = option.m_id;
					this_.mName = option.m_name;
					this_.mAddress = option.m_address;
					this_.getAllot();
				}
			});
		},
		watch:{
			tiShi(){
				setTimeout(()=>{
					this.tiShi = false;
				},5000);
			}
		},
		methods: {
			//微信
			wxInit() {
				let this_ = this;
				let _data = {
					url: 'http://gao.vocen.cn:8044/',
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
			
			//查询调拨单
			getAllot(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.GetAllocate + "?m_id=" + this_.mId,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					console.log(res.data.length);
					if(res.data.length>0){
						this_.mId = res.data[0].a_m_id;
						this_.aId = res.data[0].a_id;
						this_.allotCode = res.data[0].a_code;
						this_.allotState = res.data[0].a_state;
						this_.allotList = res.data[0].item;
					}else{
						this_.getAllotCode();
					}
				}, error => {
					console.log(error);
				});
			},

			//添加调拨单----获取单号
			getAllotCode() {
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.AddAllocate ,
					method: 'POST',
					data: {
						"c_id":this_.userInfo.c_id,
						"c_ma001":this_.userInfo.c_ma001,
						"m_id":this_.mId
					},
				}).then(res => {
					//请求成功
					if(res.data.State){
						this_.allotCode = res.data.centent.split(",")[0];
						this_.aId = res.data.centent.split(",")[1];
					}
				}, error => {
					console.log(error);
				});
			},
			//删除调拨单
			cancelAllot(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.DelAllocate ,
					method: 'POST',
					data: {
						"a_id":this_.aId,
					},
				}).then(res => {
					//请求成功
					if(res.data.State){
						uni.showToast({
							icon : 'none',
							title : "取消成功！",
							duration:1500
						});
						setTimeout(function(){
							uni.navigateTo({
								url : '../dealer/dealer',
							})
						},1500);
					}
				}, error => {
					console.log(error);
				});
			},
			//调拨---扫码出库
			scanOut() {
				let this_ = this;
				wx.ready(function() {
					wx.scanQRCode({
						needResult: 1,
						scanType: ["qrCode", "barCode"],
						success: function(res) {
							let urlName = res.resultStr;
							let engineCode = urlName.split("?")[1].split("=")[1];
							this_.addEngineCode(engineCode,0);
						},
						error: function(res) {
							alert("失败："+JSON.stringify(res));
						}
					});
				});
				
			},
			addEngineCode(engineCode,type){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.AddAllocate + '?a_id=' + this_.aId,
					method:'POST',
					data:{code:engineCode},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					console.log(res);
					if(res.data.State){
						this_.engineCode = 'A';
						if(type == 0){ //扫描
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
							            			this_.addEngineCode(engineCode,0);
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
						}
						this_.allotDetail();
					}else{
						this.tiShi = true;
						this.tiShiText = res.data.Message;
						this_.engineCode = "A";
					}
				},error => {
					uni.hideLoading();
					this.tiShi = true;
					this.tiShiText = "出库失败";
					console.log(error);
				});
			},
			//刷新已绑定识别码api/AddAllocate?a_id=
			allotDetail(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.AddAllocate + '?a_id=' + this_.aId,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					this_.allotList = res.data;//追加一行
				},error => {
					uni.hideLoading();
					alert("扫描出库失败");
					console.log(error);
				});
			},
			
			//删除发动机号
			delCode(list,index){
				let this_ = this;
				uni.showModal({
					title: '温馨提示',
					content: '确定要删除该发动机号吗？',
					success: function (res) {
						if (res.confirm) {
							uni.showLoading();
							this_.$http.httpTokenRequest({
								url: this_.$api.MotorClear + '?a_id=' + this_.aId,
								method: 'POST',
								data: {
									i_code:list.i_code
								},
							}).then(res => {
								uni.hideLoading();
								if(res.data.State){
									this_.allotList.splice(index,1);
								}
								uni.showToast({
									icon : 'none',
									title : res.data.Message,
									duration:1500
								});
								
							}, error => {
								console.log(error);
							});
							
						} else if (res.cancel) {
							//console.log('用户点击取消');
						}
					}
				});
				
			},
			
			//确认发货
			orderOk() {
				let this_ = this;
				if(this_.allotList.length>0){
					uni.showModal({
						title: '温馨提示',
						content: '是否确认发货？',
						success: function (res) {
							if (res.confirm) {
								this_.confirmAllot();
							} else if (res.cancel) {
								//console.log('用户点击取消');
							}
						}
					});
				}else{
					uni.showToast({
						icon : 'none',
						title : "未扫描绑定发动机识别码,请先扫描出库",
						duration:1500
					});
				}
			},
			//确认发货接口
			confirmAllot(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url: this_.$api.AllocateSend,
					method: 'POST',
					data: {
						c_ma001:this_.userInfo.c_ma001,
						c_ma002:this_.userInfo.c_ma002,
						c_tel:this_.userInfo.c_tel,
						c_nickname:this_.userInfo.c_nickname,
						m_id:this_.mId,
						a_id: this_.aId,
					},
				}).then(res => {
					uni.hideLoading();
					if(res.data.State){
						setTimeout(function(){
							uni.navigateTo({
								url : '../allotList/allotList',
							})
						},1500);
					}
					uni.showToast({
						icon : 'none',
						title : res.data.Message,
						duration:1500
					});
					
				}, error => {
					console.log(error);
				});
			},
			//手动出库
			handOut(){
				let this_ = this;
				this_.isShow = true;
			},
			//手动录入-提交
			submitAgent(){
				let this_ = this;
				this_.addEngineCode(this_.engineCode,1);
			},
			//取消手动录入
			cancel(){
				let this_ = this;
				this_.engineCode = 'A';
				this.isShow = false;
			}
		}
	}
</script>

<style>
	.umar-r{margin-right: 20rpx;}
	.detail-tr:first-child{
		background-color: #EEEEEE;
	}
	.detail-table{
		border-left:1px solid #ddd;
	}
	.detail-td{
		-webkit-box-flex: inherit;
		-webkit-flex: inherit;
		flex: inherit;
		width: 25%;
		font-size: 24rpx;
	}
	.number{
		width: 12%;
	}
	.price{
		width: 22%;
	}
	.codenum{
		width: 41%;
	}
	.td-br{
		word-break: break-all;
	}
	.icon-del{
		width: 35rpx;
		height: 35rpx;
	}
	.umar-rs{
		margin-right: 8rpx;
	}
	.uinn-a1{
		padding: 0 25rpx;
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
