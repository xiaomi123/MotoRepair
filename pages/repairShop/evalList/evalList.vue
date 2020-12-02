<template>
	<view class="evalList-container">
		<!-- tabItem -->
		<view class="am-fixedBar" ref="tabitem">
			<view class="box">
				<uni-segmented-control :current="parseInt(tabIndex)" :values="tabItems" @clickItem="onClickTab" style-type="text" active-color="#3079F3"></uni-segmented-control>
			</view>
		</view>
		<view :style="{marginTop:`${marginTop}px`}">
			<view v-for="(list,index) in evalList" :style="(tabIndex==1) ? 'border-bottom:1px solid #ddd;':''">
				<view class="am-text-primary am-text-right f24" style="padding-right: 35rpx;" v-if="tabIndex==0">评价后获得积分奖励</view>
				<view class="custpro-list" :style="(tabIndex==1) ? 'border-bottom:none':''">
					<image :src="$http.imgUrl + list.titlepicurl" mode="widthFix" class="custpro-img"></image>
					<view class="custpro-fr">
						<view class="custpro-cont">
							<view class="custpro-item">
								<text class="custpro-title">{{list.title}}</text>
								<view>售价:<text class="am-text-danger">￥</text><text class="index-price">{{list.currentprice}}</text></view>
							</view>
							<view class="ub" v-if="tabIndex==0">
								<button class="f24 am-btn-primary" @click="openForm(list)">去评价</button>
							</view>
						</view>
						<view class="custpro-txt">
							<view class="index-txt"><text>数量:{{list.i_qty}}</text></view>
							<text class="index-give" v-if="list.a_id>0">赠</text>
						</view>
						<view class="index-txt"><text>型号:{{list.productmodel}}</text></view>
					</view>
				</view>
				
				<view class="evalList-list" v-if="tabIndex==1">
					<view v-for="(item,index02) in list.item">
						<view v-if="item.r_content!=''">
							<view class="evalList-flex">
								<text>评价：</text>
								<view>{{item.r_content}}</view>
								</view>
							<view class="evalList-date">{{item.r_time_create}}</view>
						</view>
						<view class="reply" v-if="item.r_content_reply!=''">
							<view class="evalList-flex">
								<text>回复：</text>
								<view>{{item.r_content_reply}}</view>
							</view>
							<view class="evalList-date">{{item.r_time_reply}}</view>
						</view>
						<!-- <view class="ub" v-if="item.r_content_reply!='' && item.r_content!=''">
							<button class="f24 am-btn-primary" style="margin-right:0;margin-top:10rpx;" @click="openForm(list.i_s_id,list.i_id)">去追评</button>
						</view> -->
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
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components:{
			uniSegmentedControl,
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
				tabItems: ['未评价','已评价'],
				tabIndex:0,
				marginTop: ''
			}
		},
		onLoad(option) {
			//读取存储数据
			let this_ = this;
			this_.tabIndex = parseInt(option.id);
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					//获取订单列表
					this_.getEvalList();
					
			    }
			});
		},
		mounted() {
			this.marginTop = this.$refs.tabitem.$el.getBoundingClientRect().height;
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
			//tab切换
			onClickTab(e){ 
				//console.log(e);
				let this_ = this;
				if (this_.tabIndex !== e.currentIndex) {
					this_.p = 1;
					this_.tabIndex = e.currentIndex;
					this_.getEvalList();
				}
			},
			//获取订单列表
			getEvalList(){
				uni.showLoading({
					title:'加载中'
				})
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.shopReview+'?c_id=' + this_.userInfo.c_id + '&isreview='+ this_.tabIndex +'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
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
			openForm(item){
				uni.navigateTo({
					url:'../evaluate/evaluate?data='+JSON.stringify(item)
				})
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
.reply{
	background-color: #EEEEEE;
	border-radius: 10rpx;
	margin-top: 10rpx;
	padding: 15rpx;
}
</style>