<template>
	<view class="myorder_container f28">
		<!-- tabItem -->
		<view class="am-fixedBar" ref="tabitem">
			<uni-segmented-control :current="tabIndex" :values="tabItems" @clickItem="onClickTab" style-type="text" active-color="#3079F3"></uni-segmented-control>
		</view>
		<view :style="{marginTop:`${marginTop}px`}" v-if="orderList.length>0">
			<view class="order-list-item ub-box-shadow" v-for="(items,index) in orderList">
				<view class="list-item"><text class="am-text-99">订单号：</text>{{items.s_code}}</view>
				<view class="list-item"><text class="am-text-99">下单时间：</text>{{items.s_create_time}}</view>
				<view class="ub list-item ub-ac">
					<view class="ub ub-f1"><text class="am-text-99">状态：</text><text class="am-text-danger">{{items.s_state}}</text></view>
					<view class="ub ub-f1"><text class="am-text-99">数量：</text>{{items.s_qty}}</view>
					<view class="ub ub-ac ub-pe">
						<button class="f24" @click.stop="scanOut(item)">扫描出库</button>
					</view>
				</view>
				<view style="margin-top: 8rpx;">
					<view class="detail-table">
						<view class="detail-tr">
							<view class="detail-td">商品名称</view>
							<view class="detail-td number">数量</view>
							<view class="detail-td">单价</view>
							<view class="detail-td codenum">发动机号</view>
						</view>
						<view class="detail-tr" v-for="list in items.item">
							<view class="detail-td">{{list.productname}}</view>
							<view class="detail-td number">{{list.i_qty}}</view>
							<view class="detail-td">{{list.currentprice}}</view>
							<view class="detail-td codenum" v-if="list.code !=''&&list.code !=null">
								<view class="td-br" v-for="codList in list.code.split(',')">
									{{codList}}
								</view>
							</view>
							<view class="detail-td codenum" v-else></view>
						</view> 
					</view>
				</view>
				<view class="ub ub-pe am-btn-panel">
					<view class="ub">
						<button class="f24 am-btn-primary" @click="orderOk(item,index)">确认发货</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 上拉加载 start -->
		<uni-load-more :status="status"></uni-load-more>
		<!-- 上拉加载 end -->
	</view>
</template>

<script>
	import wx from '@/common/js/jwweixin.js'
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components:{
			uniSegmentedControl,
			uniLoadMore
		},
		data() {
			return {
				userInfo: {}, //用户信息
				orderList: [], //订单列表
				state : [0,1,2,-1],//全部/待接单/已发货/已收货/已取消
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
				tabItems: ['待接单','已发货','已待收','已取消'],
				tabIndex: 0,
				marginTop: ''
			}
		},
		onLoad() {
			console.log("onload");
			//读取存储数据
			let this_ = this;
			this_.wxInit();
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					this_.userInfo = res.data[0];
					this_.getOrderList();
				}
			});
		},
		mounted() {
			this.marginTop = this.$refs.tabitem.$el.getBoundingClientRect().height;
		},
		//上拉加载
		onReachBottom (){
			if(this.p < this.pageCount){
				this.p++;
				this.status = 'loading';
				this.getOrderList();
			}else{
				this.status = 'noMore';
			}
		},
		methods: {
			//tab切换
			onClickTab(e){ 
				console.log(e);
				let this_ = this;
				if (this_.tabIndex !== e.currentIndex) {
					this_.p = 1;
					this_.tabIndex = e.currentIndex;
					this_.getOrderList();
				}
			},
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

			//获取订单列表
			getOrderList() {
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.CustOrderList + '?c_id=' + '&c_ma001=' + this_.userInfo.c_ma001 + '&state=' +this_.state[this_.tabIndex] + '&nickname=&m_id=' + this_.userInfo.c_m_id +
						'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					//this_.orderList = res.data.rows;
					if(this_.p > 1){
						this_.orderList = this_.orderList.concat(res.data.rows);
					}else{
						this_.orderList = res.data.rows;
					}
					if(0 <= res.data.total < this_.pageSize){
						this_.status = 'noMore';
					}else{
						this_.status = 'more';
					}
					this_.papeTotal(res.data.total);
				}, error => {
					console.log(error);
				});
			},
			proDetail(list) {
				let this_ = this;
				list.item = [];
				this_.$http.httpTokenRequest({
					url: this_.$api.CustOrderItem + '?s_id=' + list.s_id,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					list.item = res.data;
				}, error => {
					console.log(error);
				});
				

			},
			//扫码出库
			scanOut(item) {
				let this_ = this;
				if (item.detail.length > 0) {
					wx.ready(function() {
						wx.scanQRCode({
							needResult: 1,
							scanType: ["qrCode", "barCode"],
							success: function(res) {
								let urlName = res.resultStr;
								let engineCode = urlName.split("?")[1].split("=")[1];
								uni.showLoading();
								this_.$http.httpTokenRequest({
									url:this_.$api.MotorBind + '?s_id=' + item.s_id,
									method:'POST',
									data:{code:engineCode},
								}).then(res => {
									//请求成功
									uni.hideLoading();
									if(res.data.Sate){
										this_.proDetail(item);
									}
									alert(res.data.Message);
								},error => {
									uni.hideLoading();
									alert("扫描出库失败");
									console.log(error);
								});
								
							},
							error: function(res) {
								alert("失败："+JSON.stringify(res));
							}
						});
					});
				} else {
					this_.proDetail(item, 'refresh');
				}
			},
			// scanOut(item) {
			// 	let this_ = this;
			// 	if (item.detail.length > 0) {
			// 		wx.ready(function() {
			// 			wx.scanQRCode({
			// 				needResult: 1,
			// 				scanType: ["qrCode", "barCode"],
			// 				success: function(res) {
			// 					//获取url中engineCode
			// 					//alert(res.resultStr);
			// 					let urlName = res.resultStr;
			// 					if (urlName.split("?").length > 1) {
			// 						let paraArr = urlName.split("?")[1].split("&");
			// 						let engineCode = '';
			// 						for (var i = 0; i < paraArr.length; i++) {
			// 							if (paraArr[i].split("=")[0] == 'engineCode') {
			// 								engineCode = paraArr[i].split("=")[1];
			// 							}
			// 						}
			// 					}
			// 					//判断明细中是否含有code相同的
			// 					let isHas = false;
			// 					/*for(var j=0;j<item.detail.length;j++){
			// 						let codeArr = item.detail[j].code.split(",");
			// 						for(var z=0;z<codeArr.length;z++){
			// 							if(codeArr[z] == engineCode){
			// 								isHas = true;
			// 							}
			// 						}
			// 					}*/
			// 					if(isHas){
			// 						alert("该发动机已扫码");
			// 					}else{
			// 						uni.showLoading();
			// 						this_.$http.httpTokenRequest({
			// 							url:this_.$api.MotorBind + '?s_id=' + item.s_id,
			// 							method:'POST',
			// 							data:{code:engineCode},
			// 						}).then(res => {
			// 							//请求成功
			// 							uni.hideLoading();
			// 							if(res.data.Sate){
			// 								this_.proDetail(item,'refresh');
			// 							}
			// 							alert(res.data.Message);
			// 						},error => {
			// 							uni.hideLoading();
			// 							alert("扫描出库失败");
			// 							console.log(error);
			// 						});
			// 					}

			// 				},
			// 				error: function(res) {
			// 					alert("失败");
			// 					console.log("失败");
			// 					console.log(res);
			// 				}
			// 			});
			// 		});
			// 	} else {
			// 		this_.proDetail(item, 'refresh');
			// 	}
			// },
			//确认发货
			orderOk(item, index) {
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.CustSendOrder,
					method: 'POST',
					data: {
						c_id: item.s_c_id,
						c_tel: this_.userInfo.c_tel,
						c_nickname: this_.userInfo.c_nickname,
						s_id: item.s_id,
						s_code: item.s_code
					},
				}).then(res => {
					if(res.data.State){
						alert(res.data.Message);
						this_.orderList.splice(index, 1);
					}else{
						alert(res.data.Message);
					}
					
				}, error => {
					console.log(error);
				});
			},
			//获取总页数
			papeTotal(rowCount){
				let this_ = this;
				if(rowCount != null && rowCount != ""){
					if(rowCount % this_.pageSize == 0){
						this_.pageCount = parseInt(rowCount / this_.pageSize);
					}else{
						this_.pageCount = parseInt(rowCount / this_.pageSize) + 1;
					}
				}else{
					return 0;
				}
			},
		}
	}
</script>

<style>
	.umar-r{margin-right: 20rpx;}
	.detail-tr:first-child{
		background-color: #EEEEEE;
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
	.codenum{
		width: 38%;
	}
	.td-br{
		word-break: break-all;
	}
</style>
