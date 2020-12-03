<template>
	<view class="index_container">
		<!-- 代理商厂信息补全弹层开始 -->
		<view class="login-dialog login-dialog-zindex" v-if="userInfo.isfirst==1"> 
			<view class="login-dialog-cont">
				<view class="login-title">为了准确为您和您的客户推送消息，请准确录入您的手机号</view>
				<view class="login-list">
					<text class="login-txt">联系电话</text>
					<input class="uni-input login-input" v-model="agentInfo.c_tel" placeholder="请录入联系电话" />
				</view>
				<button type="primary" class="login-dialog-btn" @click="submitAgent()">提交</button>
			</view>
		</view>
		<!-- 代理商信息补全弹层结束 -->
		
		<!-- 搜索内容开始 -->
		<view class="index-search" style="top:0;z-index:2">
			<view class="index-search-cont">
				<!-- <button class="index-search-btn" @click="filter()">机型目录</button> -->
				<button class="index-search-btn">品牌目录</button>
				<view class="search-input-box">
					<input class="index-search-txt" confirm-type="search" v-model="keywords" placeholder="请输入产品名/型号"  @confirm="search" />
					<button class="index-search-btn s-btn" @click="search()">搜索</button>
				</view>
			</view>
		</view>
		<!-- 搜索内容结束 -->
		
		<!-- 推送提示信息开始 -->
		<view class="notice-bar">
			<uni-notice-bar showIcon="true" :text="roleTxt" background-color="#eeeeee" color="#333333"></uni-notice-bar> 
		</view>
		<view class="notice-bar" v-if="addRep>0" @click="toRepair()">
			<uni-notice-bar showIcon="true" :text="desc02+addRep" :backgroundColor="'#c8ecc8'" :color="'#36ce36'"></uni-notice-bar>
		</view>
		<view class="notice-bar" v-if="addNum>0" @click="toOrder(0)">
			<uni-notice-bar showIcon="true" :text="desc+addNum"></uni-notice-bar>
		</view>
		<!-- <view class="notice-bar" v-if="addNum01>0" @click="toOrder(1)">
			<uni-notice-bar showIcon="true" :text="desc03+addNum01"></uni-notice-bar>
		</view> -->
		<!-- 推送提示信息结束 -->
		
		<!-- 热门机型 -->
		<!-- <view class="example-body">
			<uni-list>
				<uni-list-item title="热门机型" :showArrow="false" rightText="" thumb="../../../static/images/remen.png" :thumbSize="thumbSize" />
			</uni-list>
			<view class="index-content">
				<uni-grid :column="3" :show-border="false" :square="false" :highlight="false">
					<uni-grid-item v-if="index < 3" v-for="(item,index) in proList" style="width:32%;">
						<view class="index-list index-list-rejx"  @click="toDetail(item)">
							<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
							<view class="index-uinn">
								<text class="index-title">{{item.productmodel}}</text>
								<view class="index-txt"><text>适用车型:{{item.suitable}}</text></view>
								<view class=""><text class="am-text-danger">￥</text><text class="index-price">{{item.currentprice}}</text></view>
								<view class="index_collect ub f28 ub-ac">
									<text class="ub am-blod am-text-danger"  v-if="item.a_id > 0">赠</text>
									<view class="ub ub-f1 ub-pe">
										<text class="iconfont ub am-text-danger" @click.stop="collCancle(item)" v-if="item.f_id">&#xe7bd;<text class="umar-l">已收藏</text></text>
										<text class="iconfont ub" @click.stop="collect(item)" v-else>&#xe7bc;<text class="umar-l">收藏</text></text>
									</view>
								</view>
							</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view> -->
		<!-- 热门车系开始 -->
		<!-- <view class="example-body rmcxList">
			<uni-list>
				<uni-list-item title="热门车系" :showArrow="true" rightText="更多" thumb="../../../static/images/hot.png" :thumbSize="thumbSize" @click="moreCart" />
			</uni-list>
			<view class="index-content">
				<uni-grid :column="2" :show-border="false" :square="false" :highlight="false">
					<uni-grid-item v-if="index < 4" v-for="(item,index) in cartList" style="width: 44.5%;">
						<view class="ub ub-ac" @click="toHotCart(item)" >
							<view class="ub ub-f1 am-blod">{{item.name}}</view>
							<view class="ub">
								<image class="cx-image" :src="item.imgPath" mode="aspectFill"></image>
							</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view> -->
		<!-- 轮播图 -->
		<swiper class="swiper index-slide" circular="false" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" indicator-color="#999" indicator-active-color="#14489b">
			<swiper-item>
				<view class="swiper-item"><image src="../../../static/images/img_index_slide01.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item"><image src="../../../static/images/img_index_slide02.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item"><image src="../../../static/images/img_index_slide03.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item"><image src="../../../static/images/img_index_slide04.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item"><image src="../../../static/images/img_index_slide05.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
			</swiper-item>
			<swiper-item>
				<view class="swiper-item"><image src="../../../static/images/img_index_slide06.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
			</swiper-item>
		</swiper>
		
		<!-- 热门车系结束 -->
		<!-- 快捷键 -->
		<!-- <view class="example-body menuList index-content">
			<uni-grid :column="3" :show-border="false" :square="false" :highlight="false">
				<uni-grid-item v-if="index < 6" v-for="(item ,index) in menuList" :index="index" :key="index" style="width: 30.5%;">
					<view class="grid-item-box" @click="commonMenu(item)">
						<view class="ub ub-ac">
							<image class="image ub" :src="item.url" mode="widthFix" />
							<view class="ub ub-f1">
								<text class="text">{{item.text}}</text>
								<view v-if="item.badge" class="grid-dot">
									<uni-badge :text="item.badge" :type="item.type" style="width:10px" />
								</view>
							</view>
						</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view> -->
		<view class="index-content">
			<view class="ub f28 shopList">
				<view class="ub ub-f1 ub-ac ub-pc" @click="changeShopType(-1);">
					<image class="icon-img" src="../../../static/images/zaishoujixing.png" mode="widthFix"></image>
					<text :style="{color: isShow == -1 ? '#3079F3' : '#333333'}">全部</text>
				</view>
				<view class="ub ub-f1 ub-ac ub-pc" @click="changeShopType(0);">
					<image class="icon-img" src="../../../static/images/zaishoujixing.png" mode="widthFix"></image>
					<text :style="{color: isShow == 0 ? '#3079F3' : '#333333'}">在售产品</text>
				</view>
				<view class="ub ub-f1 ub-ac ub-pc" @click="changeShopType(1);">
					<image class="icon-img" src="../../../static/images/zaishoujixing.png" mode="widthFix"></image>
					<text :style="{color: isShow == 1 ? '#3079F3' : '#333333'}">预售产品</text>
				</view>
			</view>
			<view class="index-product" v-if="isShow == 0 || isShow == -1">
				<view class="index-list" v-for="(item,index) in proList" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<view class="index-uinn">
						<text class="index-title">{{item.title}}</text>
						<!-- <view class="index-txt">
							<text>原车代码:{{item.productmodel}}</text>
						</view> -->
						<view class="index-txt"><text>品牌:{{item.suitable}}</text></view>
						<view class="">会员价：<text class="am-text-danger">￥</text><text class="index-price">{{item.currentpriceb}}</text></view>
						<view class="">非会员价：<text class="f24 am-text-warning">￥</text><text class="index-price f28 am-text-warning">{{item.currentprice}}</text></view>
						<view class="">车主价格：<text class="f24 am-text-primary">￥</text><text class="index-price f28 am-text-primary">{{item.currentpricec}}</text></view>
						<!-- <view class="index_collect ub f28 ub-ac">
							<text class="ub am-blod am-text-danger" v-if="item.a_id > 0">赠</text>
							<view class="ub ub-f1 ub-pe">
								<text class="iconfont ub am-text-danger" @click.stop="collCancle(item)" v-if="item.f_id">&#xe7bd;<text class="umar-l">已收藏</text></text>
								<text class="iconfont ub" @click.stop="collect(item)" v-else>&#xe7bc;<text class="umar-l">收藏</text></text>
							</view>
						</view> -->
					</view>
				</view>
			</view>
			<!-- 预售 -->
			<view class="index-product" v-if="isShow == 1 || isShow == -1">
				<view class="index-list index-ys" v-for="(item,index) in bproList" @click="toDetail(item)">
					<image class="icon-img index-dp" src="../../../static/images/hotIcon.png" mode="widthFix"></image>
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<view class="index-uinn">
						<text class="index-title">{{item.title}}</text>
						<!-- <view class="index-txt">
							<text>原车代码:{{item.productmodel}}</text>
						</view>
						<view class="index-txt"><text>适用车型:{{item.suitable}}</text></view> -->
						<view class="index-txt" v-if="!$check.isEmpty(item.suitable)"><text>品牌:{{item.suitable}}</text></view>
					</view>
				</view>
			</view>
			
		</view>
		<!-- 上拉加载 start -->
		<uni-load-more :status="status" class="am-umar-tbar"></uni-load-more>
		<!-- 上拉加载 end -->
		<!-- 底部导航 -->
		<tabBar :current="currentTabIndex" :column="tabNum" :options="tabList"></tabBar>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import uniGrid from '@/components/uni-grid/uni-grid.vue'
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniBadge from '@/components/uni-badge/uni-badge.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
		components:{
			uniPopup,
			uniIcons,
			uniNoticeBar,
			uniLoadMore,
			uniGrid,
			uniGridItem,
			uniBadge,
			uniList,
			uniListItem
		},
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				proList:[],//产品列表
				bproList:[],//预售产品列表
				userInfo:{},//用户信息
				desc : '您有修理厂新订单数量（请点击查看）',
				addNum:0,//代理商的修理厂新订单数量（每次登录后查询）
				desc03 : '您有协议客户新订单数量（请点击查看）',
				addNum01:0,//代理商的修理厂新订单数量（每次登录后查询）
				desc02:'您有新待审核账号（请点击查看）',
				addRep:0,
				p:1,
				pageSize:100,
				pageCount: '',
				status:'more',
				keywords: '',
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
				currentTabIndex:0,
				agentInfo:{
					c_tel:'',
					c_tel1:'',
					c_nickname:'',
					c_prov:'',
					c_city:'',
					c_address:'',
					c_state:'0',
					c_main: '',
				},
				menuList : [{
					url : '../../../static/images/menu6.png',
					text : '收藏夹',
					linkUrl:'../collect/collect',
					badge : ''
				},{
					url : '../../../static/images/xlcorder.png',
					text : '修理厂订单',
					linkUrl:'../reporder/reporder?id=0',
					badge : ''
				}],
				thumbSize : {
					width:'20px',
					height:'17px'
				},
				cartList : getApp().globalData.carsType,
				roleTxt : "",//角色描述
				tabcolor : "#3079F3",
				isShow : -1, //产品列表
			}
		},
		onLoad() {
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					console.log(res);
					this_.userInfo = res.data[0];
					if(this_.userInfo.c_level == 1){
						//this_.roleTxt = "成为我们的直营店用户";
						this_.roleTxt = this_.userInfo.c_ma002 + "为江陵动力大和采配送服务商";
						if(this_.userInfo.c_admin == 1){
							this_.menuList.splice(1,0,{
								url : '../../../static/images/booking.png',
								text : '缺货预订',
								linkUrl:'../booking/booking',
								badge : '',
								type: "error"
							});
							this_.tabList.splice(1,0,{
								pagePath : '../tobuy/tobuy',
								iconPath:"../../../static/images/icon_index_bottom06.png",
								selectedIconPath:"../../../static/images/icon_index_bottom16.png",
								text : '进货',
								badge : ''
							});
							this_.tabNum = 4;
						}
						
					}
					// else if(this_.userInfo.c_level == 2){
					// 	//this_.roleTxt = "成为我们的经销商用户";
					// 	this_.roleTxt = "成为江陵动力大合采" + this_.userInfo.c_prov + this_.userInfo.c_city + "经销商";

					// 	this_.menuList.splice(2,0,{
					// 		url : '../../../static/images/icon_db.png',
					// 		text : '查看调拨',
					// 		linkUrl:'../allotList02/allotList02?id=0',
					// 		badge : '',
					// 		type: "error"
					// 	});
					// }
					//补录信息回显
					if(!this_.$check.isEmpty(this_.userInfo.c_nickname)){
						this_.agentInfo.c_nickname = this_.userInfo.c_nickname;
					}
					if(!this_.$check.isEmpty(this_.userInfo.c_tel)){
						this_.agentInfo.c_tel = this_.userInfo.c_tel;
					}
					if(!this_.$check.isEmpty(this_.userInfo.c_address)){
						this_.agentInfo.c_address = this_.userInfo.c_address;
					}
					if(!this_.$check.isEmpty(this_.userInfo.c_prov)){
						this_.agentInfo.c_prov = this_.userInfo.c_prov;
					}
					if(!this_.$check.isEmpty(this_.userInfo.c_city)){
						this_.agentInfo.c_city = this_.userInfo.c_city;
					}
					
					this_.getNewOrder();//代理商新订单数量
					this_.getNewRepair();//修理厂新增账号
					//this_.getProduct();//产品列表
					this_.changeShopType(-1);
					this_.getRemindNum(); //到货产品数量
					
			    }
			});
			this.$check.cartNum();
		},
		onShow(){
			this.getNewOrder();//代理商新订单数量
			this.getNewRepair();//修理厂新增账号
		},
		methods: {
			//修理厂/代理商信息补全 -----手机号必填
			submitAgent(){
				let this_ = this;
				if(this_.$check.isEmpty(this_.agentInfo.c_tel)){
					uni.showToast({
						icon : 'none',
						title : "手机号不能为空",
						duration:1500
					});
					return false;
				}else if(!this_.$check.ckTel(this_.agentInfo.c_tel)){
					uni.showToast({
						icon : 'none',
						title : "手机号格式不正确",
						duration:1500
					});
					return false;
				}
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.UserState+'?c_id='+ this_.userInfo.c_id,
					method:'POST',
					data:this_.agentInfo,
				}).then(res => {
					uni.hideLoading();
					//请求成功
					if(res.data.State){
						uni.showToast({
							icon : 'none',
							title : res.data.Message,
							duration:1500
						});
						this_.userInfo.isfirst = 0;
						let arr = [];
						arr.push(this_.userInfo);
						uni.setStorage({
						    key: 'userInfo',
						    data: arr,
						    success: function () {
						        console.log('success');
						    }
						});
					}
				},error => {
					console.log(error);
				});
				
			},
			//新增订单点击进入
			toOrder(e){
				uni.navigateTo({
				 	url: '../reporder/reporder?id=0&type='+e
				}); 
			},
			//新增待审核账号
			toRepair(){
				uni.navigateTo({
				 	url: '../newrepair/newrepair'
				}); 
			},
			//代理商新订单数量（每次登录后查询）
			getNewOrder(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.CustNewOrderQty+'?c_ma001='+ this_.userInfo.c_ma001 + '&m_id=' + this_.userInfo.c_m_id,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					//console.log(res);
					this_.addNum = res.data.filter(item => {return item.s_type_no == 0})[0].qty;
					this_.addNum01 = res.data.filter(item => {return item.s_type_no == 1})[0].qty;
					uni.hideLoading();
					
				},error => {
					console.log(error);
				});
			},
			//代理商待审核账号
			getNewRepair(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.UserQty+'?state=1&ma001=' + this_.userInfo.c_ma001 + '&m_id=' + this_.userInfo.c_m_id,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					this_.addRep = res.data;
				},error => {
					console.log(error);
				});
			},
			//切换产品种类
			changeShopType(t){
				let this_ = this;
				this_.p = 1;
				this_.isShow = t;
				if(t == 0){
					this_.getProduct();
				}else if(t == 1){
					this.getBookProduct();
				}else if(t == -1){
					this_.getProduct();
					this.getBookProduct();
				}
			},
			//产品列表
			getProduct(){
				let this_ = this;
				//获取首页产品列表
				uni.showLoading();
				/*let url = '';
				// if(this_.userInfo.c_level == 1){
				// 	url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				// }else if(this_.userInfo.c_level == 2){
				// 	url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				// }
				if(this_.userInfo.c_level == 1){
					url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				}else if(this_.userInfo.c_level == 2){
					url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				}
				if(this_.userInfo.c_level == 1){
					url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				}else if(this_.userInfo.c_level == 2){
					url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				}*/
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					console.log(res);
					if(this_.p > 1){
						this_.proList = this_.proList.concat(res.data.rows);
					}else{
						this_.proList = res.data.rows;
					}
					this_.status = 'more';
					this_.papeTotal(res.data.total);
				},error => {
					console.log(error);
				});
			},
			//预售产品列表
			getBookProduct(){
				let this_ = this;
				//获取首页产品列表
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductByPre+'?c_id='+ this_.userInfo.c_id +'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					console.log(res);
					if(this_.p > 1){
						this_.bproList = this_.bproList.concat(res.data.rows);
					}else{
						this_.bproList = res.data.rows;
					}
					this_.status = 'more';
					this_.papeTotal(res.data.total);
				},error => {
					console.log(error);
				});
			},
			//点击产品列表进入详情
			toDetail(item){
				let this_ = this;
				if(this_.isShow == 0){
					var index =  'index';
				}else{
					var index =  'tobuy';
				}
				uni.navigateTo({
				 	url: '../detail/detail?code='+item.erpcode + '&type='+index
				}); 
			},
			//到货产品数量
			getRemindNum(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.RemindQty+'?c_id='+ this_.userInfo.c_id +'&storage=' + this_.userInfo.storage,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					this_.menuList[1].badge = res.data;
				},error => {
					console.log(error);
				});
			},
			//点击收藏
			collect(item){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.AddFavorite,
					method:'POST',
					data:{"c_id":this_.userInfo.c_id,"c_ma001":this_.userInfo.c_ma001,"c_ma002":this_.userInfo.c_ma002,"i_mb001":item.erpcode},
				}).then(res => {
					//请求成功
					if(res.data.State){
						item.f_id = res.data.centent;
						uni.showToast({
							icon : 'none',
							title : '收藏成功',
							duration:1500
						});
					}
					
				},error => {
					console.log(error);
				});
			},
			//取消收藏
			collCancle(item){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.DelFavorite,
					method:'POST',
					data:[{"f_id":item.f_id}],
				}).then(res => {
					//请求成功
					if(res.data.State){
						item.f_id = '';
					}
					uni.showToast({
						icon : 'none',
						title : '取消收藏',
						duration:1500
					});
				},error => {
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
			//目录
			filter(){
				uni.navigateTo({
					url : '../cate/cate'
				});
			},
			search(e){
				//this.getProduct();
				let this_ = this;
				uni.navigateTo({
					url : '../proList/proList?scode=&keyWord='+ this_.keywords
				});
			},
			//常用快捷键
			commonMenu(e){
				uni.navigateTo({
					url : e.linkUrl+"?id="+e.id
				})
			},
			//热门车系
			toHotCart(item) {
				uni.navigateTo({
					url : '../hotCart/hotCart?code='+item.code
				})
			},
			//查看所有热门车系
			moreCart(){
				uni.navigateTo({
					url : '../hotCartAll/hotCartAll'
				})
			}
		},
		//上拉加载
		onReachBottom (){
			if(this.p < this.pageCount){
				this.p++;
				this.status = 'loading';
				this.getProduct();
			}else{
				this.status = 'noMore';
			}
		},
	}
</script>
<style>
.umar-l{
	margin-left: 10rpx;
}
.example-body {
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	padding: 15rpx 0;
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
}
.image {
	width: 35rpx;
	height: 50rpx;
	margin-right: 15rpx;
}
.text {
	font-size: 26rpx;
	margin-top: 10rpx;
}
.grid-dot {
	position: absolute;
	top: 1px;
	right: 30px;
}
.iconfont{
	font-size: 24rpx;
}
.index-list-rejx{
	width: 100%;
	margin-bottom: 0;
}
.index-content .uni-grid-item{
	margin-right: 2%;
}
.menuList .uni-grid-item{
	margin-right: 4%;
}
.index-content .uni-grid-item:last-child,
.menuList .uni-grid-item:last-child,
.rmcxList .index-content .uni-grid-item:nth-child(even){
	margin-right: 0;
}
.menuList .uni-grid-item{
	background-color: #EEEEEE;
	padding: 10px 0;
	border-radius: 15rpx;
}
.rmcxList .uni-grid-item:nth-child(1),
.rmcxList .uni-grid-item:nth-child(4){
	background-color: #C9D4F0;
}
.rmcxList .uni-grid-item:nth-child(2),
.rmcxList .uni-grid-item:nth-child(3){
	background-color: #EEEEEE;
}
.rmcxList .uni-grid-item{
	padding: 15rpx;
	margin-bottom: 15rpx;
}
.cx-image{
	width: 100rpx;
	height: 100rpx;
	display: block;
}
.umar-b15{
	margin-bottom: 15rpx;
}
/*产品列表*/
.shopList{
	padding: 30rpx 0;
}
.shopList .icon-img{
	width: 42rpx;
	margin-right: 15rpx;
}
.index-ys{
	position: relative;
}
.index-dp{
	position: absolute;
	top:0;
	right:0;
	width:119rpx;
	z-index: 1;
}
</style>