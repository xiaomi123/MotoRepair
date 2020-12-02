<template>
	<view class="index_container">
		<!-- 代理商厂信息补全弹层开始 -->
		<view class="login-dialog" v-if="userInfo.isfirst==1"> 
			<view class="login-dialog-cont">
				<view class="login-title">为了准确为您和您的客户推送消息，请准确录入您的手机号</view>
				<view class="login-list">
					<text class="login-txt">联系电话</text>
					<input class="uni-input login-input" v-model="agentInfo.c_tel" placeholder="请录入联系电话" />
				</view>
				<button type="primary" class="login-dialog-btn" @click="submitAgent()">提交</button>
			</view>
		</view>
		<!-- 代理商信息补全弹层结束 -->
		
		<!-- 搜索内容开始 -->
		<view class="index-search" style="top:0">
			<view class="index-search-cont">
				<!-- <button class="index-search-btn" @click="filter()">机型目录</button> -->
				<button class="index-search-btn">产品目录</button>
				<view class="search-input-box">
					<input class="index-search-txt" confirm-type="search" v-model="keywords" placeholder="请输入产品机型或车型"  @confirm="search" />
					<button class="index-search-btn s-btn" @click="search()">搜索</button>
				</view>
			</view>
		</view>
		<!-- 搜索内容结束 -->
		
		<!-- 轮播内容开始 -->
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper index-slide" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" indicator-color="#999" indicator-active-color="#14489b">
						<swiper-item>
							<view class="swiper-item"><image src="../../../static/images/img_index_slide01.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item"><image src="../../../static/images/img_index_slide02.jpg" mode="scaleToFill" class="index_slidImg"></image></view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<!-- 轮播内容结束 -->
		
		<view class="notice-bar" v-if="addRep>0" @click="toRepair()">
			<uni-notice-bar showIcon="true" :text="desc02+addRep" :backgroundColor="'#c8ecc8'" :color="'#36ce36'"></uni-notice-bar>
		</view>
		<view class="notice-bar" v-if="addNum>0" @click="toOrder()">
			<uni-notice-bar showIcon="true" :text="desc+addNum"></uni-notice-bar>
		</view>
		
		<!-- 快捷键 -->
		<view class="example-body">
			<uni-grid :column="3" :show-border="false" :square="false" :highlight="false">
				<uni-grid-item v-if="index < 6" v-for="(item ,index) in menuList" :index="index" :key="index">
					<view class="grid-item-box" @click="commonMenu(item)">
						<image class="image" :src="item.url" mode="aspectFill" />
						<text class="text">{{item.text}}</text>
						<view v-if="item.badge" class="grid-dot">
							<uni-badge :text="item.badge" :type="item.type" style="width:10px" />
						</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		
		<view class="index-content">
			<view class="modal-title"></view>
			<view class="index-product">
				<view class="index-list" v-for="(item,index) in proList" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="index-listImg"></image>
					<view class="index-uinn">
						<text class="index-title">{{item.title}}</text>
						<view>售价:<text class="am-text-danger">￥</text><text class="index-price">{{item.currentprice}}</text></view>
						<view class="index-txt">
							<text>型号:{{item.productmodel}}</text>
						</view>
						<view class="index-txt"><text>适用范围:{{item.suitable}}</text></view>
						<view class="index_collect ub ub-ac">
							<text class="ub f32 am-blod" v-if="item.a_id > 0">赠</text>
							<text class="iconfont ub umar-l" @click.stop="collCancle(item)" v-if="item.f_id">&#xe7bd;</text>
							<text class="iconfont ub umar-l" @click.stop="collect(item)" v-else>&#xe7bc;</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 上拉加载 start -->
		<uni-load-more :status="status" class="am-umar-tbar"></uni-load-more>
		<!-- 上拉加载 end -->
		<!-- 底部导航 -->
		<tabBar :current="currentTabIndex" :column="tabNum" :options="tabList"></tabBar>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import uniGrid from '@/components/uni-grid/uni-grid.vue'
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniBadge from '@/components/uni-badge/uni-badge.vue'
	export default {
		components:{
			uniPopup,
			uniIcons,
			uniNoticeBar,
			uniLoadMore,
			uniGrid,
			uniGridItem,
			uniBadge
		},
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				proList:[],//产品列表
				userInfo:{},//用户信息
				desc : '您有新订单数量（请点击查看）',
				addNum:0,//代理商新订单数量（每次登录后查询）
				desc02:'您有新待审核账号（请点击查看）',
				addRep:0,
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
				keywords: '',
				tabList: [
					{
						pagePath : '../index/index',
						iconPath:"../../../static/images/icon_index_bottom01.png",
						selectedIconPath:"../../../static/images/icon_index_bottom11.png",
						text : '首页',
						badge : ''
					},{
						pagePath : '../customer/customer',
						iconPath:"../../../static/images/icon_index_bottom05.png",
						selectedIconPath:"../../../static/images/icon_index_bottom15.png",
						text : '客户',
						badge : ''
					},{
						pagePath : '../user/user',
						iconPath:"../../../static/images/icon_index_bottom04.png",
						selectedIconPath:"../../../static/images/icon_index_bottom14.png",
						text : '我的',
						badge : ''
					}
				],
				tabNum:3,
				currentTabIndex:0,
				agentInfo:{
					c_tel:'',
					c_tel1:'',
					c_nickname:'',
					c_prov:'',
					c_city:'',
					c_address:'',
					c_state:'0',
					c_main: '',
				},
				menuList : [{
					url : '../../../static/images/menu6.png',
					text : '收藏夹',
					linkUrl:'../collect/collect',
					badge : ''
				},{
					url : '../../../static/images/menu2.png',
					text : '到货提醒',
					linkUrl:'../booking/booking',
					badge : '',
					type: "error"
				},{
					url : '../../../static/images/menu3.png',
					text : '修理厂订单',
					linkUrl:'../reporder/reporder?id=0',
					badge : ''
				}]
			}
		},
		onLoad() {
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					console.log(res);
					this_.userInfo = res.data[0];
					if(this_.userInfo.c_level == 1){
						this_.tabList.splice(1,0,{
							pagePath : '../tobuy/tobuy',
							iconPath:"../../../static/images/icon_index_bottom06.png",
							selectedIconPath:"../../../static/images/icon_index_bottom16.png",
							text : '进货',
							badge : ''
						});
						this_.tabNum = 4;
					}
					//补录信息回显
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
					
					this_.getNewOrder();//代理商新订单数量
					this_.getNewRepair();//修理厂新增账号
					this_.getProduct();//产品列表
					this_.getRemindNum(); //到货产品数量
					
			    }
			});
			this.$check.cartNum();
		},
		onShow(){
			this.getNewOrder();//代理商新订单数量
			this.getNewRepair();//修理厂新增账号
		},
		methods: {
			//修理厂/代理商信息补全 -----手机号必填
			submitAgent(){
				let this_ = this;
				if(this_.$check.isEmpty(this_.agentInfo.c_tel)){
					uni.showToast({
						icon : 'none',
						title : "手机号不能为空",
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
				}
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.UserState+'?c_id='+ this_.userInfo.c_id,
					method:'POST',
					data:this_.agentInfo,
				}).then(res => {
					uni.hideLoading();
					//请求成功
					if(res.data.State){
						uni.showToast({
							icon : 'none',
							title : res.data.Message,
							duration:1500
						});
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
					}
				},error => {
					console.log(error);
				});
				
			},
			//新增订单点击进入
			toOrder(){
				uni.navigateTo({
				 	url: '../reporder/reporder?id=0'
				}); 
			},
			//新增待审核账号
			toRepair(){
				uni.navigateTo({
				 	url: '../newrepair/newrepair'
				}); 
			},
			//代理商新订单数量（每次登录后查询）
			getNewOrder(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.CustNewOrderQty+'?c_ma001='+ this_.userInfo.c_ma001 + '&m_id=' + this_.userInfo.c_m_id,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					this_.addNum = res.data;
				},error => {
					console.log(error);
				});
			},
			//代理商待审核账号
			getNewRepair(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.UserQty+'?state=1&ma001=' + this_.userInfo.c_ma001 + '&m_id=' + this_.userInfo.c_m_id,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					this_.addRep = res.data;
				},error => {
					console.log(error);
				});
			},
			//产品列表
			getProduct(){
				let this_ = this;
				//获取首页产品列表
				uni.showLoading();
				/*let url = '';
				// if(this_.userInfo.c_level == 1){
				// 	url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				// }else if(this_.userInfo.c_level == 2){
				// 	url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				// }
				if(this_.userInfo.c_level == 1){
					url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				}else if(this_.userInfo.c_level == 2){
					url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				}
				if(this_.userInfo.c_level == 1){
					url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				}else if(this_.userInfo.c_level == 2){
					url = this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&pageindex='+this_.p+'&pagesize='+this_.pageSize;
				}*/
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductHome+'?c_id='+ this_.userInfo.c_id + '&c_type='+this_.userInfo.c_type+'&c_ma001='+this_.userInfo.c_ma001+'&tag='+this_.keywords+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					uni.hideLoading();
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
				
				
			},
			
			//点击产品列表进入详情
			toDetail(item){
				let this_ = this;
				uni.navigateTo({
				 	url: '../detail/detail?code='+item.erpcode + '&type=index'
				}); 
			},
			//到货产品数量
			getRemindNum(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.RemindQty+'?c_id='+ this_.userInfo.c_id +'&storage=' + this_.userInfo.storage,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					this_.menuList[1].badge = res.data;
				},error => {
					console.log(error);
				});
			},
			//点击收藏
			collect(item){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.AddFavorite,
					method:'POST',
					data:{"c_id":this_.userInfo.c_id,"c_ma001":this_.userInfo.c_ma001,"c_ma002":this_.userInfo.c_ma002,"i_mb001":item.erpcode},
				}).then(res => {
					//请求成功
					if(res.data.State){
						item.f_id = res.data.centent;
						uni.showToast({
							icon : 'none',
							title : '收藏成功',
							duration:1500
						});
					}
					
				},error => {
					console.log(error);
				});
			},
			//取消收藏
			collCancle(item){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.DelFavorite,
					method:'POST',
					data:[{"f_id":item.f_id}],
				}).then(res => {
					//请求成功
					if(res.data.State){
						item.f_id = '';
					}
					uni.showToast({
						icon : 'none',
						title : '取消收藏',
						duration:1500
					});
				},error => {
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
			//目录
			filter(){
				uni.navigateTo({
					url : '../cate/cate'
				});
			},
			search(e){
				//this.getProduct();
				let this_ = this;
				uni.navigateTo({
					url : '../proList/proList?scode=&keyWord='+ this_.keywords
				});
			},
			//常用快捷键
			commonMenu(e){
				uni.navigateTo({
					url : e.linkUrl+"?id="+e.id
				})
			},
			
		},
		//上拉加载
		onReachBottom (){
			if(this.p < this.pageCount){
				this.p++;
				this.status = 'loading';
				this.getProduct();
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
.example-body {
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	padding: 15rpx 0;
	font-size: 14px;
}
.grid-item-box {
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.image {
	width: 80rpx;
	height: 80rpx;
}
.text {
	font-size: 26rpx;
	margin-top: 10rpx;
}
.grid-dot {
	position: absolute;
	top: 1px;
	right: 30px;
}

</style>