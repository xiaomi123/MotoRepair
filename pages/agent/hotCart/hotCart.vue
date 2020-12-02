<template>
	<view class="index_container" style="padding-top: 0;">
		<!-- 产品列表内容开始 -->
		<view class="index-content" v-if="proList.length>0">
			<view class="modal-title"></view>
			<view class="index-product">
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
							<text class="ub am-blod ub-f1 am-text-danger" v-if="item.a_id > 0">赠</text>
							<view class="ub">
								<text class="iconfont ub am-text-danger" @click.stop="collCancle(item)" v-if="item.f_id">&#xe7bd;<text class="umar-l">已收藏</text></text>
								<text class="iconfont ub" @click.stop="collect(item)" v-else>&#xe7bc;<text class="umar-l">收藏</text></text>
							</view>
						</view>
					</view>
				</view>
				<!-- <view class="index-list" v-for="(item,index) in proList" @click="toDetail(item)">
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
				</view> -->
			</view>
		</view>
		<view class="com-nodata" v-else>暂无产品</view>
		<!-- 产品列表内容结束 -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				proList:[],//产品列表
				userInfo:{},//用户信息,
				scode:''
			}
		},
		onLoad(option) {
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					this_.scode = option.code;
					this_.getCodePro();
			    }
			});
		},
		methods: {
			//查询产品
			getCodePro(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductByCode + '?c_id=' + this_.userInfo.c_id + '&c_type=' + this_.userInfo.c_type + '&code=' + this_.scode,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					console.log(res);
					uni.hideLoading();
					this_.proList = res.data;
				},error => {
					console.log(error);
				});
			},
			
			//点击产品列表进入详情
			toDetail(item){
				let this_ = this;
				uni.navigateTo({
				 	url: '../detail/detail?code='+item.erpcode + '&type=index'
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
			}
		}
	}
</script>
<style scoped>
.umar-l{
	margin-left: 10rpx;
}
.index-search-txt{
	width: 70%;
}
.index-search-btn{
	width: 18%;
}
.example-tag .tag-active{
	background-color:#2d79f1;
	border-radius: 12rpx;
	-webkit-border-radius:12rpx;
}
.example-level{
	text-align: left;
}
.pl15{
	padding-left: 15px;
	border-left: #0033BF 2px solid;
	margin-bottom: 8px;
	font-size: 14px;;
}
.pl25{
	padding-left: 25px;
	margin-bottom: 8px;
	font-size: 12px;
}
.viewleve1{
	line-height: 26px;
}
.iconfont{
	font-size: 24rpx;
}
.example-level{
	width: 320px;
	margin-top: 10px;
}
</style>