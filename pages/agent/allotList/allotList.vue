<template>
	<view class="myorder_container f28">
		<!-- tabItem -->
		<view class="am-fixedBar" ref="tabitem">
			<uni-segmented-control :current="tabIndex" :values="tabItems" :badge="badge" @clickItem="onClickTab" style-type="text" active-color="#3079F3"></uni-segmented-control>
		</view>
		<view :style="{marginTop:`${marginTop}px`}">
			<view class="order-list-item ub-box-shadow" v-for="(list,index) in allotList">
				<view class="list-item ub ub-ac am-bg-active am-text-white order-uinn">
					<view class="ub ub-f1">订单号：{{list.a_code}}</view>
				</view>
				<view class="order-uinn">
					<view class="list-item umar-b"><text class="am-text-99">修理厂名称：</text>{{list.m_name}}</view>
					<view class="list-item umar-b"><text class="am-text-99">收货地址：</text>{{list.m_prov + ' ' + list.m_city + ' ' + list.m_address}}</view>
					<view style="margin-top: 8rpx;">
						<view class="detail-table">
							<view class="detail-tr no-ubb" v-if="list.item.length>0">
								<view class="detail-td">商品名称</view>
								<view class="detail-td codenum">发动机号</view>
							</view>
							<view class="detail-tr ub-ac" v-for="(items,index02) in list.item">
								<view class="detail-td">{{items.i_ma003}}</view>
								<view class="detail-td codenum">
									<view class="ub ub-ac" @click="delCode(items,index02,list)">
										<view class="ub umar-rs">{{items.i_code}}</view>
										<image src="../../../static/images/del.png" class="ub icon-del" v-if="tabIndex == 0"></image>
									</view>
								</view>
							</view>
		 				</view>
					</view>
					<view class="ub am-btn-panel ub-ac">
						<view class="ub ub-f1 ub-pe" v-if="tabIndex == 0">
							<!-- <view class="ub umar-r">
								<button class="f24 am-btn-danger" @click="scanOut(list)">扫描出库</button>
							</view>
							<view class="ub umar-r">
								<button class="f24 am-btn-primary" @click="orderOk(list,index)">确认发货</button>
							</view> -->
							<view class="ub">
								<button class="f24" @click="delAllot(list,index)">删除</button>
							</view>
						</view>
						<view class="ub ub-f1 ub-pe" v-if="tabIndex == 1">
							<view class="ub">
								<button class="f24 am-btn-danger" @click="cancelAllot(list,index)">取消订单</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
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
				allotList: [], //订单列表
				pageSize:10,
				pageCount: '',
				p:1,
				total : 0,
				status:'more',
				state : [1,2,3,-1],//出库中/已发货/确认收货/已取消
				tabItems: ['出库中','已发货','确认收货','已取消'],
				badge:[0,0,0,0],
				tabIndex: 0,
				marginTop: '',
				timer:null,
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
					this_.getAllotList();
					this_.getAllotQty();//获取tab不同状态数量
					//每隔5秒刷新
					this_.timer = setInterval(function() {
						this_.getAllotQty();//获取数字
					}, 5000);
				}
			});
		},
		onUnload(){
			let this_ = this;
			if(this_.timer){
				clearInterval(this_.timer);  
				this_.timer = null; 
			}
		},
		mounted() {
			this.marginTop = this.$refs.tabitem.$el.getBoundingClientRect().height;
		},
		//上拉加载
		onReachBottom (){
			if(this.p < this.pageCount){
				this.p++;
				this.status = 'loading';
				this.getAllotList();
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
					this_.getAllotList();
				}
			},
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

			//查询调拨单列表
			getAllotList() {
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.GetAllocate + '?c_ma001=' + this_.userInfo.c_ma001 + '&m_id=&state=' + this_.state[this_.tabIndex] + '&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					this_.allotList = res.data.rows;
				}, error => {
					console.log(error);
				});
			},
			
			//调拨---扫码出库
			scanOut(list) {
				let this_ = this;
				//let engineCode = 'A0890329191193';
				wx.ready(function() {
					wx.scanQRCode({
						needResult: 1,
						scanType: ["qrCode", "barCode"],
						success: function(res) {
							let urlName = res.resultStr;
							let engineCode = urlName.split("?")[1].split("=")[1];
							for(let i=0;i<list.item.length;i++){
								if(list.item[i].i_code == engineCode){
									uni.showToast({
										icon : 'none',
										title : '该发动机号已扫描',
										duration:1500
									});
									return false;
								}
							}
							uni.showLoading();
							this_.$http.httpTokenRequest({
								url:this_.$api.AddAllocate + '?a_id=' + list.a_id,
								method:'POST',
								data:{code:engineCode},
							}).then(res => {
								//请求成功
								uni.hideLoading();
								uni.showToast({
									icon : 'none',
									title : res.data.Message,
									duration:1500
								});
								if(res.data.State){
									setTimeout(function(){
										this_.allotDetail(list);
									},1500);
								}
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
				
			},
			//刷新已绑定识别码api/AddAllocate?a_id=
			allotDetail(list){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.AddAllocate + '?a_id=' + list.a_id,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					list.item = res.data;
				},error => {
					uni.hideLoading();
					alert("扫描出库失败");
					console.log(error);
				});
			},
			
			//删除发动机号
			delCode(item,index,list){
				let this_ = this;
				if(this_.tabIndex == 0){
					uni.showModal({
						title: '温馨提示',
						content: '确定要删除该发动机号吗？',
						success: function (res) {
							if (res.confirm) {
								uni.showLoading();
								this_.$http.httpTokenRequest({
									url: this_.$api.MotorClear + '?a_id=' + list.a_id,
									method: 'POST',
									data: {
										i_code:item.i_code
									},
								}).then(res => {
									uni.hideLoading();
									if(res.data.State){
										list.item.splice(index,1);
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
				}
			},
			
			//确认发货
			orderOk(list,index) {
				let this_ = this;
				if(list.item.length>0){
					uni.showModal({
						title: '温馨提示',
						content: '是否确认发货？',
						success: function (res) {
							if (res.confirm) {
								this_.confirmAllot(list.a_m_id,list.a_id,index);
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
			confirmAllot(mId,aId,index){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url: this_.$api.AllocateSend,
					method: 'POST',
					data: {
						c_ma001: this_.userInfo.c_ma001,
						c_ma002: this_.userInfo.c_ma002,
						c_tel: this_.userInfo.c_tel,
						c_nickname: this_.userInfo.c_nickname,
						m_id: mId,
						a_id: aId,
					},
				}).then(res => {
					uni.hideLoading();
					if(res.data.State){
						setTimeout(function(){
							this_.allotList.splice(index,1);
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
			
			//删除调拨单
			delAllot(list,index){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.DelAllocate ,
					method: 'POST',
					data: {
						"a_id":list.a_id,
					},
				}).then(res => {
					//请求成功
					if(res.data.State){
						uni.showToast({
							icon : 'none',
							title : "删除成功！",
							duration:1500
						});
						setTimeout(function(){
							this_.allotList.splice(index,1);//删除
						},1500);
					}
				}, error => {
					console.log(error);
				});
			},
			
			//取消调拨单
			cancelAllot(list,index){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.DelAllocate + '?a_id=' + list.a_id,
					method: 'POST',
					data: {
						"c_ma002":this_.userInfo.c_ma002,
						"c_nickname":this_.userInfo.c_nickname
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
							this_.allotList.splice(index,1);
						},1500);
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
			
			//获取tab状态数量
			getAllotQty(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.GetAllocate+'?c_ma001='+ this_.userInfo.c_ma001 +'&m_id=' + this_.userInfo.c_m_id,
					method:'GET',
					data:{},
				}).then(res => {
					for(let i=0;i<res.data.length;i++){
						if(res.data[i].a_state_no == 1){
							this_.badge[0] = res.data[i].qty;
						}else if(res.data[i].a_state_no == 2){
							this_.badge[1] = res.data[i].qty;
						}else if(res.data[i].a_state_no == 3){
							this_.badge[2] = res.data[i].qty;
						}else if(res.data[i].a_state_no == -1){
							this_.badge[3] = res.data[i].qty;
						}
					}
					this_.$set(this_.badge,true);
					
				},error => {
					console.log(error);
				});
			},
			
			
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
</style>
