<template>
	<view>
		<view class="rmcxList">
			<view class="index-content">
				<uni-grid :column="2" :show-border="false" :square="false" :highlight="false">
					<uni-grid-item v-for="(item,index) in cartList" style="width: 44.5%;">
						<view class="ub ub-ac" @click="toHotCart(item)" >
							<view class="ub ub-f1 am-blod f28">{{item.name}}</view>
							<view class="ub">
								<!--<image class="cx-image" src="http://tiangang.htqp.com.cn:2345/Upload/Product/1280103/9498e71c14154e76a1679d6af632ebea.jpg" mode="widthFix" /> -->
								<image class="cx-image" :src="item.imgPath" mode="aspectFill"></image>
							</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cartList : getApp().globalData.carsType
			}
		},
		methods: {
			toHotCart(item) {
				uni.navigateTo({
					url : '../hotCart/hotCart?code='+item.code
				})
			}
		}
	}
</script>

<style>
.rmcxList{
	margin-top: 30rpx;
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
.uni-grid-item{
	margin-right: 2%;
}
.rmcxList .uni-grid-item:nth-child(even){
	margin-right: 0;
}
.cx-image{
	width: 100rpx;
	height: 100rpx;
	display: block;
}
.rmcxList .uni-grid-item:nth-child(2n){
	background-color: #C9D4F0;
}
.rmcxList .uni-grid-item:nth-child(2n+1),
.rmcxList .uni-grid-item:nth-child(3){
	background-color: #EEEEEE;
}
.rmcxList .uni-grid-item{
	padding: 15rpx;
	margin-bottom: 15rpx;
}
</style>
