<template>
	<view class="index_container">
		
		<!-- 协议客户信息补全弹层开始 -->
		<view class="login-dialog login-dialog-zindex" v-if="userInfo.isfirst==1"> 
			<view class="login-dialog-cont">
				<view class="login-title">为了准确为您和您的客户推送消息，请准确录入您的手机号</view>
				<view class="login-list">
					<text class="login-txt">联系电话</text>
					<input class="uni-input login-input" v-model="userInfo.c_tel" placeholder="请录入联系电话" />
				</view>
				<button type="primary" class="login-dialog-btn" @click="submitAgent()">提交</button>
			</view>
		</view>
		<!-- 协议客户信息补全弹层结束 -->
		
		<!-- 搜索内容开始 -->
		<view class="index-search" style="top:0">
			<view class="index-search-cont">
				<view class="search-input-box" style="width: 100%;">
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
			<view class="index-product">
				<view class="index-list" v-for="(item,index) in proList" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<view class="index-uinn">
						<text class="index-title">{{item.title}}</text>
						<view class="index-txt">
							<text>原车代码:{{item.productmodel}}</text>
						</view>
						<view class="index-txt"><text>适用车型:{{item.suitable}}</text></view>
						<view class="">
							<view class="am-text-danger" v-if="userInfo.c_isview == 0">进价：<text class="index-price f28">协议价</text></view>
							<view class="am-text-danger" v-else="userInfo.c_isview == 1">进价：￥<text class="index-price">{{item.a_price}}</text></view>
							<view class="f24">售价：￥<text>{{item.currentprice}}</text></view>
						</view>
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
				userInfo:{},
				p:1,
				pageSize:100,
				pageCount: '',
				status:'more',
				keywords:'',
				tabList: [
					{
						pagePath : '../customerIndex/customerIndex',
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
				}]
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
					console.log(this_.userInfo);
					this_.getData();
					
			    }
			});
			this.$check.cartNum();
		},
		methods: {
			//获取首页产品列表
			getData(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.AgreementProductHome+'?c_id='+ this_.userInfo.c_id + '&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
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
				let this_ = this;
				uni.navigateTo({
				 	url: '../detail/detail?code='+item.erpcode + '&a_id=' + item.a_id + '&is_footer_bar=0'
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
			search(){
				let this_ = this;
				console.log(this_.keywords);
				this.getData();
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
			//修理厂/代理商信息补全 -----手机号必填
			submitAgent(){
				let this_ = this;
				if(this_.$check.isEmpty(this_.userInfo.c_tel)){
					uni.showToast({
						icon : 'none',
						title : "手机号不能为空",
						duration:1500
					});
					return false;
				}
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.UserState+'?c_id='+ this_.userInfo.c_id,
					method:'POST',
					data:this_.userInfo,
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
