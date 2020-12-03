<template>
	<view class="login-container"></view>
</template>

<script>
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	export default {
		components:{
			uniSteps
		},
		data() {
			return {
				openId:'',
				action:'',//跳转action,为空不跳转
				ma001:'',
				userInfo:'',
				agentInfo:{
					c_tel:'',
					c_tel1:'',
					c_nickname:'',
					c_prov:'',
					c_city:'',
					c_address:'',
					c_state:'1'
				},
			}
		},
		onLoad(option) {
			let this_ = this;
			this_.openId = option.openid;
			this_.action = option.action;
			//http://tiangang.htqp.com.cn:2345/#/?openid=o8L2xxHTyciyNQB-dB7xVXtL5WVY&action=agent/newrepair
			//http://gao.vocen.cn:8044/#/?openid=oGB5R6gFngIvEhACmX-y7sQWPjQU&action=preview
			if(!this_.$check.isEmpty(this_.openId)){
				//根据openid获取用户信息
				uni.showLoading();
				this_.$http.httpRequest({
					url:this_.$api.CustomerInfo+'?openid='+ this_.openId,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					//判断用户信息是否为空
					if(!this_.$check.isEmpty(res.data[0])){
						this_.userInfo = res.data[0];
						//补录信息回显
						this_.agentInfo.c_nickname = this_.userInfo.c_nickname;
						this_.agentInfo.c_tel = this_.userInfo.c_tel;
						this_.agentInfo.c_tel1 = this_.userInfo.c_tel1;
						this_.agentInfo.c_address = this_.userInfo.c_address;
						
						//产品展示
						if(this_.action.split(',')[0].indexOf("preview") != -1){
							uni.reLaunch({
								url:'../tourist/index/index?tag=preview'
							})
						}
						
						if((res.data[0].c_type == 1) && (res.data[0].c_state != 0)){
							uni.reLaunch({
								url: '../tourist/index/index?tag='
							});
						}else{
							//判断信息是否填写 --0填写过，1未填写 
							//判断是否待审核或未开通订单
							if(res.data[0].c_state ==-1 ||res.data[0].c_state ==1 || res.data[0].c_state ==2){
								uni.reLaunch({
									url: '../tourist/index/index'
								});
							}else{
								//判断连接是否含action,点击推送消息进入
								if(!this_.$check.isEmpty(this_.action)){
									if(this_.action.indexOf(",") != -1){
										if(this_.action.split(',')[0].indexOf("message") != -1){
											uni.reLaunch({
												url: '../'+ this_.action.split(',')[0] + '?data=' + this_.action.split(',')[1]
											}); 
										}else{
											//代理商-修理厂订单列表,修理厂-订单列表页面,
											if(this_.action.split(',').length > 2){
												uni.reLaunch({
													url: '../'+ this_.action.split(',')[0] + '?id=' + this_.action.split(',')[1] +'&type=' + this_.action.split(',')[2]
												}); 
											}else{
												uni.reLaunch({
													url: '../'+ this_.action.split(',')[0] + '?id=' + this_.action.split(',')[1]
												}); 
											}
											
										}
										
										
									}else{
										//代理商-客户管理,修理厂-收藏夹,
										uni.reLaunch({
											url: '../'+ this_.action
										}); 
									}
								}else if(res.data[0].c_type == 1){
									uni.reLaunch({
										url: '../repairShop/index/index'
									}); 
								}else if(res.data[0].c_type == 3){
									uni.reLaunch({
										url: '../repairShop/customerIndex/customerIndex'
									}); 
								}else if(res.data[0].c_type == 0){
									uni.reLaunch({
										url: '../agent/index/index'
									});
								}
								// }else if(res.data[0].c_type == 1){
								// 	uni.reLaunch({
								// 		url: '../repairShop/index/index'
								// 	}); 
								// }else if(res.data[0].c_type == 0 || res.data[0].c_type == 2 || res.data[0].c_type == 3 || res.data[0].c_type == 4 || res.data[0].c_type == 5){
								// 	uni.reLaunch({
								// 		url: '../agent/index/index'
								// 	});
								// }
								
							}
						}
						uni.setStorage({
							key: 'userInfo',
							data: res.data,
							success: function () {
								console.log('success');
								console.log(this_.userInfo)
							}
						});
					}else{
						//用户信息为空
						// uni.reLaunch({
						// 	url: '../tourist/index/index'
						// });
					}  
                },error => {
					console.log(error);
				});
				
			}else{
				//无openid
			}
		}
	}
</script>