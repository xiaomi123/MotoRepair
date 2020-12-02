<template>
	<view class="index_container">
		<!-- 搜索内容开始 -->
		<view class="index-search" style="top:0">
			<view class="index-search-cont">
				<!-- <button class="index-search-btn" @click="filter()">机型目录</button> -->
				<view class="search-input-box">
					<input class="index-search-txt index-search-agent" confirm-type="search" v-model="keywords" placeholder="请输入产品名/型号"  @confirm="search" />
					<button class="index-search-btn s-btn" @click="search()">搜索</button>
				</view>
			</view>
		</view>
		<!-- 搜索内容结束 -->
		<view class="notice-bar">
			<uni-notice-bar v-if="userInfo.c_type == 3" showIcon="true" :text="'欢迎 '+userInfo.c_nickname+' 成为江陵动力协议客户'" background-color="#eeeeee" color="#333333"></uni-notice-bar> 
			<uni-notice-bar v-else showIcon="true" :text="'欢迎 '+userInfo.c_nickname+' 成为江陵动力会员'" background-color="#eeeeee" color="#333333"></uni-notice-bar> 
		</view>
		
		<!-- 热门机型 -->
		<!-- <view class="example-body">
			<uni-list>
				<uni-list-item title="热门机型" :showArrow="false" thumb="../../../static/images/remen.png" :thumbSize="thumbSize" />
			</uni-list>
			<view class="index-content"> 
				<uni-grid :column="3" :show-border="false" :square="false" :highlight="false">
					<uni-grid-item v-for="(item,index) in hotCartType" style="width:32%;">
						<view class="index-list index-list-rejx" @click="toDetail(item)">
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
		<view class="example-body rmcxList">
			<uni-list>
				<uni-list-item title="热门车系" :showArrow="true" rightText="更多" thumb="../../../static/images/hot.png" :thumbSize="thumbSize" @click="moreCart" />
			</uni-list>
			<view class="index-content">
				<view class="uni-grid-box">
					<uni-grid :column="2" :show-border="false" :square="false" :highlight="false">
						<uni-grid-item v-for="(item,index) in cartList" style="width: 44.5%;">
							<view class="ub ub-ac" @click="toHotCart(item)" >
								<view class="ub ub-f1 am-blod">{{item.name}}</view>
								<view class="ub">
									<!-- <image class="cx-image" src="http://tiangang.htqp.com.cn:2345/Upload/Product/1280103/9498e71c14154e76a1679d6af632ebea.jpg" mode="widthFix" /> -->
									<image class="cx-image" :src="item.imgPath" mode="widthFix"></image>
								</view>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</view>
		</view>
		<!-- 热门车系结束 -->
		<!-- 快捷键 -->
		<view class="example-body menuList index-content">
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
		</view>
		<view class="index-content">
			<!-- <uni-list>
				<uni-list-item title="在售机型" :showArrow="false" rightText="" thumb="../../../static/images/zaishoujixing.png" style="padding-left: 0;" :thumbSize="thumbSize" />
			</uni-list> -->
			<view class="ub f28 shopList">
				<view class="ub ub-f1 ub-ac ub-pc" @click="changeShopType(0);">
					<image class="icon-img" src="../../../static/images/zaishoujixing.png" mode="widthFix"></image>
					<text :style="{color: isShow == 0 ? '#3079F3' : '#333333'}">在售机型</text>
				</view>
				<view class="ub ub-f1 ub-ac ub-pc" @click="changeShopType(1);">
					<image class="icon-img" src="../../../static/images/zaishoujixing.png" mode="widthFix"></image>
					<text :style="{color: isShow == 1 ? '#3079F3' : '#333333'}">预售机型</text>
				</view>
			</view>
			<view class="index-product" v-if="isShow == 0">
				<view class="index-list" v-for="(item,index) in proList" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<view class="index-uinn">
						<text class="index-title">{{item.title}}</text>
						<view class="index-txt">
							<text>原车代码:{{item.productmodel}}</text>
						</view>
						<view class="index-txt"><text>适用车型:{{item.suitable}}</text></view>
						<view class=""><text class="am-text-danger">￥</text><text class="index-price">{{item.currentprice}}</text></view>
						<view class="index_collect ub f28 ub-ac">
							<text class="ub am-blod am-text-danger" v-if="item.a_id > 0">赠</text>
							<view class="ub ub-f1 ub-pe">
								<text class="iconfont ub am-text-danger" @click.stop="collCancle(item)" v-if="item.f_id">&#xe7bd;<text class="umar-l">已收藏</text></text>
								<text class="iconfont ub" @click.stop="collect(item)" v-else>&#xe7bc;<text class="umar-l">收藏</text></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 预售 -->
			<view class="index-product" v-if="isShow == 1">
				<view class="index-list" v-for="(item,index) in bproList" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<view class="index-uinn">
						<text class="index-title">{{item.title}}</text>
						<view class="index-txt">
							<text>原车代码:{{item.productmodel}}</text>
						</view>
						<view class="index-txt"><text>适用车型:{{item.suitable}}</text></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 上拉加载 start -->
		<uni-load-more :status="status" class="am-umar-tbar"></uni-load-more>
		<!-- 上拉加载 end -->
		
		<!-- 底部导航 -->
		<tabBar :current="currentTabIndex" :options="tabList"></tabBar>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import uniGrid from '@/components/uni-grid/uni-grid.vue'
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniBadge from '@/components/uni-badge/uni-badge.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
		components:{
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
				proList:[],
				bproList:[],//预售产品列表
				isShow : 0, //产品列表
				userInfo:{},
				p:1,
				pageSize:100,
				pageCount: '',
				status:'more',
				keywords:'',
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
						selectedIconPath:"../../../static/images/icon_index_bottom13.png",
						text : '我的',
						badge : ''
					}
				],
				currentTabIndex:0,
				menuList : [{
					url : '../../../static/images/menu6.png',
					text : '收藏夹',
					linkUrl:'../collect/collect',
					badge : ''
				},{
					url : '../../../static/images/menu2.png',
					text : '已发货',
					badge : '',
					linkUrl:'../order/order',
					id:1
				},{
					url : '../../../static/images/icon_pj.png',
					text : '评价',
					badge : '',
					linkUrl:'../evalList/evalList?id=0'
				}
				// {
				// 	url : '../../../static/images/xuyuanchi.png',
				// 	text : '许愿池',
				// 	linkUrl:'../wishing/wishing',
				// 	badge : ''
				// },{
				// 	url : '../../../static/images/zengpin.png',
				// 	text : '赠品',
				// 	linkUrl:'',
				// 	badge : ''
				// },
				],
				thumbSize : {
					width:'20px',
					height:'17px'
				},
				cartList : getApp().globalData.carsType, //热门车系
				hotCartType : [] //热门机型
			}
		},
		onLoad() {
			//读取存储数据
			//this.getData();
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					//this_.getData();
					this_.changeShopType(0);
					this_.getHotCart();
					
			    }
			});
			this.$check.cartNum();
		},
		methods: {
			//切换产品种类
			changeShopType(t){
				let this_ = this;
				this_.p = 1;
				this_.isShow = t;
				if(t == 0){
					this_.getData();
				}else{
					this.getBookProduct();
				}
			},
			//获取首页产品列表
			getData(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
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
				// uni.getStorage({
				//     key: 'userInfo',
				//     success: function (res) {
				// 		this_.userInfo = res.data[0];
				// 		//获取首页产品列表
				// 		uni.showLoading();
				// 		this_.getHotCart();
				// 		this_.$http.httpTokenRequest({
				// 			url:this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
				// 			method:'GET',
				// 			data:{},
				// 		}).then(res => {
				// 			//请求成功
				// 			uni.hideLoading();
				// 			//console.log(res.data.rows);
				// 			if(this_.p > 1){
				// 				this_.proList = this_.proList.concat(res.data.rows);
				// 			}else{
				// 				this_.proList = res.data.rows;
				// 			}
				// 			this_.status = 'more';
				// 			this_.papeTotal(res.data.total);
				// 		},error => {
				// 			console.log(error);
				// 		});
						
				//     }
				// });
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
			//获取热门机型
			getHotCart(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductByCode + '?c_id=' + this_.userInfo.c_id + '&c_type=' + this_.userInfo.c_type + '&code=1280083,1280082,1280103',
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					console.log(res);
					this_.hotCartType = res.data;
					
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
			//点击产品列表进入详情
			toDetail(item){
				//console.log(this.isShow);
				let this_ = this;
				uni.navigateTo({
				 	url: '../detail/detail?code='+item.erpcode + '&a_id=' + item.a_id + '&is_footer_bar=' + this.isShow
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
						uni.showToast({
							icon : 'none',
							title : '取消收藏',
							duration:1500
						});
					}
				},error => {
					console.log(error);
				});
			},
			//目录
			filter(){
				uni.navigateTo({
					url : '../cate/cate'
				})
			},
			search(e){
				//this.getData();
				let this_ = this;
				uni.navigateTo({
					url : '../proList/proList?scode=&keyWord='+ this_.keywords
				});
			},
			//常用快捷键
			commonMenu(e){
				if(e.linkUrl != ""){
					uni.navigateTo({
						url : e.linkUrl+"?id="+e.id
					})
				}else{
					uni.showToast({
						icon : 'none',
						title:'敬请期待',
						duration:1500
					})
				}
				
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
				this.getData();
			}else{
				this.status = 'noMore';
			}
		}
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
	overflow: hidden;
}
.image {
	width: 35rpx; /*50rpx*/
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
</style>
