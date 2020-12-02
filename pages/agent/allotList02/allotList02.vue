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
							<view class="detail-tr ub-ac" v-for="(items) in list.item">
								<view class="detail-td">{{items.i_ma003}}</view>
								<view class="detail-td codenum">
									<view class="ub ub-ac">
										<view class="ub umar-rs">{{items.i_code}}</view>
									</view>
								</view>
							</view>
		 				</view>
					</view>
					<view class="ub am-btn-panel ub-ac">
						<view class="ub ub-f1 ub-pe" v-if="tabIndex == 0">
							<view class="ub">
								<button class="f24 am-btn-primary" @click="orderOk(list,index)">确认收货</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
				state : [2,3],//已发货/确认收货/已取消
				tabItems: ['已发货','确认收货'],
				badge:[0,0],
				tabIndex: 0,
				marginTop: '',
				timer:null,
			}
		},
		onLoad(option) {
			//读取存储数据
			let this_ = this;
			this_.tabIndex = parseInt(option.id);
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
					this_.allotList = [];
					this_.getAllotList();
				}
			},
			
			//查询调拨单列表
			getAllotList() {
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.GetAllocate + '?c_ma001=' + this_.userInfo.c_ma001 + '&m_id='+ this_.userInfo.c_m_id +'&state=' + this_.state[this_.tabIndex] + '&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					this_.allotList = res.data.rows;
				}, error => {
					console.log(error);
				});
			},
			
			//确认收货
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
			//确认收货接口
			confirmAllot(mId,aId,index){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url: this_.$api.AllocateSend + '?a_id=' + aId,
					method: 'POST',
					data: {
						c_nickname: this_.userInfo.c_nickname
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
						if(res.data[i].a_state_no == 2){
							this_.badge[0] = res.data[i].qty;
						}else if(res.data[i].a_state_no == 3){
							this_.badge[1] = res.data[i].qty;
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
