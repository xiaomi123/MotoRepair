<template>
	<view class="collect-container">
		<view class="index-content">
			<view class="index-product" v-if="collList.length>0">
				<view class="index-list" v-for="(item,index) in collList" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<view class="index-uinn">
						<text class="index-title">{{item.title}}</text>
						<view>售价:<text class="am-text-danger">￥</text><text class="index-price">{{item.currentprice}}</text></view>
						<!-- <view class="index-txt">
							<text>型号:{{item.productmodel}}</text>
						</view>
						<view class="index-txt"><text>适用范围:{{item.suitable}}</text></view> -->
						<view class="index_collect ub ub-ac">
							<text class="ub f32 am-blod" v-if="item.a_id > 0">赠</text>
							<text class="iconfont ub umar-l" @click.stop="collCancle(item,index)">&#xe7bd;</text>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="com-nodata">暂无数据</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},//用户信息
				collList:[],//收藏列表
			}
		},
		onLoad() {
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					this_.getCollect();
			    }
			});
		},
		methods: {
			//收藏列表
			getCollect(){
				let this_ = this;
				//获取收藏产品列表
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.GetFavorite+'?c_id='+ this_.userInfo.c_id,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					this_.collList = res.data;
				},error => {
					console.log(error);
				});
			},
			//取消收藏
			collCancle(item,index){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.DelFavorite,
					method:'POST',
					data:[{"f_id":item.f_id}],
				}).then(res => {
					if(res.data.State){
						//请求成功
						this_.collList.splice(index,1);
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
			//点击产品列表进入详情
			toDetail(item){
				//console.log(item);
				let this_ = this;
				uni.navigateTo({
				 	url: '../detail/detail?code='+item.erpcode + '&a_id=' + item.a_id
				}); 
			},
			
		},
		
	}
</script>
