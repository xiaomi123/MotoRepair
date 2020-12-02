<template>
	<view>
		<view class="umar-a">
			<form @submit="formSubmit" class="am-form">
				<view class="ub ub-f1 ub-ac am-bg-white am-form-group">
					<view class="ub am-label">手机号:</view>
					<view class="ub ub-f1">
						<input type="number" name="phone" maxlength="11" placeholder="请输入手机号" value="" />
					</view>
				</view>
				<view class="uni-btn-v">
					<button form-type="submit" class="am-btn-primary">提交</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				var formdata = e.detail.value
				uni.navigateBack();
			},
			formReset: function(e) {
				console.log('清空数据')
			}
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
		font-size: 32rpx;
	}
	.umar-a{
		margin: 60rpx 40rpx;
	}
</style>
