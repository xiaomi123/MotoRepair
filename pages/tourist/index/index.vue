<template>
	<view class="index_container">
		<!-- 搜索内容开始 -->
		<!-- <view class="index-search" style="top:0">
			<view class="index-search-cont">
				<button class="index-search-btn" @click="filter()">目录</button>
				<input class="index-search-txt index-search-agent" confirm-type="search" v-model="keywords" placeholder="请输入"  @confirm="search"  />
			</view>
		</view> -->
		<view class="index-search" style="top:0">
			<view class="index-search-cont">
				<!-- <button class="index-search-btn" @click="filter()">机型目录</button> -->
				<button class="index-search-btn">品牌目录</button>
				<view class="search-input-box">
					<input class="index-search-txt" confirm-type="search" v-model="keywords" placeholder="请输入产品名/型号"  @confirm="search" />
					<button class="index-search-btn s-btn" @click="search()">搜索</button>
				</view>
			</view>
		</view>
		<!-- 搜索内容结束 -->
		
		<!-- 修理厂信息补全弹层开始 -->
		<view class="login-dialog" v-show="isApply && tag == ''">
			<view class="login-dialog-cont" style="top:15rpx; bottom: 15rpx;">
				<view class="login-title">为了能更好的为您提供服务，请准确录入您的信息<text class="iconfont login-dialog-close" @click="isApply=false">&#xe60f;</text></view>
				<view class="umar-tb">
					<uni-steps :options="[{title: '申请修理厂'}, {title: '客服审核'}, {title: '代理商审核'}]" v-if="!isDealer" :active="userInfo.c_state == 1 ? 1 : 0"></uni-steps>
					<uni-steps :options="[{title: '申请修理厂'}, {title: '代理商审核'}]" v-else></uni-steps>
				</view>
				<view class="login-list" v-show="!isDealer">
					<text class="login-txt">修理厂名称</text>
					<input class="uni-input login-input" :disabled="userInfo.isfirst == 0" v-model="agentInfo.c_nickname" placeholder="请录入修理厂名称" />
				</view>
				<view class="login-list">
					<text class="login-txt">联系电话</text>
					<input class="uni-input login-input" :disabled="userInfo.isfirst == 0" v-model="agentInfo.c_tel" placeholder="请录入联系电话" />
				</view>
				<!-- <view class="login-list">
					<text class="login-txt">备用电话</text>
					<input class="uni-input login-input" :disabled="userInfo.isfirst == 0" v-model="agentInfo.c_tel1" placeholder="请录入备用电话" />
				</view> -->
				<view class="login-list02" v-show="!isDealer">
					<view class="login-list02-content">
						<view class="login-list">
							<text class="login-txt" style="width:80%;">省份</text>
							<input class="uni-input login-input" :disabled="userInfo.isfirst == 0" v-model="agentInfo.c_prov" placeholder="请录入省份" />
						</view>
					</view>
					<view class="login-list02-content">
						<view class="login-list">
							<text class="login-txt" style="width:35%;text-align: right;">市/区</text>
							<input class="uni-input login-input" :disabled="userInfo.isfirst == 0" v-model="agentInfo.c_city" placeholder="请录入区域" />
						</view>
					</view>
				</view>
				<!--<view class="login-list" style="border-bottom: none;" v-show="!isDealer">
					<text class="login-txt">详细地址</text>
					<view class="login-area">
						<textarea class="login-area-txt" v-model="agentInfo.c_address" placeholder="请录入详细地址" />
					</view>
				</view>-->
				<view class="login-list" v-show="!isDealer">
					<text class="login-txt">详细地址</text>
					<view class="login-right">
						<input class="uni-input login-input" :disabled="userInfo.isfirst == 0" v-model="agentInfo.c_address" placeholder="请录入详细地址" />
						<text class="iconfont" @click="getLocal()">&#xe60d;</text>
					</view>
					
				</view>
				<viwe style="display:block;margin-bottom: 15rpx;color: red;">(示例：xx县&nbsp;&nbsp;xx乡/镇&nbsp;&nbsp;xx街道)</viwe>
				<view class="login-list" v-show="!isDealer">
					<text class="login-txt">主修车型</text>
					<view class="radio-group">
						<radio-group @change="radioChange">
							<view class="radio-item" v-for="item in models">
								<label class="radio" style="margin-right: 30rpx;" >
									<radio :value="item.type" :disabled="userInfo.isfirst == 0" :checked="false" style="transform:scale(0.7)" />{{item.type}}
								</label>
							</view>
						</radio-group>
					</view>
				</view>
				<!--<button type="primary" class="login-dialog-btn" @click="submitInfo()"  :disabled="userInfo.isfirst == 0">提交</button>-->
				<!-- userInfo.isfirst 1是首次登陆 0是非首次登陆 -->
				<p style="text-align: center; color: #FF0000;" v-show="userInfo.isfirst == 0">您的信息已提交，正在审核中，请耐心等待，无需重复提交！</p>
				<button type="primary" class="login-dialog-btn" @click="submitInfo()"  :disabled="userInfo.isfirst == 0" v-show="userInfo.isfirst == 1">提交</button>
			</view>
		</view>
		<!-- 修理厂信息补全弹层结束 -->
		<view style="margin-top: 15rpx;" v-if="tag == ''">
			<view class="notice-bar">
				<uni-notice-bar showIcon="true" :text="'欢迎 '+userInfo.c_nickname+' 成为我们的普通用户'" background-color="#eeeeee" color="#333333"></uni-notice-bar> 
			</view>
			<view class="notice-bar" @click="toApply()">
				<uni-notice-bar showIcon="true" :text="userInfo.c_nickname+'' +desc" color="#FF0000"></uni-notice-bar>
			</view>
		</view>
		
		<!-- 轮播内容开始 -->
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper index-slide" circular="false" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" indicator-color="#999" indicator-active-color="#14489b">
						<swiper-item>
							<view class="swiper-item"><image src="../../../static/images/img_index_slide01.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item"><image src="../../../static/images/img_index_slide02.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item"><image src="../../../static/images/img_index_slide03.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item"><image src="../../../static/images/img_index_slide04.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item"><image src="../../../static/images/img_index_slide05.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item"><image src="../../../static/images/img_index_slide06.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<!-- 轮播内容结束 -->
		
		<view class="index-content">
			<view class="index-title"></view>
			<view class="index-product">
				<view class="index-list" v-for="(item,index) in proList" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<text class="index-title">{{item.title}}</text>
					<!-- <view>
						<text>型号:{{item.productmodel}}</text>
					</view>
					<view class="index-txt"><text>适用范围:{{item.suitable}}</text></view> -->
					<view class="index_collect ub ub-ac">
						<text class="ub f32 am-blod" v-if="item.a_id > 0">赠</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 上拉加载 start -->
		<uni-load-more :status="status" class="am-umar-tbar"></uni-load-more>
		<!-- 上拉加载 end -->
	</view>
</template>

<script>
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	import wx from '@/common/js/jwweixin.js'
	export default {
		components:{
			uniNoticeBar,
			uniLoadMore,
			uniSteps
		},
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				proList:[],
				userInfo:{},
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
				desc : '您好！点击此处申请成为会员客户',
				agentInfo:{
					c_tel:'',
					c_tel1:'',
					c_nickname:'',
					c_prov:'',
					c_city:'',
					c_address:'',
					c_state:'1',
					c_main: ''
				},
				isApply:false,//信息完善弹层
				isDealer:false,//判断经销商
				keywords:'',//搜索
				models: [{type : '国产车'},{type : '合资车'},{type : '高端车'}],
				tag : ''
			}
		},
		onLoad(option) {
			this.tag = option.tag;
			//读取存储数据
			this.getData();
			//获取地址
			this.wxInit();
		},
		methods: {
			//获取微信签名
			wxInit() {
				let this_ = this;
				let _data = {
					url: 'http://gao.vocen.cn:8044/',
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
										this_.agentInfo.c_address = res.data.regeocode.formatted_address;
										this_.agentInfo.c_prov = res.data.regeocode.addressComponent.province;
										this_.agentInfo.c_city = res.data.regeocode.addressComponent.city;
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
			
			
			getData(){
				let this_ = this;
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
						this_.userInfo = res.data[0];
						//二级经销商扫描
						if(this_.userInfo.c_type == 0){
							this_.desc = '您好！您的账号已开通，请填写手机号';
							this_.isDealer = true;
						}
						console.log(!this_.isDealer);
						if(!this_.$check.isEmpty(this_.userInfo.c_nickname)){
							this_.agentInfo.c_nickname = this_.userInfo.c_nickname;
						}
						if(!this_.$check.isEmpty(this_.userInfo.c_tel)){
							this_.agentInfo.c_tel = this_.userInfo.c_tel;
						}
						if(!this_.$check.isEmpty(this_.userInfo.c_address)){
							this_.agentInfo.c_address = this_.userInfo.c_address;
						}
						if(!this_.$check.isEmpty(this_.userInfo.c_prov)){
							this_.agentInfo.c_prov = this_.userInfo.c_prov;
						}
						if(!this_.$check.isEmpty(this_.userInfo.c_city)){
						this_.agentInfo.c_city = this_.userInfo.c_city;
						}
						if(this_.userInfo.c_state == 1){
							if(this_.userInfo.isfirst == 0){
								this_.desc = '您好！您的申请已提交，正在审核中，请耐心等待...';
							}
						}else if(this_.userInfo.c_state == -1){
							this_.desc = '您好！您的账号已停用，您仍可通过本平台了解本公司的产品信息,如有疑问请联系客服电话:40089531990';
						}else if(this_.userInfo.c_state == 2){
							this_.desc = '您好！您的申请审核未通过，您仍可通过本平台了解本公司的产品信息';
						}
						// if(this_.userInfo.isfirst == 1){
						// 	//二级经销商扫描
						// 	if(this_.userInfo.c_type == '0'){
						// 		this_.desc = '您好！您的账号已开通，请填写手机号';
						// 		this_.isDealer = true;
						// 	}
						// 	if(!this_.$check.isEmpty(this_.userInfo.c_nickname)){
						// 		this_.agentInfo.c_nickname = this_.userInfo.c_nickname;
						// 	}
						// 	if(!this_.$check.isEmpty(this_.userInfo.c_tel)){
						// 		this_.agentInfo.c_tel = this_.userInfo.c_tel;
						// 	}
						// 	if(!this_.$check.isEmpty(this_.userInfo.c_address)){
						// 		this_.agentInfo.c_address = this_.userInfo.c_address;
						// 	}
						// 	if(!this_.$check.isEmpty(this_.userInfo.c_prov)){
						// 		this_.agentInfo.c_prov = this_.userInfo.c_prov;
						// 	}
						// 	if(!this_.$check.isEmpty(this_.userInfo.c_city)){
						// 		this_.agentInfo.c_city = this_.userInfo.c_city;
						// 	}
						// }else{
						// 	if(this_.userInfo.c_state == 1){
						// 		this_.desc = '您好！您的申请已提交，正在审核中，请耐心等待...';
						// 	}else if(this_.userInfo.c_state == -1){
						// 		this_.desc = '您好！您的账号已停用，您仍可通过本平台了解本公司的产品信息';
						// 	}else if(this_.userInfo.c_state == 2){
						// 		this_.desc = '您好！您的申请审核未通过，您仍可通过本平台了解本公司的产品信息';
						// 	}
						// }
						
						//获取首页产品列表
						uni.showLoading();
						this_.$http.httpTokenRequest({
							//url:this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
							url:this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
							method:'GET',
							data:{},
						}).then(res => {
							//请求成功
							uni.hideLoading();
							//console.log("产品列表");
							if(this_.p > 1){
								this_.proList = this_.proList.concat(res.data.rows);
							}else{
								this_.proList = res.data.rows;
							}
							this_.status = 'more';
							this_.papeTotal(res.data.total);
						},error => {
							console.log(error);
						});
						
				    }
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
			//点击产品列表进入详情
			toDetail(item){
				//console.log(item);
				let this_ = this;
				uni.navigateTo({
				 	url: '../detail/detail?code='+item.erpcode + '&a_id=' + item.a_id
				}); 
			},
			//点击申请
			toApply (){
				let this_ = this;
				console.log(this_.userInfo);
				// if(userInfo.isfirst == 0){
				// 	uni.showModal({
				// 	    title: '提示',
				// 	    content: '您提交的申请正在审核中~'
				// 	});
				// 	return false;
				// }
				if(this_.userInfo.c_state !=2){
					this_.isApply = true;
				}
				
			},
			//点击提交信息
			submitInfo(){
				let this_ = this;
				console.log(this.agentInfo.c_main);
				if(this_.$check.isEmpty(this_.agentInfo.c_nickname)){
					uni.showToast({
						icon : 'none',
						title : "修理厂名称不能为空",
						duration:1500
					});
					return false;
				}else if(this_.$check.isEmpty(this_.agentInfo.c_tel)){
					uni.showToast({
						icon : 'none',
						title : "联系电话不能为空",
						duration:1500
					});
					return false;
				}else if(!this_.$check.ckTel(this_.agentInfo.c_tel)){
					uni.showToast({
						icon : 'none',
						title : "手机号格式不正确",
						duration:1500
					});
					return false;
				}else if(this_.$check.isEmpty(this_.agentInfo.c_prov)){
					uni.showToast({
						icon : 'none',
						title : "省份不能为空",
						duration:1500
					});
					return false;
				}else if(this_.$check.isEmpty(this_.agentInfo.c_city)){
					uni.showToast({
						icon : 'none',
						title : "区域不能为空",
						duration:1500
					});
					return false;
				}else if(this_.$check.isEmpty(this_.agentInfo.c_address)){
					uni.showToast({
						icon : 'none',
						title : "详细地址不能为空",
						duration:1500
					});
					return false;
				}
				if(this_.$check.isEmpty(this_.userInfo.c_ma001)){
					this_.userInfo.c_ma001 = '';
				}
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
							title : '提交成功，等待审核',
							duration:1500
						});
						this_.isApply = false;
						this_.desc = '您好！您的申请已提交，正在审核中，请耐心等待...';
						this_.userInfo.isfirst = 0;
						let arr = [];
						arr.push(this_.userInfo);
						uni.setStorage({
							key: 'userInfo',
							data: arr,
							success: function () {
								console.log('success');
							}
						});
						location.reload();
					}
				},error => {
					console.log(error);
				});
			},
			//目录
			filter(){
				uni.navigateTo({
					url : '../cate/cate'
				})
			},
			search(e){
				//this.getData();
				let this_ = this;
				uni.navigateTo({
					url : '../proList/proList?scode=&keyWord='+ this_.keywords
				});
			},
			//修理厂选择主修车型
			radioChange(e){ 
				this.agentInfo.c_main = e.detail.value;
			}
		},
		//上拉加载
		onReachBottom (){
			if(this.p < this.pageCount){
				this.p++;
				this.status = 'loading';
				this.getData();
			}else{
				this.status = 'noMore';
			}
		},
		
	}
</script>
<style>
.umar-l{
	margin-left: 10rpx;
}
.index-search-txt{
	width: 70%;
}
.index-search-btn{
	width: 18%;
}
.radio-group{
	display: flex;
	flex-direction: column;
}
.radio-item{
	margin-bottom: 10rpx;
	display: inline-block;
}
/* .login-dialog-cont{
	font-size: 16rpx;
} */
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
</style>
