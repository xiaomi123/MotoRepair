<template>
	<view class="myorder_container f28">
		<!-- tabItem -->
		<view class="am-fixedBar" ref="tabitem">
			<uni-segmented-control class="tab-bar" :current="tabIndex" :values="tabItems" @clickItem="onClickTab" style-type="text" active-color="#3079F3"></uni-segmented-control>
		</view>
		<view :style="{marginTop:`${marginTop}px`}">
			<view class="order-list-item ub-box-shadow" v-for="(item,index) in list">
				<view class="ub ub-ac am-bg-active am-text-white order-uinn uc-at">投诉时间：{{item.c_create_date}}</view>
				<view class="order-uinn">
					<view class="umar-b">投诉内容：<text class="am-text-99">{{item.c_message}}</text></view>
					<template v-for="(reply,key) in item.replylist">
						<view class="umar-b">回复内容：<text class="am-text-99">{{reply.c_message}}</text></view>
						<view class="umar-b">回复时间：<text class="am-text-99">{{reply.c_create_date}}</text></view>
					</template>
					<view class="ub am-btn-panel ub-ac">
						<template v-if="isManager == 1">
							<view class="ub ub-f1 ub-pe" v-if="tabIndex == 0">
								<view class="ub">
									<button class="f24 am-btn-danger umar-r" @click="zhipai(index)">指派</button>
								</view>
								<view class="ub">
									<button class="f24 am-btn-primary"  @click="reply(item)">回复</button>
								</view>
							</view>
							<view class="ub ub-f1 ub-pe" v-if="tabIndex == 1">
								<view class="ub ub-f1 ub-pe am-text-danger">等待用户评价</view>
							</view>
							<view class="ub ub-f1 ub-pe" v-if="tabIndex == 2">
								<view class="ub am-text-danger" v-if="item.c_isprefect == 0">不满意</view>
								<view class="ub am-text-primary" v-else-if="item.c_isprefect == 1">满意</view>
							</view>
						</template>
						<template v-else-if="isManager == 0">
							<view class="ub ub-f1 ub-pe" v-if="tabIndex == 0">
								<view class="ub">
									<button class="f24 am-btn-primary" @click="reply(item)">回复</button>
								</view>
							</view>
							<view class="ub ub-f1 ub-pe" v-if="tabIndex == 1">
								<view class="ub ub-f1 ub-pe am-text-danger">等待用户评价</view>
							</view>
							<view class="ub ub-f1 ub-pe" v-if="tabIndex == 2">
								<view class="ub am-text-danger" v-if="item.c_isprefect == 0">不满意</view>
								<view class="ub am-text-primary" v-else-if="item.c_isprefect == 1">满意</view>
							</view>
						</template>
						<template v-else>
							<view class="ub ub-f1 ub-pe am-text-danger" v-if="tabIndex == 0">待处理</view>
							<view class="ub ub-f1 ub-pe" v-if="tabIndex == 1">
								<view class="ub">
									<button class="f24 am-btn-danger umar-r" @click="submit(item,0)">不满意</button>
								</view>
								<view class="ub">
									<button class="f24 am-btn-primary" @click="submit(item,1)">满意</button>
								</view>
							</view>
							<view class="ub ub-f1 ub-pe" v-if="tabIndex == 2">
								<view class="ub am-text-danger" v-if="item.c_isprefect == 0">不满意</view>
								<view class="ub am-text-primary" v-else-if="item.c_isprefect == 1">满意</view>
							</view>
						</template>
					</view>
				</view>
			</view>
		</view>
		<!-- 选择指派人 -->
		<view class="dialog" v-if="isShow">
			<view class="main">
				<view class="title">请选择指派人</view>
				<view class="ub">
					<view :class="item.checked ? 'tag-item active' : 'tag-item'" v-for="(item,index) in acceptUser" @click="checkAccpetUser(index)">{{item.username}}</view>
				</view>
				<view>
					<button class="am-btn am-btn-default" @click="cancelAccept()">取消</button>
					<button class="am-btn am-btn-primary" @click="confirmAccept()">确认</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import wx from '@/common/js/jwweixin.js'
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components:{
			uniSegmentedControl,
			uniLoadMore
		},
		data() {
			return {
				userInfo: {}, //用户信息
				pageSize:10,
				p:1,
				state:[0,1,2],
				tabItems: ['待处理','待评价','已完成'],
				//badge:[0,0,0,0],
				tabIndex: 0,
				marginTop: '',
				timer:null,
				list : [],
				isManager : 2, //是否为巩秘方
				isShow: false,
				acceptUser :[], //指派人列表
				listIndex : '',
				dealOpenid : '' //处理人openid
			}
		},
		onLoad(option) {
			//读取存储数据
			let this_ = this;
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					this_.userInfo = res.data[0];
					this_.getAcceptUser();
					
				}
			});
			
		},
		mounted() {
			this.marginTop = this.$refs.tabitem.$el.getBoundingClientRect().height;
		},
		//上拉加载
		onReachBottom (){
			if(this.p < this.pageCount){
				this.p++;
				this.status = 'loading';
				this.getList();
			}else{
				this.status = 'noMore';
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.p = 1;
			setTimeout(function(){
				uni.stopPullDownRefresh();
			},1500)
		},
		methods: {
			//tab切换
			onClickTab(e){ 
				let this_ = this;
				if (this_.tabIndex !== e.currentIndex) {
					this_.p = 1;
					this_.tabIndex = e.currentIndex;
					this_.getList();
				}
			},
			//获取接收人列表
			getAcceptUser(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.CustomerComplain,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					console.log("指派人列表");
					console.log(res);
					let result = res.data;
					res.data.forEach((item,index) => {
						if(item.openid == this_.userInfo.c_openid){
							this_.dealOpenid = item.openid;
							this_.isManager = item.ismanager;
							// if(item.ismanager == 1){
							// 	this_.isManager = 1;
							// }else if(item.ismanager == 0){
							// 	this_.isManager = 0;
							// }
						}
					})
					this_.acceptUser = res.data.filter(item => {
						item.checked = false;
						return item.ismanager == 0;
					})
					this_.getList();
				}, error => {
					console.log(error);
				});
			},
			//选择指派人
			checkAccpetUser(index){
				let this_ = this;
				this.acceptUser.forEach((item,key) => {
					if(key == index){
						item.checked = true;
						this_.dealOpenid = item.openid;
					}else{
						item.checked = false;
					}
				})
			},
			confirmAccept(){
				let this_ = this;
				for(let i = 0; i < this_.list.length; i++){
					if(i == this_.listIndex){
						this_.isShow = false;
						this.submit(this_.list[i],'');
					}
				}
			},
			cancelAccept(){
				this.isShow = false;
			},
			//指派
			zhipai(e){
				this.listIndex = e;
				this.isShow = !this.isShow;
			},
			//回复
			reply(e){
				uni.navigateTo({
					url : '../complain/complain?id='+e.c_id+"&openid="+e.c_create_openid
				})
			},
			//获取列表
			getList() {
				let this_ = this;
				/*useropenid:当前登录用户
			      openid:推送用户
				*/
				this_.$http.httpTokenRequest({
					url: this_.$api.CustomerComplain+"?useropenid="+this_.userInfo.c_openid+"&type="+this_.state[this_.tabIndex]+"&pageindex="+this_.p+"&pagesize="+this_.pageSize,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					console.log("投诉列表");
					console.log(res);
					console.log(JSON.parse(res.data.rows));
					//console.log("isManager:"+this_.isManager);
					this_.list = JSON.parse(res.data.rows);
				}, error => {
					console.log(error);
				});
			},
			getBadge(){
				
			},
			//选择指派人、提交评价
			submit(obj,isprefect){
				let this_ = this;
				console.log("id:"+obj.c_id+";isprefect:"+isprefect+";dealOpenid:"+this_.dealOpenid);
				this_.$http.httpTokenRequest({
					url: this_.$api.CustomerComplain,
					method: 'POST',
					data: {
						useropenid : isprefect != "" ? this_.userInfo.c_openid : obj.c_openid,
						cid : isprefect != "" ? this_.userInfo.c_id : obj.c_c_id,
						message : obj.c_message,
						openid : this_.dealOpenid,
						isreply : isprefect != "" ? 1 : 0,
						id : obj.c_id,
						method : 'modify',
						isprefect : isprefect
					},
				}).then(res => {
					//请求成功
					console.log("选择指派人、提交评价");
					console.log(res);
					if(res.data.State){
						uni.showToast({
							icon : "success",
							title: res.data.Message,
							duration:1500
						})
						setTimeout(function(){
							this_.getList();
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
		}
	}
</script>

<style>
	.am-fixedBar{
		top: 44px;
	}
	.umar-r{
		margin-right: 20rpx;
	}
	.tab-bar{
		width: 80%;
		margin: 0 auto;
	}
	.am-btn-panel{
		border-top:1px solid #EEEEEE;
		padding-top: 15rpx;
	}
	.uc-at{
		border-top-left-radius: 15rpx;
		border-top-right-radius: 15rpx;
	}
	.dialog{
		background-color: rgba(0,0,0,0.5);
		width: 100%;
		position: fixed;
		top:0;
		left:0;
		bottom: 0;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.dialog .main{
		width: 80%;
		background-color: #FFFFFF;
		padding: 20rpx;
		border-radius: 10rpx;
	}
	.dialog .main .title{
		padding-bottom: 30rpx;
	}
	.dialog .main .tag-item{
		border: 1px solid #DEDEDE;
		width: 29%;
		display: block;
		float: left;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		padding: 10rpx 0;
		text-align: center;
		border-radius: 10rpx;
	}
	.dialog .main .tag-item:nth-child(3n){
		margin-right: 0;
	}
	.dialog .main .active{
		border: 1px solid #0090CE;
		background-color: #0090CE;
		color: white;
	}
	.dialog .main .am-btn{
		width: 47%;
		margin-top: 30rpx;
		display: inline-block;
		margin-right: 3%;
	}
	.dialog .main .am-btn:last-child{
		margin-right: 0;
	}
</style>
