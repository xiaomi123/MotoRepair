<template>
	<view class="dealer-container">
		<!-- 添加经销商弹层开始 -->
		<view class="login-dialog" v-show="isShow">
			<view class="login-dialog-cont">
				<view class="login-title">添加协议客户<text class="iconfont login-dialog-close" @click="isShow=false">&#xe60f;</text></view>
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
				<!-- <view class="login-list">
					<text class="login-txt">详细地址</text>
					<view class="login-area">
						<textarea class="login-area-txt" v-model="dealerInfo.m_address" placeholder="请录入详细地址" />
					</view>
				</view> -->
				<view class="login-list">
					<text class="login-txt">详细地址</text>
					<view class="login-right">
						<input class="uni-input login-input" v-model="dealerInfo.m_address" placeholder="请录入详细地址" />
						<text class="iconfont" @click="getLocal()">&#xe60d;</text>
					</view>
				</view>
				<view class="login-list">
					<!-- <checkbox-group style="width: 100%;" @change="getChecked"> 
						<label class="checkbox" v-for="(item,index) in roleList">
							<checkbox :value="item" :checked="dealerInfo.m_type_note.indexOf(item) > -1 ? true : false" style="transform: scale(0.7);" />{{item}}
						</label>
					</checkbox-group> -->
					<radio-group style="width: 100%;" @change="getChecked">
						<label class="checkbox" v-for="(item,index) in roleList">
							<radio :value="item" :checked="dealerInfo.m_type_note.indexOf(item) > -1 ? true : false" style="transform: scale(0.7);" />{{item}}
						</label>
					</radio-group>
				</view>
				<view class="login-list">
					<text class="login-txt">上传图片</text>
					<image v-if="dealerInfo.m_pic_url != ''" class="upload-img" style="margin-right: 20rpx;" :src="imgUrl" mode="aspectFill" @click="previewImage()"></image>
					<image class="upload-img" src="../../../static/images/upload.png" mode="aspectFill" @click="chooseImg()"></image>
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
					<view class="ub ub-f1">公司名称：{{list.m_name}}<text style="margin-left: 15rpx;">({{list.m_type_note}})</text></view>
					<view class="ub"><switch :checked="list.m_state == 0 ? true : false" @change="switchAll($event,list)"  class="am-switch-sm" /></view>
				</view>
				<view class="order-uinn">
					<view class="list-item umar-b"><text class="am-text-99">收货地址：</text>{{list.m_prov + ' ' + list.m_city + ' ' + list.m_address}}</view>
					<view style="margin-top: 8rpx;">
						<view class="detail-table">
							<view class="detail-tr no-ubb">
								<view class="detail-td">客户名称</view>
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
	import wx from '@/common/js/jwweixin.js'
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
					m_type: '3',
					m_type_note: '',
					m_pic_url: '' //上传图片地址
				},//修改信息传参
				qrcodeText: '',
				qrcodeSize: 200,
				qrcodeSrc: '',
				isConfirm:false,//确认弹层
				isSwitchAll: false,
				dealerName: '', //二级代理商名称
				roleList : ["镗缸厂","易损件","微车批发","大众","现代","科鲁兹","比亚迪","长城皮卡"],
				imgUrl :""
			}
		},
		onLoad() {
			this.init();
			//获取地址
			this.wxInit();
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
				this_.qrcodeText = 'http://gao.vocen.cn:8044/#/pages/QRCode?ma001='+ ma001 +'&type='+this_.dealerInfo.m_type+'&m_id=' + mId ;
				console.log(this_.qrcodeText);
				//this_.qrcodeText = 'http://10.0.2.233:8506/#/pages/QRCode?ma001='+ ma001 +'&type='+this_.dealerInfo.m_type+'&m_id=' + mId ;
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
					//data:{},
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
				console.log(item);
				let this_ = this;
				this_.dealerInfo.m_prov = item.m_prov;
				this_.dealerInfo.m_city = item.m_city;
				this_.dealerInfo.m_name = item.m_name;
				this_.dealerInfo.m_address = item.m_address;
				this_.dealerInfo.m_type_note = item.m_type_note;
				this_.dealerInfo.m_pic_url = item.m_pic_url;
				this_.imgUrl = this_.$http.imgPath + item.m_pic_url;
				console.log(this_.imgUrl);
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
				}else if(this_.$check.isEmpty(this_.dealerInfo.m_type_note)){
					uni.showToast({
						icon : 'none',
						title : "至少选择一种类型协议客户",
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
			getChecked(e){
				this.dealerInfo.m_type_note = e.detail.value;
				console.log(this.dealerInfo.m_type_note);
			},
			//添加接口
			dealerAdd(){
				console.log("aa");
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.AddMarket,
					method:'POST',
					data:this_.dealerInfo,
				}).then(res => {
					uni.hideLoading();
					console.log(res);
					//请求成功
					if(res.data.State){
						uni.showToast({
							icon : 'none',
							title : '添加成功',
							duration:1500
						});
						this_.isShow = false;
						this_.getDealer();
					}else{
						uni.showToast({
							icon : 'none',
							title : res.data.Message,
							duration:1500
						});
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
						m_name:this_.dealerInfo.m_name,
						m_type_note: this_.dealerInfo.m_type_note,
						m_pic_url : this_.dealerInfo.m_pic_url
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
			//获取微信签名
			wxInit() {
				let this_ = this;
				let _data = {
					url: 'http://gao.vocen.cn:2345/',
				};
				// 获取微信签名
				this_.$http.httpTokenRequest({
					url: 'JsSdkUiPackage',
					method: 'POST',
					data: _data,
				}).then(res => {
					//请求成功
					this_.wxConfig(res.data.Timestamp, res.data.NonceStr, res.data.Signature, res.data.AppId);
				}, error => {
					console.log(error);
				});
			
			},
			wxConfig(_timestamp, _nonceStr, _signature, _appId) {
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: _appId, // 必填，公众号的唯一标识
					timestamp: _timestamp, // 必填，生成签名的时间戳
					nonceStr: _nonceStr, // 必填，生成签名的随机串
					signature: _signature, // 必填，签名，见附录1
					jsApiList: ['checkJsApi','openLocation','getLocation','translateVoice']
					// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			},
			//获取地址
			getLocal(){
				let this_ = this;
				wx.ready(function() {
					
					//一
					wx.checkJsApi({
						jsApiList: [
							'getLocation',
							'translateVoice'
						],
						success: function(res) {
							 //alert(JSON.stringify(res));
							// alert(JSON.stringify(res.checkResult.getLocation));
							if(res.checkResult.getLocation == false) {
								alert('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！');
								return;
							}
						}
					});
					
					//二
					wx.getLocation({
						success: function(res) {
							var latitude = res.latitude; //纬度，浮点数，范围为90 ~ -90
							var longitude = res.longitude; //经度，浮点数，范围为180 ~ -180。
							var speed = res.speed; //速度，以米/每秒计
							var accuracy = res.accuracy; //位置精度
							var location = latitude + ',' + longitude;
							
							uni.request({
							    url: 'https://restapi.amap.com/v3/geocode/regeo?output=json&location='+ longitude +','+ latitude +'&key=418be98113e39497de778af65096f011&radius=1000&extensions=all', //仅为示例，并非真实接口地址。
							    /*data: {
							        text: 'uni.request'
							    },
							    header: {
							        'custom-header': 'hello' //自定义请求头信息
							    },*/
							    success: (res) => {
									if(res.data.info == 'OK'){
										this_.dealerInfo.m_prov = res.data.regeocode.addressComponent.province;
										this_.dealerInfo.m_city = res.data.regeocode.addressComponent.city;
										this_.dealerInfo.m_address = res.data.regeocode.formatted_address;
									}
							    }
							});
							
							/*getBaiduLocation(longitude, latitude);
							getAddrs(location);
							//转换百度坐标
							function getBaiduLocation(longitude, latitude) {
								$.ajax({
									type: "GET",
									url: 'http://api.map.baidu.com/geoconv/v1/?coords=' + longitude + ',' + latitude + '&from=1&to=5&output=json&ak= 你的百度ak ',
									dataType: 'jsonp',
									success: function(msg) {
										try {
											var result = msg.result;
											var lat = result[0].y; //纬度
											var lng = result[0].x; //经度
											//navi(result[0]); //导航
										} catch(e) {
											alert(e.message);
										}
									}
								});
							};
							//调用百度地图api执行地址逆编码
							function getAddrs(jwd) {
								$.ajax({
									type: "GET",
									url: 'http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=' + jwd + '&output=json&pois=1&ak=你的百度ak',
									dataType: 'jsonp',
									success: function(msg) {
										alert("获取当前地址");
										alert(msg);
										//获取地址成功后的回调，我这里只需要获取省市区信息
										if(msg.status == 0) {
											var provMsg = msg.result.addressComponent.province;
											var cityMsg = msg.result.addressComponent.city;
											var areaMsg = msg.result.addressComponent.district;
											var pca = provMsg + '-' + cityMsg + '-' + areaMsg;
											this.agentInfo.c_address = provMsg + cityMsg + areaMsg;
										}
									}
								})
							}*/
						},
						cancel: function(res) {
							alert('用户拒绝授权获取地理位置');
						}
					});
					
				});
				
				wx.error(function(res) {
					//alert(res.errMsg); //打印错误消息。及把debug:false,设置为debug:ture就可以直接在网页上看到弹出的错误提示
				});
			},
			//选择图片
			async chooseImg(){
				let this_ = this;
				uni.chooseImage({
				    count: 1, 
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album','camera'], //从相册选择
				    success: function (res) {
						//const imgPath = res.tempFilePaths[0];
						const imgPath = res.tempFiles[0];
						var reader = new FileReader();
						reader.readAsDataURL(imgPath);
						reader.onload = function(){
							this_.imgUrl = reader.result;
							this_.upload(reader.result);  //获取到base64格式图片
						};
				    }
				});
			},
			upload(imgPath) {
				let this_ = this;
				uni.showLoading({
					mask:true,
					title : '上传中...'
				})
				uni.uploadFile({
					url : this_.$http.baseUrl + this_.$api.UploadFile,
					filePath: imgPath,
					name : 'file',
					formData:{},
					header:{
						'Authorization':'Basic ' + this_.userInfo.token
					},
					success: (res) => {
						console.log(res);
						if(res.statusCode == 200){
							this_.dealerInfo.m_pic_url = JSON.parse(res.data).path[0];
							//console.log(this_.dealerInfo.m_pic_url);
						}
						uni.hideLoading();
					},
					fail: (err) => {
						console.log(err);
					}
				})
			},
			//图片预览
			previewImage(){
				let arr = [this.imgUrl];
				uni.previewImage({
					urls: arr
				})
			}
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
	.checkbox{
		display: inline-block;
		margin: 10rpx 20rpx 0 0;
	}
	.login-right{
		position: relative;
		width: 75%;
		padding-right:40rpx;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		border-bottom: 1px solid #ddd;
	}
	.login-right .login-input{
		width:100%;
		height: initial;
		line-height: none;
		border:none;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
	}
	.login-right .iconfont{
		position: absolute;
		right:0;
		top:11rpx;
		font-size:40rpx;
		color:#007aff;
	}
	.upload-img{
		width: 162rpx;
		height: 132rpx;
	}
</style>
