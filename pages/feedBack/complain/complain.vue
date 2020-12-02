<template>
	<view class="wapper">
		<textarea class="input-view" v-model="remark" placeholder="请留下您的宝贵意见..." />
		<view class="btn-box">
			<button type="primary" size="default" @click="submit()">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo : {},
				remark : "",
				dealOpenid : "", //处理人openid
				formId : "", //当前投诉信息主键id
			}
		},
		onLoad(option){
			let this_ = this;
			if(option.id != "undefined"){
				this_.formId = option.id;
				this_.dealOpenid = option.openid
				uni.setNavigationBarTitle({
					title:"回复"
				})
			}
			
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					this_.userInfo = res.data[0];
					this_.getAcceptUser();
				}
			});
		},
		methods: {
			//获取接收人列表
			getAcceptUser(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.CustomerComplain,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					console.log(res);
					let result = res.data;
					res.data.forEach((item,index) => {
						if(item.openid == this_.userInfo.c_openid){
							this_.dealOpenid = item.openid;
						}
					})
					
				}, error => {
					console.log(error);
				});
			},
			submit(){
				let this_ = this;
				console.log(this_.userInfo.c_openid+";dealOpenid:"+this_.dealOpenid+";this_.formId"+this_.formId);
				if(this_.$check.isEmpty(this_.remark)){
					uni.showToast({
						title: "请留下您的宝贵意见",
						duration:1500,
						icon : "none"
					})
					return;
				}
				this_.$http.httpTokenRequest({
					url: this_.$api.CustomerComplain,
					method: 'POST',
					data: {
						useropenid : this_.userInfo.c_openid,
						cid : this_.userInfo.c_id,
						message : this_.remark,
						openid : this_.dealOpenid,
						isreply : 0,
						id : this_.formId,
						method : 'add',
						isprefect : ''
					},
				}).then(res => {
					//请求成功
					console.log(res);
					if(res.data.State){
						uni.showToast({
							icon : "none",
							title: res.data.Message,
							duration:1500
						})
						setTimeout(function(){
							uni.redirectTo({
								url:'../complainRecord/complainRecord'
							})
						},1500)
					}else{
						uni.showToast({
							icon : "none",
							title: res.data.Message,
							duration:1500
						})
					}
				}, error => {
					console.log(error);
				});
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url : "../complainRecord/complainRecord"
			})
		}
	}
</script>

<style>
	.wapper{
		margin: 20rpx 20rpx 24rpx 20rpx;
	}
	.input-view{
		width: 100%;
		border:1px solid #DDDDDD;
		padding: 10rpx 0;
		text-indent: 60rpx;
	}
	.btn-box{
		margin: 60rpx 30rpx 0;
	}
</style>
