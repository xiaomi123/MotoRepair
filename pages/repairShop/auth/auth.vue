<template>
	<view>
		<view class="">
			<form class="am-form uinn-t">
				<view class="ub ub-f1 ub-ac am-form-group am-bg-white">
					<view class="ub am-label">联系电话:</view>
					<view class="ub ub-f1">
						<input class="f32" type="number" v-model="agentInfo.c_tel" maxlength="11" placeholder="请录入联系电话" value="" disabled />
					</view>
				</view>
				<view class="ub ub-f1 ub-ac am-form-group am-bg-white">
					<view class="ub am-label">修理厂名称:</view>
					<view class="ub ub-f1">
						<input class="f32" type="text" v-model="agentInfo.c_nickname" placeholder="请录入修理厂名称" value="" disabled />
					</view>
				</view>
				<view class="ub ub-f1 ub-ac am-form-group am-bg-white">
					<view class="ub am-label">省份:</view>
					<view class="ub ub-f1">
						<input class="f32" type="text" v-model="agentInfo.c_prov" placeholder="请录入省份" value="" disabled />
					</view>
				</view>
				<view class="ub ub-f1 ub-ac am-form-group am-bg-white">
					<view class="ub am-label">区域:</view>
					<view class="ub ub-f1">
						<input class="f32" type="text" v-model="agentInfo.c_city" placeholder="请录入区域" value="" disabled />
					</view>
				</view>
				<view class="ub ub-f1 ub-ac am-form-group am-bg-white">
					<view class="ub am-label">详细地址:</view>
					<view class="ub ub-f1">
						<input class="f32" type="text" v-model="agentInfo.c_address" placeholder="请录入详细地址" value="" disabled />
					</view>
				</view>
				<!-- <view class="uni-btn-v">
					<button form-type="submit" class="am-btn-primary" @click="submitAgent()">提交</button>
				</view> -->
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				agentInfo:{
					c_tel:'',
					c_nickname:'',
					c_prov:'',
					c_city:'',
					c_address:'',
					c_state:'1'
				}
			}
		},
		onLoad() {
			//读取存储数据
			let this_ = this;
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					this_.userInfo = res.data[0];
					this_.agentInfo.c_nickname = this_.userInfo.c_nickname;
					this_.agentInfo.c_tel = this_.userInfo.c_tel;
					this_.agentInfo.c_address = this_.userInfo.c_address;
					this_.agentInfo.c_prov = this_.userInfo.c_prov;
					this_.agentInfo.c_city = this_.userInfo.c_city;
				}
			});
		},
		methods: {
			//修理厂信息补全
			/*submitAgent(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.UserAudit+'?c_id='+ this_.userInfo.c_id + '&ma001=' + this_.userInfo.c_ma001,
					method:'POST',
					data:this_.agentInfo,
				}).then(res => {
					uni.hideLoading();
					//请求成功
					if(res.data.State){
						uni.showToast({
							icon : 'none',
							title : '提交成功!',
							duration:1500
						});
					}
				},error => {
					console.log(error);
				});
				
			}*/
			// formSubmit: function(e) {
			// 	console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
			// 	var formdata = e.detail.value
			// 	uni.navigateBack();
			// }
		}
	}
</script>

<style scoped>
	page{
		background-color: #F8F8F8;
		font-size: 32rpx;
	}
	.uinn-t{
		padding-top: 20rpx;
	}
	.am-form .am-form-group{
		border-bottom: 1px solid #EEEEEE;
		margin-bottom: 0;
		border-radius: 0;
	}
</style>
