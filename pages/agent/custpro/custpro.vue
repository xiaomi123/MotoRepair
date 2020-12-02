<template>
	<view class="custpro-container">
		<!--备注弹层-->
		<view class="login-dialog" v-if="isShow">
			<view class="login-dialog-cont">
				<view class="login-title">备注信息</view>
				<view class="login-list">
					<textarea class="f32" v-model="note" placeholder="请填写您的备注信息" placeholder-style="color:#999" />
				</view>
				<view class="ub">
					<button type="default" class="login-dialog-btn ub ub-ac ub-pc" @click="isShow = false">取消</button>
					<button type="primary" class="login-dialog-btn ub ub-ac ub-pc" @click="confirmSub()">提交</button>
				</view>
			</view>
		</view>
		<!--备注弹层-->
		<view class="custpro-main search-cont">
			<!-- 搜索内容开始 -->
			<view class="index-search">
				<view class="index-search-cont">
					<view class="search-input-box" style="width: 100%;">
						<input class="index-search-txt" confirm-type="search" v-model="tag" placeholder="请输入"  @confirm="toSearch()"  />
						<button class="index-search-btn s-btn" @click="toSearch()">搜索</button>
					</view>
				</view>
			</view>
			<!-- 搜索内容结束 -->
			
			<view class="custpro-list" v-for="(item,index) in proList">
				<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="custpro-img"></image>
				<view class="custpro-fr">
					<view class="custpro-cont">
						<view class="custpro-item">
							<text class="custpro-title">{{item.title}}</text>
							<view>售价:<text class="am-text-danger">￥</text><text class="index-price">{{item.currentprice}}</text></view>
						</view>
						<view class="custpro-cart" v-if="enter=='custorder'">
							<uni-number-box :min="0" :value="0" @change="changeCart($event,index)"></uni-number-box>
						</view>
						<view class="custpro-cart" v-if="enter=='recomm'">
							<button type="primary" class="custpro-recom" @click="recommend(item)" v-if="$check.isEmpty(item.recom)">推荐</button>
							<button type="default" class="custpro-recom" style="background-color:#dedede;color:rgba(0,0,0,.6)" v-else>已推荐</button>
						</view>
					</view>
					<view class="custpro-txt">
						<view class="index-txt"><text>型号:{{item.productmodel}}</text></view>
						<text class="index-give" v-if="item.a_id>0">赠</text>
					</view>
					<view class="index-txt"><text>库存:{{item.storage}}</text></view>
				</view>
			</view>
		</view>
		<view class="cart-bottom custpro-bottom" v-if="enter=='custorder'">
			<view class="cart-bottom-cont"> 
				<view class="cart-bot-left">
					<view>总价格：<text class="cart-price">￥{{totalPrice}}</text></view>
					<view>总数量：<text class="cart-price">{{totalNum}}</text></view>
				</view>
				<button type="default" @click="toSumit()" class="cart-bot-right">提交订单</button>
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
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components:{
			uniLoadMore,
		},
		data() {
			return {
				duration: 500,
				proList:[],//产品列表
				userInfo:{},//用户信息
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
				custInfo:{},
				enter:'',//判断是推荐还是下单
				note:'',//代下单备注
				isShow:false,//代下单弹层
				totalPrice:0,//总价格
				totalNum:0,//总数量
				tag:'',
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
						text : '代客下单',
						badge : ''
					},{
						pagePath : '../user/user',
						iconPath:"../../../static/images/icon_index_bottom04.png",
						selectedIconPath:"../../../static/images/icon_index_bottom14.png",
						text : '我的',
						badge : ''
					}
				],
				tabNum:4,
				currentTabIndex:2,
				keyTxt:'',//关键字
				role : '' //身份类型
			}
		},
		onLoad(option) {
			let this_ = this;
			//console.log('客户类型：'+option.type);
			this_.role = option.type == 1 ? 0 : 1;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
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
					this_.custInfo = JSON.parse(option.custInfo);
					this_.enter = this_.custInfo.enter;
					this_.getProduct();//产品列表
			    }
			});
			
		},
		methods: {
			//产品列表
			getProduct(){
				let this_ = this;
				//获取产品列表
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.ProductHome+'?c_id='+ this_.custInfo.c_id + '&c_type=' + this_.custInfo.c_type + '&tag='+this_.tag+'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
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
					for(let i = 0; i < this_.proList.length; i++){
						this_.$set(this_.proList[i], 'storage', 0);
					}
					console.log("产品");
					console.log(this_.proList);
					this_.status = 'more';
					this_.papeTotal(res.data.total);
					this_.getStockList();
				},error => {
					console.log(error);
				});
			},
			getStockList(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.CustStorage + '?ma002=' + this_.userInfo.c_ma002 + '&level=' + this_.userInfo.c_level + '&m_id=' + this_.userInfo.c_m_id + '&isonway=0&c_id=' + this_.custInfo.c_id,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					console.log("库存");
					console.log(res);
					for(let z=0;z<this_.proList.length;z++){
						for(let m=0;m<res.data.length;m++){
							if(res.data[m].erpcode == this_.proList[z].erpcode){
								this_.proList[z].storage = res.data[m].qty;
							}
						}
					}
					
					
					uni.hideLoading();
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
			//加减购物车
			changeCart(e,index){
				let this_ = this;
				this_.$set(this_.proList[index], 's_qty', e);
				this_.totalNum = 0;
				this_.totalPrice = 0;
				for(let i=0;i<this_.proList.length;i++){
					if(!this_.$check.isEmpty(this_.proList[i].s_qty)){
						this_.totalNum = parseInt(this_.totalNum) + parseInt(this_.proList[i].s_qty);
						this_.totalPrice = this_.totalPrice + (this_.proList[i].s_qty*this_.proList[i].currentprice);
					}
				}
				
			},
			//代理商代下单
			toSumit(){
				let this_ = this;
				this_.isShow = true;
			},
			//代下单”备注“弹层确认提交
			confirmSub(){
				let this_ = this;
				let cartItem = [];
				for(let i=0;i<this_.proList.length;i++){
					if(!this_.$check.isEmpty(this_.proList[i].s_qty)){
						if(this_.proList[i].s_qty != 0){
							cartItem.push({mb001:this_.proList[i].erpcode,qty:this_.proList[i].s_qty,a_id:this_.proList[i].a_id})
						}
					}
				}
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.CustAgentOrder,
					method:'POST',
					data:{
						"c_id":this_.custInfo.c_id,
						"c_openid":this_.custInfo.c_openid,
						"c_nickname":this_.custInfo.c_nickname,
						"c_ma001":this_.userInfo.c_ma001,
						"c_ma002":this_.userInfo.c_ma002,
						"c_tel":this_.custInfo.c_tel,
						"c_address": this_.custInfo.c_prov + this_.custInfo.c_city + this_.custInfo.c_address,
						"note": this_.note,
						"item":cartItem,
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
								url:'../reporder/reporder?id=0&type='+this_.role
							})
						},1500);
					}
				},error => {
					console.log(error);
				});
				this_.isShow = false;
			},
			//推荐
			recommend(item){
				let this_ = this;
				console.log(item)
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.CustRecommend,
					method:'POST',
					data:{
						"c_id":this_.custInfo.c_id,
						"c_ma001":this_.custInfo.c_ma001,
						"c_ma002":this_.custInfo.c_ma002,
						"i_mb001":item.erpcode,
						"title":item.title,
						"qty":1,
						"a_id": item.a_id,
						"is_reco":'1'
					},
				}).then(res => {
					//请求成功
					if(res.data.State){
						uni.showToast({
							title:'推荐成功～',
							duration:1500
						});
						this_.$set(item, 'recom', '1');
					}
				},error => {
					console.log(error);
				});
			},
			//查询
			toSearch(){
				this.p = 1;
				this.pageSize = 10;
				this.getProduct();
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
