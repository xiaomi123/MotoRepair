<template>
	<view class="evalList-container">
		<view v-for="(item,index) in list">
			<view class="evalList-list">
				<view style="margin-bottom: 10rpx;">
					<view>我想要：{{item.w_note}}</view>
					<view class="am-text-right">{{item.w_create_time.substr(0,10)}}</view>
				</view>
				<view class="reply-box" v-if="item.w_content_reply != null">
					<view>回复：{{item.w_content_reply}}</view>
					<view class="am-text-right">{{item.w_time_reply.substr(0,10)}}</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},//用户信息
				list:[]
			}
		},
		onLoad(){
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					this_.getList();
			    }
			});
		},
		
		methods: {
			getList(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.Wish+"?c_id="+this_.userInfo.c_id,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					console.log(res);
					this_.list = res.data;
				}, error => {
					console.log(error);
				});
			}
		}
	}
</script>

<style>
.evalList-list{
	padding: 3% 4%;
	border-bottom: 1px solid #EEEEEE;
}
.reply-box{
	background: #eee;
	padding: 2%;
}
</style>
