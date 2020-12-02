<template>
	<view class="evalList-container">
		<view v-for="(list,index) in evalList">
			<view class="custpro-list" style="border-bottom:none">
				<image :src="$http.imgUrl + list.titlepicurl" mode="widthFix" class="custpro-img"></image>
				<view class="custpro-fr">
					<view class="custpro-cont">
						<view class="custpro-item">
							<text class="custpro-title">{{list.title}}</text>
							<view>售价:<text class="am-text-danger">￥</text><text class="index-price">{{list.currentprice}}</text></view>
						</view>
					</view>
					<view class="custpro-txt">
						<view class="index-txt"><text>数量:{{list.i_qty}}</text></view>
						<text class="index-give" v-if="list.a_id>0">赠</text>
					</view>
					<view class="index-txt"><text>型号:{{list.productmodel}}</text></view>
				</view>
			</view>
			
			<view class="evalList-list">
				<view class="ub s_info">
					<view class="ub ub-f1">收货人:{{list.s_c_nickname}}</view>
					<view class="ub ub-f1 ub-pe">电话:{{list.s_tel}}</view>
				</view>
				<view v-for="(item,index02) in list.item">
					<view v-if="item.r_content!=''">
						<view class="evalList-flex">
							<text style="min-width: 100rpx;">评价：</text>
							<view class="ub">{{item.r_content}}</view>
						</view>
						<view class="evalList-flex reply" v-if="item.r_content_reply != ''">
							<text style="min-width: 100rpx;">回复：</text>
							<view class="ub">{{item.r_content_reply}}</view>
						</view>
						<view style="clear: both;margin-bottom: 15rpx;"></view>
						<view class="ub ub-ac">
							<view class="evalList-date ub-f1">{{item.r_time_create}}</view>
							<view class="evalList-date am-text-right">
								<block v-for="index in 5">
									<text v-if="index<=item.r_star_level" class="iconfont starActive">&#xe629;</text>
									<text v-else class="iconfont">&#xe60c;</text>
								</block>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 上拉加载 start -->
		<uni-load-more :status="status"></uni-load-more>
		<!-- 上拉加载 end -->
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components:{
			uniLoadMore
		},
		data() {
			return {
				userInfo:{},//用户信息
				evalList:[],//订单列表
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
				r_star_level:0//星级描述
			}
		},
		onLoad(){
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					//获取订单列表
					this_.getEvalList();
			    }
			});
		},
		//上拉加载
		onReachBottom (){
			if(this.p < this.pageCount){
				this.p++;
				this.status = 'loading';
				this.getEvalList();
			}else{
				this.status = 'noMore';
			}
		},
		methods: {
			getEvalList(){
				uni.showLoading({
					title:'加载中'
				})
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.shopReview+'?c_ma001='+this_.userInfo.c_ma001+'&m_id='+this_.userInfo.c_m_id+'&isreview=1&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					console.log(res.data);
					if(this_.p > 1){
						this_.evalList = this_.evalList.concat(res.data.rows);
					}else{
						this_.evalList = res.data.rows;
					}
					if(0 <= res.data.total < this_.pageSize){
						this_.status = 'noMore';
					}else{
						this_.status = 'more';
					}
					this_.papeTotal(res.data.total);
					uni.hideLoading();
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
		}
	}
</script>

<style>
.evalList-date{
	text-align: left;
}
.starActive{
	color:#ff7f50;
}
.iconfont{
	font-size: 34rpx;
	margin-right: 8rpx;
}
.s_info{
	padding-bottom: 10rpx;
	border-bottom: 1px solid #EEEEEE;
	margin-bottom: 10rpx;
}
.reply{
	background-color: #EEEEEE;
	border-radius: 10rpx;
	margin-top: 10rpx;
}
</style>
