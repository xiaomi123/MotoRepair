<template>
	<view class="detail_container">
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
		
		<!-- 备注\代理商选中弹层内容开始 -->
		<view class="cart-cust-dialog" v-show="isShow">
			<!-- 搜索内容开始 -->
			<view class="index-search">
				<view class="index-search-cont">
					<view class="search-input-box" style="width: 100%;">
						<input class="index-search-txt" confirm-type="search" v-model="keyTxt" placeholder="名称/电话"  @confirm="toSearch()"  />
						<button class="index-search-btn s-btn" @click="toSearch()">搜索</button>
					</view>
				</view>
			</view>
			<!-- 搜索内容结束 -->
			<radio-group @change="radioChange" style="margin-top: 80rpx;">
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
				<view class="ub umar-a">
					<view class="ub ub-f1 am-btn-default"><button class="am-btn" @click="cancelModal()">取消</button></view>
					<view class="ub ub-f1 am-btn-primary"><button class="am-btn am-text-white" @click="toSumit()">提交</button></view>
				</view>
			</view>
		</view>
		<!-- 备注\代理商选中弹层内容结束 -->
		
		<!-- 主要内容开始 -->
		<view class="detail-main">
			<view class="detail-txt">
				<text class="detail-name">{{detInfo.title}}</text>
				<text class="detail-price">￥{{detInfo.currentprice}}</text>/{{detInfo.unit}}
				<!-- <text v-if="userInfo.c_level == 1">进价:￥{{detInfo.inprice}}/{{detInfo.unit}}</text> -->
			</view>
			<view class="detail-cart ub ub-ac" v-if="entType != 'tobuy'">
				<uni-number-box :min="1" @change="changeCart"></uni-number-box>
				<!-- <text class="f28 ub" v-if="userInfo.c_level == 1">库存：{{detInfo.storageqty}}</text> -->
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
		<!-- <view class="goods-carts" v-if="userInfo.c_level == 1">
			<uni-goods-nav :text="text" :options="options" :fill="true" :button-group="buttonGroup" @click="openCart" @buttonClick="buttonClick"></uni-goods-nav>
		</view> -->
		<view class="cart-bottom custpro-bottom" style="bottom: 0;" v-if="entType != 'tobuy'">
			<view class="cart-bottom-cont"> 
				<view class="cart-bot-left">
					<view>总价格：<text class="cart-price">{{text[0].money}}</text></view>
					<view>总数量：<text class="cart-price">{{qty}}</text></view>
				</view>
				<button type="default" @click="selectCustomer()" class="cart-bot-right">代客下单</button>
			</view>
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
				custList: [],//代理商列表
				current: 0,//选中代理商index
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
				isShow: false,
				note: '',//备注信息
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
				p:1,
				pageSize:10,
				pageCount: '',
				entType:'',//进货进入和其他页面进入
				keyTxt:'',
				isShowImg : false,
				imgPath : ""
				
			}
		},
		onLoad(option) {
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					this_.erpCode = option.code;
					this_.entType = option.type;
					//获取产品详情
					this_.getProInfo(option.code);
			    }
			});
		},
		methods: {
			//获取产品详情
			getProInfo(code){
				let this_ = this;
				/*console.log(this_.userInfo);
				let url = "";
				if(this_.userInfo.c_level == 1){
					url = this_.$api.ProductByCode+'?c_id='+ this_.userInfo.c_id + '&c_ma001='+ this_.userInfo.c_ma001 +'&c_type='+this_.userInfo.c_type + '&code=' + code + '&storage='+this_.userInfo.storage;
				}else if(this_.userInfo.c_level == 2){
					url = this_.$api.ProductByCode+'?c_id='+ this_.userInfo.c_id + '&c_ma001='+ this_.userInfo.c_ma001 +'&c_type='+this_.userInfo.c_type + '&code=' + code;
				}*/
				console.log(code);
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductByCode+'?c_id='+ this_.userInfo.c_id + '&c_ma001='+ this_.userInfo.c_ma001 +'&c_type='+this_.userInfo.c_type + '&code=' + code,
					method:'GET',
					//data:{},
				}).then(res => {
					//请求成功
					console.log(res.data[0]);
					this_.detInfo = res.data[0];
					this_.slidArr = res.data[0].sliderpics.split(",");
					// this_.tablepara = this_.detInfo.tableparamter.split(';');
					// this_.tablepara.pop();
				    this_.detInfo.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
					   this_.contImg.push(this_.$http.imgUrl+capture);
				    });
					this_.text[0].money = '¥'+this.qty * this.detInfo.currentprice;
					this_.a_id = res.data[0].a_id;
				},error => {
					console.log(error);
				});
				//一级代理商,进价和库存
				/*if(this_.userInfo.c_level == 1){
					//获取进价
					this_.$http.httpTokenRequest({
						url:this_.$api.InPrice+'?c_ma001='+ this_.userInfo.c_ma001 +'&code=' + code,
						method:'GET',
						data:{},
					}).then(res => {
						//请求成功
						if(res.data.length>0){
							this_.$set(this_.detInfo, 'inprice', res.data[0].price);
						}else{
							this_.$set(this_.detInfo, 'inprice', 0);
						}
						
					},error => {
						console.log(error);
					});
					//获取库存
					this_.$http.httpTokenRequest({
						url:this_.$api.StoreQty+'?storage='+this_.userInfo.storage +'&code=' + code,
						method:'GET',
						data:{},
					}).then(res => {
						//请求成功
						let storaTotal = 0;
						if(res.data.length>0){
							for(let i=0;i<res.data.length;i++){
								storaTotal = storaTotal + res.data[i].mc007;
							}
						}
						this_.$set(this_.detInfo, 'storageqty', storaTotal);
					},error => {
						console.log(error);
					});
				}*/
				
			},
			changeCart(e){
				let this_ = this;
				this_.text[0].money = '¥'+ e * this_.detInfo.currentprice;
				this_.qty = e;
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
					data:{"c_id":this_.userInfo.c_id,"c_ma001":this_.userInfo.c_ma001,"c_ma002":this_.userInfo.c_ma002,"i_mb001":this_.erpCode,"qty":this_.qty,"a_id":this_.a_id},
				}).then(res => {
					//请求成功
					if(res.data.State){
						if(res.data.State){
							uni.showToast({
								title:'添加成功，在购物车等亲～',
								duration:1500
							})
							let total = parseInt(uni.getStorageSync('cartNum')) + parseInt(this_.qty);
							this_.options[0].info = total;
							uni.setStorageSync('cartNum',total);
						}
					}
				},error => {
					console.log(error);
				});
			},
			openCart (e) {
				uni.navigateTo({
					url : '../cart/cart'
				})
			},
			buttonClick (e) {
				console.log(e)
				if(e.index == 0){
					this.toCart();
				}else if(e.index == 1){
					uni.navigateTo({
						url : '../cart/cart'
					})
				}
				
			},
			//修理厂列表
			selectCustomer(){
				uni.showLoading();
				let this_ = this;
				this_.isShow = true;
				let state = 0;
				this_.$http.httpTokenRequest({
					url:this_.$api.GetUser+'?name='+this_.keyTxt+'&tel=&ma001='+ this_.userInfo.c_ma001 +'&m_id='+ this_.userInfo.c_m_id +'&state='+ state +'&pageindex='+ this_.p +'&pagesize='+this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					console.log(res.data);
					this_.custList = res.data.rows;
					uni.hideLoading();
				},error => {
					console.log(error);
				});
				
				
			},
			//选择修理厂
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
				var this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.CustAgentOrder,
					method:'POST',
					data:{
						"c_id":this_.custList[0].c_id,
						"c_openid":this_.custList[0].c_openid,
						"c_nickname":this_.custList[0].c_nickname,
						"c_ma001":this_.userInfo.c_ma001,
						"c_ma002":this_.userInfo.c_ma002,
						"c_tel":this_.custList[0].c_tel,
						"c_address": this_.custList[0].c_prov + this_.custList[0].c_city + this_.custList[0].c_address,
						"note": this_.note,
						"item":[{mb001:this_.detInfo.erpcode,qty:this_.qty,a_id:this_.detInfo.a_id}],
						"m_id":this_.userInfo.c_m_id
					},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					if(res.data.State){
						uni.showToast({
							title:'下单成功～',
							duration:1500
						});
						setTimeout(function(){
							uni.navigateTo({
								url:'../reporder/reporder?id=0'
							})
						},1500);
					}
				},error => {
					console.log(error);
				});
			},
			cancelModal(){
				var this_ = this;
				this_.isShow = !this_.isShow;
			},
			//查询
			toSearch(){
				let this_ = this;
				this_.p = 1;
				this_.selectCustomer();
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

<style>
.detail-td{
	border-left: 1px solid #eee;
}
.second{
	background-color: #FFFFFF;
}
.second .uni-tab__cart-sub-left{
	flex: 1 !important;
}
.second .uni-tab__cart-sub-right{
	flex: initial;
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
	bottom:0
}
.ub-fv{
	height: 100%;
}
.scroll-eara{
	height: 100vh;
	width: 100%;
	/* overflow: scroll; */
}
</style>
