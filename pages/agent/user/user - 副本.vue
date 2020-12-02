<template>
	<view class="user-container">
		<!-- 生成二维码内容开始 -->	
		<view class="canvas" style="width:0;height:0;">
			<uni-qrcode cid="qrcode" :text="qrcodeText" :size="qrcodeSize" :logo="userInfo.c_headimgurl" ref="qrcode" @makeComplete="qrcodeComplete" />
			<uni-popup ref="showimage" type="center" :mask-click="true">
				<view class="uni-image">
					<image class="image-box" :src="qrcodeSrc" mode="scaleToFill" />
					<view class="uni-image-close" @click="cancelModal()">
						<uni-icons type="clear" color="#fff" size="30" />
					</view>
				</view>
			</uni-popup>
		</view>
		<!-- 生成二维码内容结束 -->
		
		<view class="ub ub-ver uinn am-bg-white umar-b">
			<view class="ub ub-ac">
				<view class="ub uinn-r"><image class="userIcon" :src="userInfo.c_headimgurl"></image></view>
				<view class="ub ub-f1 ub-ac">
					<view class="ub ub-f1 ub-ver">
						<view>{{userInfo.c_nickname}}</view>
						<!-- <view class="am-text-99 f26 umar-t">我的积分：<text class="f30 am-text-primary">{{userInfo.c_integral}}</text></view> -->
					</view>
					<view class="ub"><image class="am-icon-qcrode" src="../../../static/images/qrcode.png" @click="qrCode()"></image></view>
				</view>
			</view>
		</view>
		<!-- 基本信息 -->
		<!-- <view class="umar-a">
			<uni-list class="ub-radius ub-box-shadow ">
				<uni-list-item title="绑定手机号" thumb="../../../static/images/icon2.png" @click="bindMobile" />
			</uni-list>
		</view> -->
		<!-- 我的订单 -->
		<view class="umar-a am-bg-white ub-box-shadow ub-radius umar-b" v-if="userInfo.c_level != '2'">
			<view class="f30 am-blod am-panel-title ub ub-ac">
				<view class="ub ub-f1">进货计划</view>
				<!-- <view class="ub ub-pe"><image class="am-icon-arrows" src="../../../static/images/arrows_r.png"></image></view> -->
			</view>
			<view class="example-body">
				<uni-grid :column="4" :show-border="false" :square="false" :highlight="false" @change="myOrder">
					<uni-grid-item v-if="index < 6" v-for="(item ,index) in list" :index="index" :key="index">
						<view class="grid-item-box">
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
		<!-- 厂商订单 -->
		<view class="umar-a am-bg-white ub-box-shadow ub-radius umar-b">
			<view class="f30 am-blod am-panel-title ub ub-ac">
				<view class="ub ub-f1">修理厂订单</view>
				<!-- <view class="ub ub-pe"><image class="am-icon-arrows" src="../../../static/images/arrows_r.png"></image></view> -->
			</view>
			<view class="example-body">
				<uni-grid :column="4" :show-border="false" :square="false" :highlight="false">
					<uni-grid-item v-if="index < 6" v-for="(item ,index) in storeList" :index="index" :key="index">
						<view class="grid-item-box" @click="storeOrder(item)">
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
		<!-- 管理 -->
		<view class="umar-a am-bg-white ub-box-shadow ub-radius umar-b">
			<view class="f30 am-blod am-panel-title ub ub-ac">
				<view class="ub ub-f1">管理</view>
				<!-- <view class="ub ub-pe"><image class="am-icon-arrows" src="../../../static/images/arrows_r.png"></image></view> -->
			</view>
			<view class="example-body">
				<uni-grid :column="4" :show-border="false" :square="false" :highlight="false" @change="manangeChange">
					<uni-grid-item v-if="index < 10" v-for="(item ,index) in manageList" :index="index" :key="index">
						<view class="grid-item-box">
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
		<!-- 底部导航 -->
		<tabBar :current="currentTabIndex" :column="tabNum" :options="tabList"></tabBar>
	</view>
</template>

<script>
	import uniQrcode from '@/components/uni-qrcode/uni-qrcode'
	import uniGrid from '@/components/uni-grid/uni-grid.vue'
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniBadge from '@/components/uni-badge/uni-badge.vue'
	import uniList from "@/components/uni-list/uni-list.vue"
	import uniListItem from "@/components/uni-list-item/uni-list-item.vue"
	
	export default {
		components: {
			uniQrcode,
			uniGrid,
			uniGridItem,
			uniBadge,
			uniList,
			uniListItem
		},
		data() {
			return {
				userInfo: {},
				qrcodeText: '',
				qrcodeSize: 200,
				qrcodeSrc: '',
				list : [{
					url : '../../../static/images/menu1.png',
					text : '待处理',
					badge : ''
				},{
					url : '../../../static/images/menu2.png',
					text : '已处理',
					badge : ''
				},{
					url : '../../../static/images/menu3.png',
					text : '已收货',
					badge : ''
				},{
					url : '../../../static/images/menu4.png',
					text : '已取消',
					badge : ''
				}],
				storeList : [{
					url : '../../../static/images/menu1.png',
					text : '待接单',
					badge : '',
					linkUrl:'../reporder/reporder',
					id:0
				},{
					url : '../../../static/images/menu2.png',
					text : '已发货',
					badge : '',
					linkUrl:'../reporder/reporder',
					id:1
				},{
					url : '../../../static/images/menu3.png',
					text : '已收货',
					badge : '',
					linkUrl:'../reporder/reporder',
					id:2
				},{
					url : '../../../static/images/menu4.png',
					text : '已取消',
					badge : '',
					linkUrl:'../reporder/reporder',
					id:-1
				}],
				manageList : [{
					url : '../../../static/images/menu6.png',
					text : '收藏',
					badge : '',
					linkUrl:'../collect/collect'
				},{
					url : '../../../static/images/menu7.png',
					text : '客户管理',
					badge : '',
					linkUrl:'../newrepair/newrepair'
				},{
					url : '../../../static/images/menu3.png',
					text : '库存',
					badge : '',
					linkUrl:'../stock/stock'
				}
				// ,{
				// 	url : '../../../static/images/menu9.png',
				// 	text : '售后',
				// 	badge : '',
				// 	linkUrl:'../stock/stock'
				// }
				,{
					url : '../../../static/images/menu5.png',
					text : '评价',
					badge : '',
					linkUrl:'../evalList/evalList'
				},{
					url : '../../../static/images/menu5.png',
					text : '留言管理',
					badge : '',
					linkUrl:'../messageList/messageList'
				}],
				tabList: [
					{
						pagePath : '../index/index',
						iconPath:"../../../static/images/icon_index_bottom01.png",
						selectedIconPath:"../../../static/images/icon_index_bottom11.png",
						text : '首页',
						badge : ''
					},{
						pagePath : '../customer/customer',
						iconPath:"../../../static/images/icon_index_bottom05.png",
						selectedIconPath:"../../../static/images/icon_index_bottom15.png",
						text : '客户',
						badge : ''
					},{
						pagePath : '../user/user',
						iconPath:"../../../static/images/icon_index_bottom04.png",
						selectedIconPath:"../../../static/images/icon_index_bottom14.png",
						text : '我的',
						badge : ''
					}
				],
				tabNum:3,
				currentTabIndex:3
			}
			
		},
		onLoad(){
			let this_ = this;
			uni.getStorage({
				key:'userInfo',
				success: function(res){
					console.log(res);
					this_.userInfo = res.data[0];
					if(this_.userInfo.c_level == 1){
						this_.tabList.splice(1,0,{
							pagePath : '../tobuy/tobuy',
							iconPath:"../../../static/images/icon_index_bottom06.png",
							selectedIconPath:"../../../static/images/icon_index_bottom16.png",
							text : '进货',
							badge : ''
						});
						this_.tabNum = 4;
					}
					this_.qrcodeText = 'http://gao.vocen.cn:2345/#/pages/QRCode?ma001='+ res.data[0].c_ma001 +'&type=1&m_id='+ res.data[0].c_m_id;
					//判断是否是二级代理商，二级代理商c_level为2
					if(this_.userInfo.c_level == '2'){
						this_.manageList.splice(2,0,{url : '../../../static/images/menu4.png',text : '查看调拨',badge : '',linkUrl:'../allotList02/allotList02?id=0'});
					}else{
						this_.manageList.splice(2,0,{url : '../../../static/images/menu8.png',text : '经销商',badge : '',linkUrl:'../dealer/dealer'});
						this_.manageList.splice(3,0,{url : '../../../static/images/menu4.png',text : '查看调拨',badge : '',linkUrl:'../allotList/allotList'});
					}
				},
				fail:function(){
					console.log("--------fail-----");
				}
			})
		},
		onBackPress() {
			this.$refs['showimage'].close()
		},
		methods: {
			//我的订单
			myOrder(e) {
				let {
					index
				}=e.detail
				console.log(index);
				uni.navigateTo({
					url : '../myorder/myorder'
				})
			},
			//修理厂订单
			storeOrder(e) {
				uni.navigateTo({
					url : e.linkUrl+"?id="+e.id
				})
			},
			//管理
			manangeChange(e){
				let this_ = this;
				let {
					index
				}=e.detail
				console.log(index);
				uni.navigateTo({
					url : this_.manageList[index].linkUrl
				})
			},
			//生成二维码
			qrCode(){
				let this_ = this;
				uni.showLoading({
					title: '二维码生成中',
					mask: true
				});
				this_.$refs.qrcode.make();
			},
			qrcodeComplete(e) {
				this.qrcodeSrc = e;
				this.$refs['showimage'].open();
				uni.hideLoading();
			},
			//关闭二维码弹窗
			cancelModal() {
				this.$refs['showimage'].close()
			},
			//绑定手机号
			// bindMobile(){
			// 	uni.navigateTo({
			// 		url : '../mobile/mobile'
			// 	})
			// }
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
uni-canvas>canvas{
	display: none;
}
</style>
