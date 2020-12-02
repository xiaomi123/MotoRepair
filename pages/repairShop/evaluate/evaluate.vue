<template>
	<view class="evaluate-container">
		<view class="evaluate-list">
			星级评价：
			<view class="evaluate-star">
				<view class="evaluate-icon" @click="starLevel(index)" v-for="index in 5">
					<text v-if="index<=r_star_level" class="iconfont starActive">&#xe629;</text>
					<text v-else class="iconfont">&#xe60c;</text>
				</view>
			</view>
		</view>
	    <view class="evaluate-list">
	    	描述：
	    	<view>
	    		<textarea class="evaluate-txt" placeholder="说说你的意见,我们会做的更好~~~~~~~~~~~说说你的感受,为更多小伙伴购买提供参考~" v-model="r_content" />
	    	</view>
	    </view>
		<button type="primary" @click="evalSubmit()">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},//用户信息
				params : {},
				r_star_level:0,//星级描述
				r_content:'',//回复内容
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
					this_.params = JSON.parse(option.data);
			    }
			});
		},
		methods: {
			//星级评价
			starLevel(index){
				let this_ = this;
				this_.r_star_level = index;
			},
			//提交评价
			evalSubmit(){
				let this_ = this;
				console.log(this_.params);
				if(this_.r_star_level == 0){
					uni.showToast({
						icon : 'none',
						title : '你还没选星～',
						duration:1500
					});
					return false;
				}
				this_.$http.httpTokenRequest({
					url: this_.$api.review,
					method: 'POST',
					data: {
						c_id:this_.userInfo.c_id,
						s_ma001:this_.params.s_c_ma001,
						s_ma002:this_.params.s_ma002,
						s_m_id:this_.params.s_m_id,
						s_id:this_.params.i_s_id,
						i_id:this_.params.i_id,
						r_star_level:this_.r_star_level,
						r_content:this_.r_content
						// c_ma002:this_.userInfo.c_ma002
					},
				}).then(res => {
					//请求成功
					console.log(res.data);
					uni.showToast({
						icon : 'none',
						title : res.data.Message+'恭喜您获得100积分',
						duration:1500
					});
					setTimeout(function(){
						uni.reLaunch({
						 	url: '../evalList/evalList?id=0'
						}); 
					},1500);
					
				}, error => {
					console.log(error);
				});
			},
		}
	}
</script>

<style scoped>
	.evaluate-container{
		padding:4%;
		font-size:28rpx;
	}
	.evaluate-star{
		margin:5% 0;
		display: flex;
		display: -webkit-flex;
	}
	.evaluate-icon{
		margin-right:1%;
		color:#999;
	}
	.starActive{
		color:#ff7f50;
	}
	.evaluate-txt{
		width: auto;
		margin:5% 0;
		padding:4%;
		font-size:28rpx;
		color:#343434;
		border:1px solid #ddd;
	}
</style>
