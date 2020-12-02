<template>
	<view class="user-container">
		<!-- 生成二维码内容开始 -->	
		<view class="canvas" style="width:0;height:0;">
			<uni-qrcode cid="qrcode1" :text="qrcodeText" :size="qrcodeSize" :logo="userInfo.c_headimgurl" ref="qrcode" @makeComplete="qrcodeComplete" />
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
			</view>
			<view class="example-body">
				<uni-grid :column="4" :show-border="false" :square="false" :highlight="false">
					<uni-grid-item v-if="index < 6" v-for="(item ,index) in jihuoPlant" :index="index" :key="index">
						<view class="grid-item-box" @click="myOrder(item)">
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
			<view class="am-avg-2">
				<view class="f30 am-blod am-panel-title ub ub-ac">
					<view class="ub ub-f1">经销商</view>
				</view>
				<view class="example-body">
					<uni-grid :column="4" :show-border="false" :square="false" :highlight="false" @change="manangeChange">
						<uni-grid-item class="ub-f1" v-if="index < 10" v-for="(item ,index) in manageList" :index="index" :key="index">
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
			<view class="am-avg-2" style="border-left: 1px solid #EEEEEE;">
				<view class="f30 am-blod am-panel-title ub ub-ac">
					<view class="ub ub-f1">协议客户</view>
				</view>
				<view class="example-body">
					<uni-grid :column="4" :show-border="false" :square="false" :highlight="false" @change="customerNav">
						<uni-grid-item class="ub-f1" v-if="index < 10" v-for="(item ,index) in agreeCustomer" :index="index" :key="index">
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
		</view>	
		<!-- 厂商订单 -->
		<view class="umar-a am-bg-white ub-box-shadow ub-radius umar-b">
			<view class="f30 am-blod am-panel-title ub ub-ac">
				<view class="ub ub-f1">修理厂信息</view> 
			</view>
			<view class="example-body">
				<uni-grid :column="4" :show-border="false" :square="false" :highlight="false">
					<uni-grid-item v-if="index < 6" v-for="(item ,index) in repairList" :index="index" :key="index">
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
		<!-- 其他服务 -->
		<!-- <view class="umar-a am-bg-white ub-box-shadow ub-radius umar-b">
			<view class="f30 am-blod am-panel-title ub ub-ac">
				<view class="ub ub-f1">其他服务</view> 
			</view>
			<view class="example-body">
				<uni-grid :column="4" :show-border="false" :square="false" :highlight="false">
					<uni-grid-item v-if="index < 6" v-for="(item ,index) in otherService" :index="index" :key="index">
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
		</view> -->
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
				jihuoPlant : [{
					url : '../../../static/images/icon_kc.png',
					text : '库存',
					badge : '',
					linkUrl : '../stock/stock?type=0'
				}],
				repairList : [{
					url : '../../../static/images/icon_xlc.png',
					text : '客户资料',
					badge : '',
					linkUrl:'../newrepair/newrepair'
				},{
					url : '../../../static/images/icon_order.png',
					text : '订单',
					badge : '',
					linkUrl:'../reporder/reporder?id=0&type=0'
				},{
					url : '../../../static/images/icon_pj.png',
					text : '评价',
					badge : '',
					linkUrl:'../evalList/evalList'
				}],
				manageList : [],
				agreeCustomer : [{
					url : '../../../static/images/icon_jxs.png',
					text : '客户资料',
					badge : '',
					linkUrl:'../agreeCustomer/agreeCustomer'
				},{
					url : '../../../static/images/icon_order.png',
					text : '订单',
					badge : '',
					linkUrl:'../reporder/reporder?id=0&type=1'
				}],
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
						pagePath : '../customer/customer',
						iconPath:"../../../static/images/icon_index_bottom05.png",
						selectedIconPath:"../../../static/images/icon_index_bottom15.png",
						text : '代客下单',
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
				currentTabIndex:2
			}
			
		},
		onLoad(){
			let this_ = this;
			uni.getStorage({
				key:'userInfo',
				success: function(res){
					console.log(res);
					this_.userInfo = res.data[0];
					if(this_.userInfo.c_level == 1 && this_.userInfo.c_admin == 1){
						this_.tabList.splice(1,0,{
							pagePath : '../tobuy/tobuy',
							iconPath:"../../../static/images/icon_index_bottom06.png",
							selectedIconPath:"../../../static/images/icon_index_bottom16.png",
							text : '进货',
							badge : ''
						});
						this_.tabNum = 4;
						this_.currentTabIndex = 3;
						
						this_.jihuoPlant.splice(2,0,{url : '../../../static/images/icon_jh.png',text : '进货详情',badge : '',linkUrl : '../myorder/myorder'});
						this_.jihuoPlant.splice(3,0,{url : '../../../static/images/icon_zt.png',text : '在途',badge : '',linkUrl : '../stock/stock?type=1'});
						this_.jihuoPlant.splice(4,0,{url : '../../../static/images/icon_yd.png',text : '预定',badge : '',linkUrl : '../booking/booking'});
						this_.jihuoPlant.splice(5,0,{url : '../../../static/images/icon_yd.png',text : '已取消',badge : '',linkUrl : '../cancel/cancel'})
					}
					this_.qrcodeText = 'http://gao.vocen.cn:8044/#/pages/QRCode?ma001='+ res.data[0].c_ma001 +'&type=1&m_id='+ res.data[0].c_m_id;
					//判断是否是二级代理商，二级代理商c_level为2
					// if(this_.userInfo.c_level == '2'){
					// 	this_.manageList.splice(1,0,{url : '../../../static/images/icon_db.png',text : '调拨明细',badge : '',linkUrl:'../allotList02/allotList02?id=0'});
					// 	this_.manageList.splice(2,0,{url : '../../../static/images/icon_kc.png',text : '库存',badge : '',linkUrl : '../stock/stock?type=0'});
					// 	this_.manageList.splice(3,0,{url : '../../../static/images/icon_zt.png',text : '在途',badge : '',linkUrl : '../stock/stock?type=1'});
					// }else{
					// 	this_.manageList.splice(1,0,{url : '../../../static/images/icon_jxs.png',text : '经销商',badge : '',linkUrl:'../dealer/dealer'});
					// 	this_.manageList.splice(2,0,{url : '../../../static/images/icon_db.png',text : '调拨',badge : '',linkUrl:'../allotList/allotList'});
					// }
					if(this_.userInfo.c_type == '2' || this_.userInfo.c_type == '3' || this_.userInfo.c_type == '4' || this_.userInfo.c_type == '5'){
						this_.manageList.splice(1,0,{url : '../../../static/images/icon_db.png',text : '调拨明细',badge : '',linkUrl:'../allotList02/allotList02?id=0'});
						this_.manageList.splice(2,0,{url : '../../../static/images/icon_kc.png',text : '库存',badge : '',linkUrl : '../stock/stock?type=0'});
						this_.manageList.splice(3,0,{url : '../../../static/images/icon_zt.png',text : '在途',badge : '',linkUrl : '../stock/stock?type=1'});
					}else if(this_.userInfo.c_type == '0'){
						this_.manageList.splice(1,0,{url : '../../../static/images/icon_jxs.png',text : '经销商',badge : '',linkUrl:'../dealer/dealer?m_type=2'});
						this_.manageList.splice(2,0,{url : '../../../static/images/icon_db.png',text : '调拨',badge : '',linkUrl:'../allotList/allotList'});
						// this_.manageList.splice(3,0,{url : '../../../static/images/icon_db.png',text : '镗缸厂',badge : '',linkUrl:'../dealer/dealer?m_type=3'});
						// this_.manageList.splice(4,0,{url : '../../../static/images/icon_db.png',text : '易损件',badge : '',linkUrl:'../dealer/dealer?m_type=4'});
						// this_.manageList.splice(5,0,{url : '../../../static/images/icon_db.png',text : '微车批发',badge : '',linkUrl:'../dealer/dealer?m_type=5'});
						// this_.manageList.splice(6,0,{url : '../../../static/images/icon_db.png',text : '车型件',badge : '',linkUrl:'../dealer/dealer?m_type=6'});
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
			//进货计划
			myOrder(e) {
				uni.navigateTo({
					url : e.linkUrl
				})
				// let {
				// 	index
				// }=e.detail
				// console.log(index);
				// uni.navigateTo({
				// 	url : '../myorder/myorder'
				// })
			},
			//修理厂订单
			storeOrder(e) {
				//console.log(e);
				uni.navigateTo({
					url : e.linkUrl
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
			//协议客户
			customerNav(e){
				let this_ = this;
				let {
					index
				}=e.detail
				uni.navigateTo({
					url : this_.agreeCustomer[index].linkUrl
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
				console.log(e);
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
.am-avg-2{
	display: inline-block;
	width: 49%;
}
/* .am-avg-2:last-child{
	width: 48%;
} */
</style>
