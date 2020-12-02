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
		
		<!-- 主要内容开始 -->
		<view class="detail-main">
			<view class="detail-txt">
				<text class="detail-name">{{detInfo.title}}</text>
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
		<view class="cart-cust-dialog" v-show="isShow" style="background-color: rgba(0,0,0,0.5);padding: 0;text-align: center;" @click="closeDig();">
			<movable-area class="scroll-eara"> 
				<movable-view class="scroll-eara" direction="all" scale="true" out-of-bounds="true" scale-min="1" scale-max="4">
					<scroll-view style="height: 100vh;" scroll-x="true" scroll-y="true"><image :src="imgPath" mode="widthFix"></image></scroll-view>
				</movable-view>
			</movable-area> 
		</view>
		<!-- 详情图片查看器 -->
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},//用户信息
				detInfo:{},//产品详情
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				slidArr:[],//轮播
				tablepara:[],//适用车型对照表
				contImg:[],//图文详情,
				isShow : false,
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
					url:this_.$api.ProductByCode+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type + '&code=' + code,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					console.log(res);
					this_.detInfo = res.data[0];
					this_.slidArr = res.data[0].sliderpics.split(",");
					//this_.tablepara = this_.detInfo.tableparamter.split(';');
					//this_.tablepara.pop();
				    this_.detInfo.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
					   this_.contImg.push(this_.$http.imgUrl+capture);
				    });
				},error => {
					console.log(error);
				});
			},
			bigImg(url){
				this.imgPath = url;
				this.isShow = !this.isShow;
			},
			closeDig(){
				this.isShow = !this.isShow;
			},
		}
	}
</script>

<style>
	.cart-cust-dialog{
		background-color: rgba(0,0,0,0.5);
		padding: 0;
		text-align: center;
	}
	.scroll-eara{
		width: 100%;
		height:100%;
		/* overflow: scroll; */ 
	}
	
</style>
