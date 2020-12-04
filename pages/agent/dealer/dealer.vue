<template>
	<view class="dealer-container">
		<!-- 添加经销商弹层开始 -->
		<view class="login-dialog" v-show="isShow">
			<view class="login-dialog-cont">
				<view class="login-title">添加经销商<text class="iconfont login-dialog-close" @click="isShow=false">&#xe60f;</text></view>
				<view class="login-list">
					<text class="login-txt">名称</text>
					<input class="uni-input login-input" v-model="dealerInfo.m_name" placeholder="请录入名称" />
				</view>
				<view class="login-list02">
					<view class="login-list02-content">
						<view class="login-list">
							<text class="login-txt" style="width:70%;">省份</text>
							<input class="uni-input login-input" v-model="dealerInfo.m_prov" placeholder="请录入省份" />
						</view>
					</view>
					<view class="login-list02-content">
						<view class="login-list">
							<text class="login-txt" style="width:35%;text-align: right;">区域</text>
							<input class="uni-input login-input" v-model="dealerInfo.m_city" placeholder="请录入区域" />
						</view>
					</view>
				</view>
				<view class="login-list">
					<text class="login-txt">详细地址</text>
					<view class="login-area">
						<textarea class="login-area-txt" v-model="dealerInfo.m_address" placeholder="请录入详细地址" />
					</view>
				</view>
				<view class="login-dialog-btncont">
					<button type="default" class="login-dialog-btn" @click="isShow=false">取消</button>
					<button type="primary" class="login-dialog-btn" @click="dealerSub()">确定</button>
				</view>
				
			</view>
		</view>
		<!-- 添加经销商弹层结束 -->
		
		<!-- 生成二维码内容开始 -->
		<view>
			<view class="canvas" style="width:0;height:0;">
				<canvas canvas-id="qrcode" :style="{width: `${qrcodeSize}px`, height: `${qrcodeSize}px`,opacity:'0'}" />
				<uni-popup ref="showimage" type="center" :mask-click="true">
					<view class="uni-image">
						<view class="am-bg-white am-text-center dealer-name" :style="{width: `${qrcodeSize}px`}">{{dealerName}}</view>
						<image class="image" :src="qrcodeSrc" mode="scaleToFill" />
						<view class="uni-image-close" @click="cancelModal()">
							<uni-icons type="clear" color="#fff" size="30" />
						</view>
					</view>
				</uni-popup>
			</view>
		</view>
		<!-- 生成二维码内容结束 -->
		
		<!-- 主要内容开始 -->
		<view class="dealer-main f28">
			
			<view class="order-list-item ub-box-shadow" v-for="(list,index) in dealerList">
				<view class="list-item ub ub-ac am-bg-active order-uinn1">
					<view class="ub ub-f1">公司名称：{{list.m_name}}</view>
					<view class="ub"><switch :checked="list.m_state == 0 ? true : false" @change="switchAll($event,list)"  class="am-switch-sm" /></view>
				</view>
				<view class="order-uinn">
					<view class="list-item umar-b"><text class="am-text-99">收货地址：</text>{{list.m_prov + ' ' + list.m_city + ' ' + list.m_address}}</view>
					<view style="margin-top: 8rpx;">
						<view class="detail-table">
							<view class="detail-tr no-ubb">
								<view class="detail-td">经销商名称</view>
								<view class="detail-td">电话</view>
								<view class="detail-td">启用/停用</view>
							</view>
							<view class="detail-tr ub ub-ac" v-for="items in list.item">
								<view class="detail-td">{{items.c_nickname}}</view>
								<view class="detail-td" @click="tel(items.c_tel)">
									<a style="background-color: rgb(48, 121, 243); border-radius: 3rpx; padding: 0 5rpx; color: #F1F1F1;"><uni-icons type="phone" size="16" color="#FFFFFF"></uni-icons>{{items.c_tel}}</a>
								</view>
								<view class="detail-td" style="margin:0 auto;">
									<switch :id="items.c_id" :checked="items.c_state == '0'" @change.stop="switchChange($event,items)" :disabled="isSwitchAll" class="am-switch-sm" ref="switchs" />
								</view>
							</view>
						</view>
					</view>
					<view class="ub am-btn-panel ub-ac">
						<view class="ub ub-f1 ub-pe">
							<view class="ub umar-r">
								<button class="f24 am-btn-danger" @click="qrCode(list.m_ma001,list.m_id,list.m_name)">生成二维码</button>
							</view>
							<view class="ub umar-r">
								<button class="f24 am-btn-warning" @click="toEdit(list,index)">修改</button>
							</view>
							<view class="ub">
								<button class="f24 am-btn-primary" @click="toAllot(list)">调拨</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 主要内容结束 -->
		<button class="am-btn-fixed" type="primary" @click="toAdd()">+添加</button>
	</view>
</template>

<script>
	import uQRCode from '@/common/js/uqrcode.js'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		components:{
			uniPopup,
			uniIcons
		},
		data() {
			return {
				userInfo:{},//用户信息
				dealerList:[],//经销商
				isShow:false,//弹层
				curType:'',//判断添加还是修改
				curIndex:0,//选中行
				dealerInfo:{
					c_ma001:'',
					c_ma02:'',
					m_prov:'',
					m_city:'',
					m_name:'',
					m_address:'',
					m_type: '',
					m_type_note: '二级代理商'
				},//修改信息传参
				qrcodeText: '',
				qrcodeSize: 200,
				qrcodeSrc: '',
				isConfirm:false,//确认弹层
				isSwitchAll: false,
				dealerName: '', //二级代理商名称
				nameArr : ["","","经销商","镗缸厂","易损件","微车批发","车型件"]
			}
		},
		onLoad(option) {
			this.dealerInfo.m_type = option.m_type;
			uni.setNavigationBarTitle({
				title: this.nameArr[option.m_type]
			})
			this.init();
		},
		methods: {
			tel(phoneNum){
				uni.makePhoneCall({
				    phoneNumber: phoneNum //仅为示例
				});
			},
			init(){
				//读取存储数据
				let this_ = this;
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
						this_.userInfo = res.data[0];
						if(!this_.$check.isEmpty(this_.userInfo.c_ma001)){
							this_.dealerInfo.c_ma001 = this_.userInfo.c_ma001;
						}
						if(!this_.$check.isEmpty(this_.userInfo.c_ma002)){
							this_.dealerInfo.c_ma002 = this_.userInfo.c_ma002;
						}
						this_.getDealer();
				    }
				});
			},
			//生成二维码
			qrCode(ma001,mId,mName){
				let this_ = this;
				this_.dealerName = mName;
				this_.qrcodeText = 'http://gao.vocen.cn:8044/#/pages/QRCode?ma001='+ ma001 +'&type='+this_.dealerInfo.m_type+'&m_id=' + mId + '&action=' ;
				uni.showLoading({
					title: '二维码生成中',
					mask: true
				});
				uQRCode.make({
					canvasId: 'qrcode',
					text: this_.qrcodeText,
					size: this_.qrcodeSize,
					margin: 10,
					success: res => {
						this_.qrcodeSrc = res;
						this_.$nextTick(() => {
							this_.$refs['showimage'].open();
						})
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			//关闭二维码弹窗
			cancelModal() {
				this.$refs['showimage'].close()
			},
			//查询
			getDealer(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.GetMarket + '?ma001=' + this_.userInfo.c_ma001+'&m_type=' + this_.dealerInfo.m_type,
					method:'GET',
					data:{},
				}).then(res => {
					uni.hideLoading();
					//请求成功
					console.log(res.data);
					this_.dealerList = res.data;
				},error => {
					console.log(error);
				});
			},
			//总开关
			switchAll(e,list){
				let this_ = this;
				let state = e.detail.value ? '0': '-1';
				this_.$http.httpTokenRequest({
					url:this_.$api.CloseMarket,
					method:'POST',
					data:{
						m_id : list.m_id,
						m_state : state
					},
				}).then(res => {
					//请求成功
					console.log(res.data);
					if(res.data.State){
						if(state == '0'){
							uni.showToast({
								icon : 'none',
								title : '已启用',
								duration:1500
							});
						}else if(state == '-1'){
							uni.showToast({
								icon : 'none',
								title : '已停用',
								duration:1500
							});
						}
						this_.isSwitchAll = !this_.isSwitchAll;
						this_.init();
					}
				},error => {
					console.log(error);
				});
			},
			//启用顶用
			switchChange(e,list){
				//console.log(list);
				let this_ = this;
				let value = e.target.value;
				let tipTxt = '';
				if(value){
					tipTxt = '是否启用';
				}else{
					tipTxt = '是否停用';
				}
				uni.showModal({
					title: '温馨提示',
					content: tipTxt,
					success: function (res) {
						if (res.confirm) {
							if(value){
								this_.passOption(list,'0');
							}else{
								this_.passOption(list,'-1');
							}
							this_.swicthResize(list.c_id,'yes');
						} else if (res.cancel) {
							this_.swicthResize(list.c_id,'no');
							//console.log('用户点击取消');
						}
					}
				});
			},
			swicthResize(targetId,status){
				let switchs = uni.createSelectorQuery().in(this)._component.$refs.switchs;
				switchs.forEach(item => {
					if(item.id == targetId){
						if(item.switchChecked){
							if(status == 'no'){
								item.switchChecked = !item.switchChecked;
							}
						}else{
							if(status == 'no'){
								item.switchChecked = !item.switchChecked;
							}
						}
					}
				})
			},
			//二级经销商启用停用
			passOption(list,state){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.UserState+'?c_id='+ list.c_id,
					method:'POST',
					data:{c_nickname:list.c_nickname,c_prov:list.c_prov,c_city:list.c_city,c_address:list.c_address,c_tel:list.c_tel,c_tel:'',c_state:state},
				}).then(res => {
					//请求成功
					if(res.data.State){
						if(state == '0'){
							uni.showToast({
								icon : 'none',
								title : '已启用',
								duration:1500
							});
						}else if(state == '-1'){
							uni.showToast({
								icon : 'none',
								title : '已停用',
								duration:1500
							});
						}
					}
				},error => {
					console.log(error);
				});
			},
			//添加
			toAdd(){
				let this_ = this;
				this_.dealerInfo.m_prov = '';
				this_.dealerInfo.m_city = '';
				this_.dealerInfo.m_name = '';
				this_.dealerInfo.m_address = '';
				this_.isShow  = true;
				this_.curType = 'add';
			},
			//修改
			toEdit(item,index){
				let this_ = this;
				this_.dealerInfo.m_prov = item.m_prov;
				this_.dealerInfo.m_city = item.m_city;
				this_.dealerInfo.m_name = item.m_name;
				this_.dealerInfo.m_address = item.m_address;
				this_.curIndex = index;
				this_.isShow  = true;//控制弹层显示
				this_.curType = 'edit';//判断修改还是添加
			},
			//添加/修改经销商
			dealerSub(){
				let this_ = this;
				if(this_.$check.isEmpty(this_.dealerInfo.m_prov)){
					uni.showToast({
						icon : 'none',
						title : "省份不能为空",
						duration:1500
					});
					return false;
				}else if(this_.$check.isEmpty(this_.dealerInfo.m_city)){
					uni.showToast({
						icon : 'none',
						title : "区域不能为空",
						duration:1500
					});
					return false;
				}else if(this_.$check.isEmpty(this_.dealerInfo.m_name)){
					uni.showToast({
						icon : 'none',
						title : "名称不能为空",
						duration:1500
					});
					return false;
				}else if(this_.$check.isEmpty(this_.dealerInfo.m_address)){
					uni.showToast({
						icon : 'none',
						title : "详细地址不能为空",
						duration:1500
					});
					return false;
				}
				if(this_.curType == 'add'){
					this_.dealerAdd();
				}else if(this_.curType == 'edit'){
					this_.dealerEdit();
				}
				
			},
			//添加接口
			dealerAdd(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.AddMarket,
					method:'POST',
					data:this_.dealerInfo,
				}).then(res => {
					uni.hideLoading();
					//请求成功
					if(res.data.State){
						uni.showToast({
							icon : 'none',
							title : '添加成功',
							duration:1500
						});
						this_.isShow = false;
						this_.getDealer();
					}
				},error => {
					console.log(error);
				});
			},
			
			//修改接口
			dealerEdit(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.AddMarket + '?m_id=' + this_.dealerList[this_.curIndex].m_id,
					method:'POST',
					data:{
						m_prov:this_.dealerInfo.m_prov,
						m_city:this_.dealerInfo.m_city,
						m_address:this_.dealerInfo.m_address,
						m_name:this_.dealerInfo.m_name
					},
				}).then(res => {
					uni.hideLoading();
					//请求成功
					if(res.data.State){
						uni.showToast({
							icon : 'none',
							title : '修改成功',
							duration:1500
						});
						this_.dealerList[this_.curIndex].m_name = this_.dealerInfo.m_name;
						this_.dealerList[this_.curIndex].m_prov = this_.dealerInfo.m_prov;
						this_.dealerList[this_.curIndex].m_city = this_.dealerInfo.m_city;
						this_.dealerList[this_.curIndex].m_address = this_.dealerInfo.m_address;
						this_.isShow = false;
						this_.getDealer();
					}
				},error => {
					console.log(error);
				});
			},
			//调拨
			toAllot(list){
				let this_ = this;
				uni.navigateTo({
					url : '../allot/allot?m_id='+list.m_id + '&m_name=' + list.m_name + '&m_address='+list.m_prov+list.m_city+list.m_address,
				})
			},
			
		}
	}
</script>
<style>
	.umar-r{margin-right: 20rpx;}
	.dealer-main{
		margin-bottom: 130rpx;
	}
	.detail-tr:first-child{
		background-color: #EEEEEE;
	}
	.detail-table{
		border-left:1px solid #ddd;
	}
	.detail-td{
		-webkit-box-flex: inherit;
		-webkit-flex: inherit;
		flex: inherit;
		width: 33.3333%;
		font-size: 24rpx;
	}
	.order-uinn1{
		padding: 8rpx 20rpx;
	}
	.am-bg-active {
	    background-color: #dcdada;
	}
	.dealer-name{
		padding: 20rpx 0 10rpx 0;
		border-top-right-radius: 10rpx;
		border-top-left-radius: 10rpx;
	}
	uni-canvas>canvas{
		display: none;
	}
</style>
