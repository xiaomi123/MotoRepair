<template>
	<view class="login-container"></view>
</template>

<script>
	export default {
		data() {
			return {
				ma001:'',
				type:'',
				m_id:'',
			}
		},
		onLoad(option) {
			let this_ = this;
			this_.ma001 = option.ma001;
			this_.type = option.type;
			this_.m_id = option.m_id;
			//代理商和修理厂扫码进入，注册
			this_.$http.httpRequest({
				url:this_.$api.CustQRCode+'?ma001='+ this_.ma001 + '&type='+this_.type + '&m_id=' + this_.m_id,
				method:'GET',
				data:{},
			}).then(res => {
				//请求成功
				console.log(res)
				window.location.href = res.data;
			},error => {
				console.log(error);
			});
			// uni.request({
			//  	url: 'http://tiangang.htqp.com.cn/api/CustQRCode?ma001='+this.ma001 + '&type='+this.type,//接口地址
			//  	header: {'content-type': 'application/x-www-form-urlencoded'},
			//  	method:"GET",
			//  	success: (res) => {
			// 		window.location.href = res.data;
			//  	}
			// });
			
		},
		methods: {
			
		}
	}
</script>

