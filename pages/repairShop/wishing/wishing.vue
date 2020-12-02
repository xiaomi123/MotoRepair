<template>
	<view>
		<view class="top ub ub-ver am-text-white">
			<text class="ub umar-b">我的许愿池</text>
			<text class="ub f26">你的心愿，我们助你达成...</text>
		</view>
		<view class="container">
			<view class="ub ub-ver ub-ac ub-pc">
				<text class="ub f40 umar-b1">我想要</text>
				<text class="history" @click="history()">历史愿望</text>
				<view class="ub" style="width: 80%;">
					<view class="ub">
						<image class="icon-heart" src="../../../static/images/menu5.png" mode="widthFix"></image>
					</view>
					<view class="ub ub-f1 ub-ac ubb uinn">
						<!-- <input type="text" v-model="wish" placeholder="写下你的愿望吧" :disabled="isDisabled" class="f28 ub ub-f1" /> -->
						<input type="text" v-model="wish" placeholder="写下你的愿望吧" class="f28 ub ub-f1" />
						<text class="f28 am-text-primary" @click="evalSubmit()">提交</text>
					</view>
				</view>
				<!-- <text class="f30 am-text-99" style="margin-top: 10rpx;" v-if="serviceReply != ''">客服回复：{{serviceReply}}</text> -->
			</view>
			<view class="img-panel">
				<view class="ub ub-ac">
					<view class="ub ub-f1">
						<view class="pop pop-bg1">我想要螺丝刀</view>
					</view>
					<view class="ub ub-ver ub-f1">
						<view class="pop pop-bg3 umar-b2">我想要千斤顶</view>
						<view class="pop pop-bg2">我想要举升机</view>
					</view>
				</view>
				<image class="bg-img" src="../../../static/images/wishingbg.png" mode="widthFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	export default {
		components:{
			uniTag
		},
		data() {
			return {
				userInfo:{},//用户信息
				isDisabled:false,
				wish : '', //愿望
				serviceReply : "" //客服回复
			}
		},
		onLoad(option) {
			console.log(option);
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					console.log(res);
					this_.userInfo = res.data[0];
					//this_.getWish();
			    }
			});
		},
		onShow(){
			this.wish = "";
		},
		// onNavigationBarButtonTap(e){
		// 	uni.navigateTo({
		// 		url : '../wishingList/wishingList'
		// 	})
		// },
		methods: {
			//提交愿望
			evalSubmit(){
				let this_ = this;
				if(this_.wish == ""){
					uni.showToast({
						icon : 'none',
						title:'请许下你的愿望!',
						duration:1500
					})
					return;
				}
				this_.$http.httpTokenRequest({
					url: this_.$api.Wish,
					method: 'POST',
					data: {
						c_id:this_.userInfo.c_id,
						c_nickname: this_.userInfo.c_nickname,
						c_tel : this_.userInfo.c_tel,
						c_headimgurl : this_.userInfo.c_headimgurl,
						type : this_.wish,
						note : this_.wish
					},
				}).then(res => {
					//请求成功
					console.log(res.data);
					uni.showToast({
						icon : 'none',
						title : res.data.Message,
						duration:5000
					});
					if(res.data.State){
						setTimeout(() => {
							uni.navigateTo({
								url:'../wishingList/wishingList'
							})
						},1500)
					}
				}, error => {
					console.log(error);
				});
			},
			//历史愿望
			history(){
				uni.navigateTo({
					url : '../wishingList/wishingList'
				})
			}
		}
	}
</script>

<style scoped>
	.evaluate-container{
		padding:4%;
		font-size:28rpx;
	}
	.top{
		background-color: #3179F2;
		height: 170rpx;
		padding-left: 90rpx;
	}
	.container{
		margin-top: 80rpx;
		position: relative;
	}
	.umar-b{
		margin-bottom: 10rpx;
	}
	.f40{
		font-size: 40rpx;
	}
	.icon-heart{
		width: 20px;
		height: 20px;
	}
	.icon-pen{
		width: 14px;
		height: 14px;
	}
	.ubb{
		border-bottom: 2px solid #CCCCCC;
	}
	.uinn{
		padding: 0 10rpx 10rpx 20rpx;
	}
	.umar-b1{
		margin-bottom: 80rpx;
	}
	.umar-b2{
		margin-bottom: 30rpx;
	}
	.img-panel{
		text-align: center;
		margin: 80rpx 20rpx 0;
	}
	.bg-img{
		width: 90%;
		margin-top: -9%;
		z-index: -1;
	}
	.pop-bg1{
		background-image: url('~@/static/images/pop1.png');
	}
	.pop-bg2{
		background-image: url('~@/static/images/pop2.png');
	}
	.pop-bg3{
		background-image: url('~@/static/images/pop3.png');
	}
	.pop{
		width: 258rpx;
		height: 113rpx; 
		display: block;
		background-size: 100%;
		font-size: 26rpx;
		color: #FFFFFF;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 90rpx;
		padding: 0 10rpx;
	}
	.history{
		position: absolute;
		top:-6%;
		right: 4%;
		color: #808080;
		font-size: 32rpx;
		border:1px solid #DEDEDE;
		padding: 8rpx 15rpx;
		border-radius: 10rpx;
	}
</style>
