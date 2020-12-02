<template>
	<view class="index_container">
		<!-- 搜索内容开始 -->
		<view class="index-search" style="top:0">
			<view class="index-search-cont">
				<!-- <button class="index-search-btn" @click="filter()">机型目录</button> -->
				<view class="search-input-box">
					<input class="index-search-txt index-search-agent" confirm-type="search" v-model="keywords" placeholder="请输入产品机型或车型"  @confirm="search" />
					<button class="index-search-btn s-btn" @click="search()">搜索</button>
				</view>
			</view>
		</view>
		
		
		<!-- 搜索内容结束 -->
		
		<!-- 轮播内容开始 -->
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper index-slide" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" indicator-color="#999" indicator-active-color="#14489b">
						<swiper-item> 
							<view class="swiper-item"><image src="../../../static/images/img_index_slide01.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item"><image src="../../../static/images/img_index_slide02.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<!-- 轮播内容结束 -->
		
		<!-- 快捷键 -->
		<view class="example-body">
			<uni-grid :column="3" :show-border="false" :square="false" :highlight="false">
				<uni-grid-item v-if="index < 6" v-for="(item ,index) in menuList" :index="index" :key="index">
					<view class="grid-item-box" @click="commonMenu(item)">
						<image class="image" :src="item.url" mode="aspectFill" />
						<text class="text">{{item.text}}</text>
						<view v-if="item.badge" class="grid-dot">
							<uni-badge :text="item.badge" :type="item.type" />
						</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		
		<view class="index-content">
			<view class="modal-title">凸机总成</view>
			<view class="index-product">
				<view class="index-list" v-for="(item,index) in proList" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<view class="index-uinn">
						<text class="index-title">{{item.title}}</text>
						<view>售价:<text class="am-text-danger">￥</text><text class="index-price">{{item.currentprice}}</text></view>
						<view class="index-txt">
							<text>型号:{{item.productmodel}}</text>
						</view>
						<view class="index-txt"><text>适用范围:{{item.suitable}}</text></view>
						<view class="index_collect ub ub-ac">
							<text class="ub f32 am-blod" v-if="item.a_id > 0">赠</text>
							<text class="iconfont ub umar-l" @click.stop="collCancle(item)" v-if="item.f_id">&#xe7bd;</text>
							<text class="iconfont ub umar-l" @click.stop="collect(item)" v-else>&#xe7bc;</text>
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
	export default {
		components:{
			uniLoadMore,
			uniGrid,
			uniGridItem,
			uniBadge
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
				pageSize:10,
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
						iconPath:"../../../static/images/icon_index_bottom03.png",
						selectedIconPath:"../../../static/images/icon_index_bottom14.png",
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
					url : '../../../static/images/menu3.png',
					text : '许愿池',
					linkUrl:'../wishing/wishing',
					badge : ''
				},{
					url : '../../../static/images/menu4.png',
					text : '赠品',
					linkUrl:'',
					badge : ''
				}],
			}
		},
		onLoad() {
			//读取存储数据
			this.getData();
			this.$check.cartNum();
		},
		methods: {
			getData(){
				let this_ = this;
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
						this_.userInfo = res.data[0];
						//获取首页产品列表
						uni.showLoading();
						this_.$http.httpTokenRequest({
							url:this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
							method:'GET',
							data:{},
						}).then(res => {
							//请求成功
							uni.hideLoading();
							console.log(res.data.rows);
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
						
				    }
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
				//console.log(item);
				let this_ = this;
				uni.navigateTo({
				 	url: '../detail/detail?code='+item.erpcode + '&a_id=' + item.a_id
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
				uni.navigateTo({
					url : e.linkUrl+"?id="+e.id
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
.index-search-txt{
	width: 70%;
}
.index-search-btn{
	width: 18%;
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
	width: 80rpx;
	height: 80rpx;
}
.text {
	font-size: 26rpx;
	margin-top: 10rpx;
}
</style>
