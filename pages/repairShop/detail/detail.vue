<template>
	<view class="detail_container">
		<!-- 立即购买弹层内容开始 -->
		<view class="cart-cust-dialog" v-show="isShow">
			<radio-group @change="radioChange">
				<label class="cart-cust-list" v-for="(item, index) in custList">
					<radio :value="`${item.c_m_id + item.c_ma001}`" :checked="index === current" />
					<view>
						<view>名称：{{item.c_nickname}}&ensp;&ensp;</view>
						<view>电话：{{item.c_tel}}</view>
						<view>详细地址：{{item.c_prov + ' ' + item.c_city + ' ' + item.c_address}}</view>
					</view>
				</label>
			</radio-group>
			<view class="login-list ub-ac">
				<text class="login-list-fl">备注信息：</text>
				<view class="login-list-fr">
					<textarea v-model="note" placeholder="请填写您的备注信息" placeholder-style="color:#999" />
				</view>
			</view>
			<view class="cart-cust-btn">
				<view class="ub umar-a" style="margin:0">
					<view class="ub ub-f1 am-btn-default"><button class="am-btn" @click="cancelModal()">取消</button></view>
					<view class="ub ub-f1 am-btn-primary"><button class="am-btn am-text-white" @click="toSumit()">提交</button></view>
				</view>
			</view>
		</view>
		<!-- 立即购买弹层内容结束 -->
		
		<!-- 轮播内容开始 -->
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper index-slide" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" indicator-color="#999" indicator-active-color="#14489b">
						<swiper-item v-for="item in slidArr">
							<view class="swiper-item"><image :src="$http.imgUrl+item" mode="scaleToFill" class="index_slidImg"></image></view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<!-- 轮播内容结束 -->
		
		<!-- 主要内容开始 -->
		<view class="detail-main">
			<view class="detail-txt">
				<text class="detail-name">{{detInfo.title}}</text>
				<!-- <text v-if="userInfo.c_type == 1"><text class="detail-price" >￥{{detInfo.currentprice}}</text>/{{detInfo.unit}}</text> -->
				<!-- <view v-if="userInfo.c_type == 3">
					<text>进价：</text>
					<block v-if="userInfo.c_isview == 0">
						<text class="detail-price f30">协议价</text>
					</block>
					<block v-else>
						<text class="detail-price">￥{{detInfo.a_price}}</text>/{{detInfo.unit}}
					</block>
				</view> -->
				<view class="">
					<text>售价：</text>
					<text class="detail-price">￥{{detInfo.currentprice}}</text>/{{detInfo.unit}}
				</view>
				<view v-if="!$check.isEmpty(detInfo.uqdescription)" style="margin-top:10rpx;">规格：{{detInfo.uqdescription}}</view>
			</view>
			<view class="detail-cart">
				<uni-number-box :min="1" @change="changeCart"></uni-number-box>
			</view>
			<view class="detail-cont" v-if="detInfo.a_id > 0" style="background: #c8ecc8;">
				<view class="detail-info">{{detInfo.i_note}}</view>
			</view>
			<view class="detail-cont">
				<view class="detail-title">
					商品信息
				</view>
				<!-- <view class="detail-info">
					型号：{{detInfo.productmodel}}
				</view>
				<view class="detail-info">
					适用范围：{{detInfo.suitable}}
				</view> -->
			</view>
			<view class="detail-cont">
				<text>品牌：</text>
				<text>{{detInfo.suitable}}</text>
			</view>
			<!-- <view class="detail-cont">
				<view class="detail-title">
					适用车型对照表
				</view>
				<view class="detail-table">
					<view class="detail-tr" v-for="list in tablepara">
						<view class="detail-td" v-for="item in list.split(',')">{{item}}</view>
					</view>
				</view>
			</view> -->
			<view class="detail-cont">
				<view class="detail-title">
					图文详情
				</view>
				<view v-for="item01 in contImg" class="ub">
					<image :src="item01" mode="widthFix" @click="bigImg(item01);"></image>
				</view> 
			</view>
			
		</view>
		<!-- 主要内容结束 -->
		<!-- 详情图片查看器 -->
		<view class="cart-cust-dialog" v-show="isShowImg" style="background-color: rgba(0,0,0,0.5);padding: 0;text-align: center;" @click="closeDig();">
			<movable-area class="scroll-eara">
				<movable-view class="scroll-eara" direction="all" scale="true" out-of-bounds="true" scale-min="1" scale-max="4">
					<scroll-view style="height: 100vh;" scroll-x="true" scroll-y="true"><image :src="imgPath" mode="widthFix"></image></scroll-view>
				</movable-view>
			</movable-area>
		</view>
		<!-- 详情图片查看器 -->
		<!-- 底部导航start -->
		<view class="goods-carts" v-show="isFooterBar">
			<uni-goods-nav :text="text" :options="options" :fill="true" :button-group="buttonGroup" @click="openCart" @buttonClick="buttonClick"></uni-goods-nav>
		</view>
		<!--底部导航end-->
	</view>
</template>

<script>
	import uniGoodsNav from '@/components/uni-goods-nav/uni-goods-nav.vue'
	import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue'
	export default {
		components:{
			uniGoodsNav,
			uniNumberBox
		},
		data() {
			return {
				userInfo:{},//用户信息
				detInfo:{},//产品详情
				erpCode:'',//产品编号
				a_id:'',//活动id
				qty:1,//购物车数量
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				slidArr:[],//轮播
				tablepara:[],//适用车型对照表
				contImg:[],//图文详情,
				text : [{
					money : '',
					textColor : '#ff0000'
				}],
				options : [{
					icon : 'cart',
					text : '购物车',
					info : uni.getStorageSync('cartNum')
				}],
				buttonGroup : [{
					text : '加入购物车',
					backgroundColor : '#ffa200',
					color : '#fff'
				},{
					text : '立即购买',
					backgroundColor : '#ff0000',
					color : '#fff'
				}],
				custList: [],//代理商列表
				current: 0,//选中代理商index
				isShow:false,//立即购买弹层
				note:'',//立即购买备注
				isShowImg : false,
				imgPath : "",
				isFooterBar : true
			}
		},
		onLoad(option) {
			//读取存储数据
			let this_ = this;
			if(option.is_footer_bar != 0 && option.is_footer_bar != -1 ){
				this_.isFooterBar = false;
			}
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					this_.erpCode = option.code;
					this_.a_id = option.a_id;
					//获取产品详情
					this_.getProInfo(option.code);
			    }
			});
		},
		methods: {
			//获取产品详情
			getProInfo(code){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductByCode+'?c_id='+ this_.userInfo.c_id + '&c_ma001='+ this_.userInfo.c_ma001 +'&c_type='+this_.userInfo.c_type + '&code=' + code,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					console.log(res);
					this_.detInfo = res.data[0];
					this_.slidArr = res.data[0].sliderpics.split(",");
					// this_.tablepara = this_.detInfo.tableparamter.split(';');
					// this_.tablepara.pop();
				    this_.detInfo.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
					   this_.contImg.push(this_.$http.imgUrl+capture);
				    });
					if(this_.userInfo.c_type == 3 && this_.userInfo.c_isview == 1){
						this_.text[0].money = '¥'+this_.qty * this_.detInfo.a_price * this_.detInfo.unitquantity;
					}else if(this_.userInfo.c_type == 3 && this_.userInfo.c_isview == 0){
						this_.text[0].money = '¥'+this_.qty * 0;
					}else if(this_.userInfo.c_type == 1){
						this_.text[0].money = '¥'+this_.qty * this_.detInfo.currentprice * this_.detInfo.unitquantity;
					}
					
					if(this_.$check.isEmpty(this_.a_id)){
						this_.a_id = res.data[0].a_id;
					}
				},error => {
					console.log(error);
				});
			},
			
			//加减购物车
			changeCart(e){
				let this_ = this;
				this_.qty = e;
				if(this_.userInfo.c_type == 3 && this_.userInfo.c_isview == 0){
					this_.text[0].money = '¥'+ e * 0;
				}else if(this_.userInfo.c_type == 3 && this_.userInfo.c_isview == 1){
					this_.text[0].money = '¥'+ e * this_.detInfo.a_price * this_.detInfo.unitquantity;
				}else if(this_.userInfo.c_type == 1){
					this_.text[0].money = '¥'+ e * this_.detInfo.currentprice * this_.detInfo.unitquantity;
				}
			},
			
			//加入购物车
			toCart(){
				let this_ = this;
				this_.addCart();
			},
			
			//购物车数量修改
			addCart(){
				let this_ = this;
				//加减购物车接口
				this_.$http.httpTokenRequest({
					url:this_.$api.AddShopCart,
					method:'POST',
					data:{
						"c_id":this_.userInfo.c_id,
						"c_ma001":this_.userInfo.c_ma001,
						"c_ma002":this_.userInfo.c_ma002,
						"i_mb001":this_.erpCode,
						"qty":this_.qty,
						"a_id":this_.a_id,
						"is_reco":'0'
					},
				}).then(res => {
					//请求成功
					if(res.data.State){
						uni.showToast({
							title:'添加成功，在购物车等亲～',
							duration:1500
						})
						let total = parseInt(uni.getStorageSync('cartNum')) + parseInt(this_.qty);
						this_.options[0].info = total;
						uni.setStorageSync('cartNum',total);
					}
				},error => {
					console.log(error);
				});
			},
			openCart (e) {
				uni.navigateTo({
					url : '../cart/cart'
				});
			},
			buttonClick (e) {
				let this_ = this;
				if(e.index == 0){
					this.toCart();
				}else if(e.index == 1){
					//代理商产品列表
					uni.showLoading();
					let url = "";
					if(this_.userInfo.c_type == 3){
						url = this_.$api.GetAgreeCustomer+'?m_id='+ this_.userInfo.c_m_id;
					}else{
						url = this_.$api.GetCustomer+'?c_id='+ this_.userInfo.c_id;
					}
					this_.$http.httpTokenRequest({
						url:url,
						method:'GET',
						data:{},
					}).then(res => {
						//请求成功
						uni.hideLoading();
						this_.custList = res.data;
						this_.isShow = true;
					},error => {
						console.log(error);
					});
				}
				
			},
			//选择代理商
			radioChange: function(evt) {
				let this_ = this;
				for (let i = 0; i < this_.custList.length; i++) {
					if ((this_.custList[i].c_m_id + this_.custList[i].c_ma001) === evt.target.value) {
						this_.current = i;
						break;
					}
				}
			},
			//关闭弹窗并提交订单
			toSumit(){
				let this_ = this;
				let qty = 1;
				if(!this_.$check.isEmpty(this_.qty) && (this_.qty != 0)){
					qty = this_.qty;
				}
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.CustAddOrder + '?c_id=' + this_.userInfo.c_id,
					method:'POST',
					data:{
						"c_id":this_.userInfo.c_id,
						"c_openid":this_.userInfo.c_openid,
						"c_nickname":this_.userInfo.c_nickname,
						"c_ma001":this_.custList[this_.current].c_ma001,
						"c_ma002":this_.custList[this_.current].c_ma002,
						"c_tel":this_.userInfo.c_tel,
						"c_address": this_.userInfo.c_prov + this_.userInfo.c_city + this_.userInfo.c_address,
						"note": this_.note,
						"item":[{mb001:this_.erpCode,qty:qty,a_id:this_.a_id}],
						"m_id":this_.custList[this_.current].c_m_id,
						"s_type_no":this_.userInfo.c_type == 3 ? 1 : 0
					},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					if(res.data.State){
						uni.showToast({
							icon:'none',
							title: '订单提交成功！',
							duration:1500
						});
						this_.isShow = !this_.isShow;
						setTimeout(function(){
							uni.navigateTo({
								url : '../order/order?id=0'
							})
						},1700);
					}else{
						uni.showToast({
							icon:'none',
							title: res.data.Message,
							duration:1500
						});
					}
				},error => {
					console.log(error);
				});
				this_.isShow = false;
			},
			cancelModal(){
				var this_ = this;
				this_.isShow = !this_.isShow;
			},
			bigImg(url){
				this.imgPath = url;
				this.isShowImg = !this.isShowImg;
			},
			closeDig(){
				this.isShowImg = !this.isShowImg;
			},
		}
	}
</script>

<style scoped>
.detail-td{
	border-left: 1px solid #eee;
}
.login-list{
	margin-top: 20rpx;
}
uni-button:after{
	content: none;
}
.umar-a{
	margin: 0 15rpx;
}
.cart-cust-btn{
	bottom: 0;
}
.cart-cust-btn .am-btn{
	padding:15rpx 0;
}
.scroll-eara{
	height: 100vh;
	width: 100%;
	/* overflow: scroll; */
}
</style>
