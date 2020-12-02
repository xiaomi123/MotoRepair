<template>
	<view class="myorder-container f28">
		<!-- 主要内容开始 -->
		<view>
			<view class="order-list-item ub-box-shadow" v-for="(items,index) in orderList">
				<view class="list-item ub ub-ac am-bg-active am-text-white order-uinn">
					<view class="ub ub-f1">发货仓库：{{items.o_storage}}</view>
					<view class="ub">{{items.o_state}}</view>
				</view>
				<view class="order-uinn">
					<view class="list-item umar-b"><text class="am-text-99">订单号：</text>{{items.o_code}}</view>
					<view class="list-item umar-b"><text class="am-text-99">备注：</text>{{items.o_note}}</view>
					<view style="margin-top: 8rpx;">
						<view class="detail-table" v-if="items.item.length>0">
							<view class="detail-tr no-ubb">
								<view class="detail-td">商品名称</view>
								<view class="detail-td number">数量</view>
								<view class="detail-td">单价</view>
							</view>
							<view class="detail-tr ub-ac" v-for="list in items.item.slice(0, 5)" v-if="!items.isMore">
								<view class="detail-td">{{list.title}}</view>
								<view class="detail-td number">{{list.i_qty}}</view>
								<view class="detail-td price">{{parseInt(list.i_price)}}</view>
							</view> 
							<view class="detail-tr ub-ac" v-for="list in items.item" v-if="items.isMore">
								<view class="detail-td">{{list.title}}</view>
								<view class="detail-td number">{{list.i_qty}}</view>
								<view class="detail-td price">{{parseInt(list.i_price)}}</view>
							</view> 
							<view class="detail-tr" v-if="items.isMore">
								<view class="detail-td" style="width: 50%;">合计：<text class="am-blod">{{items.o_qty}}</text></view>
								<view class="detail-td" style="width: 50%;">总价：<text class="am-blod">{{items.priceTotal}}</text></view>
							</view>
							<view class="order_more" @click="toMore(items,index)" v-if="!items.isMore">查看全部<text class="iconfont">&#xe620;</text></view>
						</view>
					</view>
					<view class="ub am-btn-panel ub-ac">
						<view class="ub umar-r am-text-99">下单时间：{{items.o_create_time}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 主要内容结束 -->
		
		<!-- 上拉加载 start -->
		<uni-load-more :status="status"></uni-load-more>
		<!-- 上拉加载 end -->
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	export default {
		components:{
			uniLoadMore,
			uniPopup,
			uniSteps
		},
		data() {
			return {
				userInfo:{},//用户信息
				orderList:[],
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
			}
		},
		onLoad() {
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					this_.getOrderList();
			    }
			});
		},
		onUnload(){
			this.p = 1;
			this.orderList = [];
			this.status = 'more';
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
				let this_ = this;
				if (this_.tabIndex !== e.currentIndex) {
					this_.p = 1;
					this_.tabIndex = e.currentIndex;
					this_.getOrderList();
				}
			},
			
			//详情弹层tab切换
			onClickTab02(e,list){
				let this_ = this;
				if (list.tabIndex !== e.currentIndex) {
					list.tabIndex = e.currentIndex;
				}
			},
			
			//获取订单列表
			getOrderList(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.OrderList+'?sdt=&edt=&c_ma001='+ this_.userInfo.c_ma001 +'&c_ma002=&state=-1&pageindex='+ this_.p +'&pagesize=' + this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					console.log(res);
					uni.hideLoading();
					for(let i = 0; i < res.data.rows.length; i++){
						this_.$set(res.data.rows[i],'priceTotal',0);
						if(res.data.rows[i].item.length>5){
							this_.$set(res.data.rows[i],'isMore',false);
						}else{
							this_.$set(res.data.rows[i],'isMore',true);
						}
						let item = res.data.rows[i].item;
						for(let m = 0; m < item.length; m++){
							res.data.rows[i].priceTotal += item[m].i_qty * item[m].i_price;
						}
					}
					//请求成功
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
				},error => {
					console.log(error);
				});
			},
			
			
			
			//查看全部
			toMore(item,index){
				let this_ = this;
				item.isMore = true;
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
	.detail-tr:first-child,.detail-tr:last-child{
		background-color: #EEEEEE;
	}
	.detail-table{
		border-left:1px solid #ddd;
	}
	.detail-td{
		-webkit-box-flex: inherit;
		-webkit-flex: inherit;
		flex: inherit;
		width: 44%;
		font-size: 24rpx;
	}
	.number{
		width: 12%;
	}
	.price{
		width: 22%;
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
	.order_more{
		padding:4rpx;
		text-align: center;
	}
	.order_more text.iconfont{
		display: inline-block;
		margin-left: 10rpx;
		font-size: 28rpx;
	}
	.myOrder-uinn{
		background-color: #6290dc;
		border-top-right-radius: 16rpx;
		border-top-left-radius: 16rpx;
	}
</style>
