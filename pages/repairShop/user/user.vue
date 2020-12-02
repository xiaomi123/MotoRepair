<template>
	<view>
		<view class="ub ub-ver uinn am-bg-white umar-b">
			<view class="ub ub-ac">
				<view class="ub uinn-r"><image class="userIcon" :src="userInfo.c_headimgurl"></image></view>
				<view class="ub ub-f1 ub-ver">
					<view>{{userInfo.c_nickname}}</view>
					<view class="am-text-99 f26 umar-t">我的积分：
						<text class="f30 am-text-primary uinn-r">{{integral}}</text>
						<text class="am-text-primary" @click="detail()">明细>></text>
					</view>
				</view>
			</view>
		</view>
		<!-- 基本信息 -->
		<view class="umar-a">
			<uni-list class="ub-radius ub-box-shadow">
				<uni-list-item :title="userInfo.c_type == 3 ? '协议客户信息' : '修理厂信息'" thumb="../../../static/images/icon1.png" rightText="查看" @click="auth" />
			</uni-list>
		</view>
		<!-- 我的订单 -->
		<view class="umar-a am-bg-white ub-box-shadow ub-radius umar-b">
			<view class="f30 am-blod am-panel-title ub ub-ac" @click="myOrder">
				<view class="ub ub-f1">我的订单</view>
				<view class="ub ub-pe"><image class="am-icon-arrows" src="../../../static/images/arrows_r.png"></image></view>
			</view>
			<view class="example-body">
				<!-- <uni-grid :column="4" :show-border="false" :square="false" :highlight="false" @change="myOrder"> -->
				<uni-grid :column="4" :show-border="false" :square="false" :highlight="false">
					<uni-grid-item v-if="index < 6" v-for="(item ,index) in list" :index="index" :key="index">
						<view class="grid-item-box" @click="toLink(item)">
							<image class="image" :src="item.url" mode="aspectFill" />
							<text class="text">{{item.text}}</text>
							<view v-if="item.badge" class="grid-dot">
								<uni-badge :text="item.badge" :type="item.type" />
							</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>
		<view class="umar-a am-bg-white ub-box-shadow ub-radius umar-b">
			<view class="f30 am-blod am-panel-title ub ub-ac" @click="myOrder">
				<view class="ub ub-f1">管理</view>
				<view class="ub ub-pe"><image class="am-icon-arrows" src="../../../static/images/arrows_r.png"></image></view>
			</view>
			<view class="example-body">
				<!-- <uni-grid :column="4" :show-border="false" :square="false" :highlight="false" @change="myOrder"> -->
				<uni-grid :column="4" :show-border="false" :square="false" :highlight="false">
					<uni-grid-item v-if="index < 6" v-for="(item ,index) in manageList" :index="index" :key="index">
						<view class="grid-item-box" @click="manageLink(item.linkUrl)">
							<image class="image" :src="item.url" mode="aspectFill" />
							<text class="text">{{item.text}}</text>
							<view v-if="item.badge" class="grid-dot">
								<uni-badge :text="item.badge" :type="item.type" />
							</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>
		<!-- 其他服务 -->
		<!-- <view class="umar-a am-bg-white ub-box-shadow ub-radius umar-b">
			<view class="f30 am-blod am-panel-title ub ub-ac">
				<view class="ub ub-f1">其他服务</view> 
			</view>
			<view class="example-body">
				<uni-grid :column="4" :show-border="false" :square="false" :highlight="false">
					<uni-grid-item v-if="index < 6" v-for="(item ,index) in otherService" :index="index" :key="index">
						<view class="grid-item-box" @click="toLink(item)">
							<image class="image" :src="item.url" mode="aspectFill" />
							<text class="text">{{item.text}}</text>
							<view v-if="item.badge" class="grid-dot">
								<uni-badge :text="item.badge" :type="item.type" />
							</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view> -->
		<!-- 底部导航 -->
		<tabBar :current="currentTabIndex" :options="tabList"></tabBar>
	</view>
</template>

<script>
	import uniGrid from '@/components/uni-grid/uni-grid.vue'
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniBadge from '@/components/uni-badge/uni-badge.vue'
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	
	export default {
		components: {
			uniGrid,
			uniGridItem,
			uniBadge,
			uniList,
			uniListItem
		},
		data() {
			return {
				userInfo : {},
				integral :0,
				list : [{
					url : '../../../static/images/menu1.png',
					text : '待接单',
					badge : '',
					linkUrl:'../order/order',
					id:0
				},{
					url : '../../../static/images/menu2.png',
					text : '已发货',
					badge : '',
					linkUrl:'../order/order',
					id:1
				},{
					url : '../../../static/images/menu3.png',
					text : '已收货',
					badge : '',
					linkUrl:'../order/order',
					id:2
				},{
					url : '../../../static/images/menu4.png',
					text : '已取消',
					badge : '',
					linkUrl:'../order/order',
					id:-1
				}],
				manageList:[
					// {
					// 	url : '../../../static/images/xuyuanchi.png',
					// 	text : '收藏',
					// 	badge : '',
					// 	linkUrl:'../collect/collect'
					// },
					{
						url : '../../../static/images/icon_pj.png',
						text : '评价',
						badge : '',
						linkUrl:'../evalList/evalList?id=0'
					}
					
				],
				otherService : [{ //其他服务
					url : '../../../static/images/icon_order.png',
					text : '投诉',
					badge : '',
					linkUrl:'../../feedBack/complain/complain'
				},{
					url : '../../../static/images/icon_pj.png',
					text : '投诉列表',
					badge : '',
					linkUrl:'../../feedBack/complainRecord/complainRecord'
				}],
				tabList: [
					{
						pagePath : '../index/index',
						iconPath:"../../../static/images/icon_index_bottom01.png",
						selectedIconPath:"../../../static/images/icon_index_bottom11.png",
						text : '首页',
						badge : ''
					},{
						pagePath : '../cart/cart',
						iconPath:"../../../static/images/icon_index_bottom06.png",
						selectedIconPath:"../../../static/images/icon_index_bottom16.png",
						text : '购物车',
						badge : uni.getStorageSync('cartNum'),
						type : uni.getStorageSync('cartNum') == "" ? '' : 'error'
					},{
						pagePath : '../user/user',
						iconPath:"../../../static/images/icon_index_bottom04.png",
						selectedIconPath:"../../../static/images/icon_index_bottom14.png",
						text : '我的',
						badge : ''
					}
				],
				currentTabIndex:2
			}
			
		},
		onLoad(){
			let this_ = this;
			uni.getStorage({
				key:'userInfo',
				success: function(res){
					this_.userInfo = res.data[0];
					this_.integral =  res.data[0].c_integral;
					if(this_.userInfo.c_type == 3){
						this_.tabList[0].pagePath = '../customerIndex/customerIndex';
					}
				}
			})
		},
		onShow(){
			let this_ = this;
			this_.$http.httpTokenRequest({
				url:this_.$api.Integral+'?c_id=' + this_.userInfo.c_id,
				method:'GET',
				data:{},
			}).then(res => {
				//请求成功
				console.log(res.data);
				this_.integral = res.data;
				
			},error => {
				console.log(error);
			});
		},
		methods: {
			//卡片列表跳转
			toLink(item){
				console.log(item);
				let this_ = this;
				uni.navigateTo({
					url : item.linkUrl+"?id="+item.id
				});
			},
			//管理
			manageLink(linkUrl){
				let this_ = this;
				uni.navigateTo({
					url : linkUrl
				});
			},
			//我的订单
			myOrder(e) {
				// let {
				// 	index
				// }=e.detail
				// console.log(index);
				uni.navigateTo({
					url : '../order/order?id=0'
				})
			},
			//厂商订单
			storeOrder(e) {
				let {
					index
				}=e.detail
				uni.navigateTo({
					url : e.linkUrl+"?id="+e.id
				})
				// uni.navigateTo({
				// 	url : '../order/order'
				// })
			},
			//厂商信息
			auth(){
				uni.navigateTo({
					url : '../auth/auth'
				})
			},
			//积分流水
			detail(){
				uni.navigateTo({
					url:'../integral/integral'
				})
			}
		}
	}
</script>

<style>
page{
	background-color: #F8F8F8;
}
.uinn-r{
	padding-right: 28rpx;
}
.umar-t{
	margin-top: 15rpx;
}
.umar-b{
	margin-bottom: 28rpx;
}
.umar-a{
	margin: 24rpx;
}
.example-body {
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	padding: 0;
	font-size: 14px;
}
.grid-item-box {
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0 0 15px;
}
.image {
	width: 80rpx;
	height: 80rpx;
}
.text {
	font-size: 26rpx;
	margin-top: 10rpx;
}
</style>
