<template>
	<view>
		<view class="content">
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-top="scrollTop"  @scrolltoupper="loadHistory" upper-threshold="50">
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="!scrollAnimation">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="row" v-for="row in msgList">
					<!-- 自己发出的消息 -->
					<view class="my" v-if="row.m_isreply==1">
						<view class="left" style="flex-direction: column;align-items: flex-end;">
							<view class="f28">{{row.expr1}}</view>
							<view class="f28" style="color: #808080;">{{row.m_create_date}}</view>
							<view class="bubble">
								<rich-text :nodes="row.m_message" v-if="row.m_type == 'text'"></rich-text>
								<image class="message_img" :src="row.m_message" mode="widthFix" v-else-if="row.m_type == 'image'"></image>
							</view>
						</view>
						<view class="right">
							<image :src="row.c_headimgurl" v-if="row.c_headimgurl != null"></image>
							<image src="@/static/images/service.png" v-else></image>
						</view>
					</view>
					<!-- 别人发出的消息 -->
					<view class="other" v-if="row.m_isreply==0">
						<view class="left">
							<image :src="row.c_headimgurl"></image>
						</view>
						<view class="right" style="flex-direction: column;align-items: flex-start;">
							<view class="f28">{{row.expr1}}</view>
							<view class="f28" style="color: #808080;">{{row.m_create_date}}</view>
							<view class="bubble">
								<rich-text :nodes="row.m_message" v-if="row.m_type == 'text'"></rich-text>
								<image class="message_img" :src="row.m_message" mode="widthFix" v-else-if="row.m_type == 'image'"></image>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 底部输入栏 -->
		<view class="input-box"  @touchmove.stop.prevent="discard">
			<view class="textbox">
				<view class="text-mode">
					<view class="box">
						<textarea auto-height="true" v-model="textMsg" :disabled="disabled" />
					</view>
				</view>
			</view>
			<view class="send" @tap="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				userInfo:{},
				repairOpenId:'',//修理厂openid
				textMsg:'',
				isHistoryLoading:false,
				scrollAnimation:false,
				scrollTop:0,
				scrollToView:'',
				msgList:[],
				willStop:false,
				disabled: false,
				pageCount:0,
				pageSize : 10,
				p : 1,
				timer:null,
				
			};
		},
		onLoad(option) {
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					console.log(res);
					this_.userInfo = res.data[0];
					this_.repairOpenId = option.data;
			    }
			});
			this_.getMsgList();
			this_.timer = setInterval(() => {
				this_.getMsgList();
			},5000)
			
		},
		onUnload(){
			let this_ = this;
			if(this_.timer){
				clearInterval(this_.timer);  
				this_.timer = null; 
			}
		},
		onShow(){
			this.scrollTop = 9999999;
		},
		methods:{
			//触发滑动到顶部(加载历史信息记录)
			loadHistory(e){
				console.log(this.isHistoryLoading);
				if(this.isHistoryLoading){
					return ;
				}
				this.isHistoryLoading = true;//参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false;//关闭滑动动画
				//let Viewid = this.msgList[0].m_id;//记住第一个信息ID
				//本地模拟请求历史记录效果
				setTimeout(()=>{
					this.p++;
					if(this.p <= this.pageCount){
						this.getMsgList();
					}
					//这段代码很重要，不然每次加载历史数据都会跳到顶部
					this.$nextTick(function() {
						//this.scrollToView = 'msg'+Viewid;//跳转上次的第一行信息位置
						this.$nextTick(function() {
							this.scrollAnimation = true;//恢复滚动动画
						});
						
					});
					this.isHistoryLoading = false;
				},1000)
			},
			// 加载初始页面消息
			getMsgList(){
				// 消息列表
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.ReplyMessage+'?openid='+this.repairOpenId+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					method: 'GET',
					data: {},
				}).then(res => {
					console.log(res);
					if(this_.p > 1){
						let new_arr = res.data.rows.unshift(0,0);
						Array.prototype.splice.apply(this_.msgList,new_arr);
					}else{
						this_.msgList = res.data.rows;
					}
					this_.scrollAnimation = !this_.scrollAnimation;
					this_.papeTotal(res.data.total);
					this_.scrollBottom(9999);
				}, error => {
					console.log(error);
				});
				
			},
			//获取总页数
			papeTotal(rowCount){
				let this_ = this;
				if(rowCount != null && rowCount != ""){
					if(rowCount % this_.pageSize == 0){
						this_.pageCount = parseInt(rowCount / this_.pageSize);
					}else{
						this_.pageCount = parseInt(rowCount / this_.pageSize) + 1;
					}
				}else{
					return 0;
				}
			},
			// 发送消息
			sendText(){
				let this_ = this;
				if(this_.disabled){
					return;
				}
				if(!this_.textMsg){
					return;
				}
				this_.disabled = true;
				this_.$http.httpTokenRequest({
					url: this_.$api.ReplyMessage,
					method: 'POST',
					data: {
						useropenid : this_.repairOpenId,
						agentopenid : this_.userInfo.c_openid,
						message :this_.textMsg
					},
				}).then(res => {
					//请求成功
					this_.msgList.push({
						c_headimgurl : this_.userInfo.c_headimgurl,
						m_isreply : 1,
						m_message : this_.textMsg,
						expr1 : this_.userInfo.c_nickname
					});
					this_.textMsg = '';//清空输入框
					this_.disabled = false;
					this_.scrollBottom(99999999);
					
				}, error => {
					console.log(error);
				});
			},
			// 滚动到底部
			scrollBottom(number){
				let this_ = this;
				this_.$nextTick(function() {
					//进入页面滚动到底部
					this_.scrollTop = number;
					this_.$nextTick(function() {
						this_.scrollAnimation = true;
					});
					
				});
			}
		}
	}
</script>
<style lang="scss">
	@import "@/common/css/style.scss"; 
	.message_img{
		width: 250rpx;
		height: 250rpx;
	}
</style>