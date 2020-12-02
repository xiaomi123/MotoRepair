<template>
	<view class="cart-container">
		<!--备注弹层-->
		<view class="login-dialog" v-if="isShow">
			<view class="login-dialog-cont">
				<view class="login-dialog-title">提交订单</view>
				<view class="login-list">
					<text class="login-list-fl">备注信息</text>
					<view class="login-list-fr">
						<textarea class="f32" v-model="note" placeholder="请填写您的备注信息" placeholder-style="color:#999" />
					</view>
				</view>
				
				<view class="ub">
					<button type="default" class="login-dialog-btn ub ub-ac ub-pc" @click="cancelModal()">取消</button>
					<button type="primary" class="login-dialog-btn ub ub-ac ub-pc" @click="closeModal()">提交</button>
				</view>
			</view>
		</view>
		<!--备注弹层-->
		<!--头部管理-->
		<view class="ub ub-ac">
			<view class="cart-bot-left ub ub-f1 ub-ac">
				<checkbox-group @change="checkAll">
					<label>
						<checkbox value="all" :checked="ckAll" /><text>全选</text>
					</label>
				</checkbox-group>
			</view>
			<view class="ub">
				<button type="default" size="mini" @click="delAll()" ref="button">管理</button>
			</view>
		</view>
		<view class="cart-content" v-if="cartList.length>0">
			<view class="cart-list" v-for="item in cartList">
				<uni-swipe-action>
				    <uni-swipe-action-item :options="options" @click="toDelCart(item)">
				        <view class='cont'>
							<view class="cart-left am-fl">
								<checkbox-group ref="checkboxItem" @change="checkboxChange">
									<label>
										<checkbox :value="`${item.s_id}`" checked="true" />
									</label>
								</checkbox-group>
							</view>
							<view class="cart-right am-fl">
								<view class="cart-right-cont">
									<image :src="$http.imgUrl+item.titlepicurl" mode="widthFix" class="cart-img"></image>
									<view class="cart-info">
										<view class="am-blod f32">{{item.title}}</view>
										<!-- <view class="cart-txt">适用范围：{{item.suitable}}</view> -->
										<view>单价：<text class="cart-price">￥{{item.currentprice}}</text></view>
										<view class="cart-opt">
											数量：
											<button type="default" @click="changeCart('reduce',item)" class="cart-cut">-</button>
											<input type="text" v-model="item.s_qty" class="cart-num" disabled="disabled" />
											<button type="default" @click="changeCart('add',item)" class="cart-add">+</button>
										</view>
									</view>
								</view>
							</view>
						</view>
				    </uni-swipe-action-item>
				</uni-swipe-action>
			</view>
		</view>
		<!-- 固定底部内容开始 -->
		<!-- <view class="cart-bottom">
			<view class="cart-bottom-cont"> 
				<view class="cart-bot-left">
					<view>总价格：<text class="cart-price">￥{{totalPrice}}</text></view>
					<view>总数量：<text class="cart-price">{{totalNum}}</text></view>
				</view>
				<button type="default" @click="toSumit()" class="cart-bot-right">提交订单</button> 
			</view>
		</view> -->
		<!-- 固定底部内容结束 -->
		
		<!-- 底部内容 购物车批量删除 -->
		<view class="cart-bottom" v-if="manager">
			<view class="cart-bottom-cont"> 
				<view class="cart-bot-left ub ub-ac">
					<checkbox-group @change="checkAll">
						<label>
							<checkbox value="all" :checked="ckAll" /><text>全选</text>
						</label>
					</checkbox-group>
				</view>
				<button type="default" class="cart-bot-right am-btn-danger" @click="toDelCart()">删除</button>
			</view>
		</view>
		<!-- 底部内容 购物车批量删除 -->
		<!-- 底部内容 价格结算 -->
		<view class="cart-bottom" v-else>
			<view class="cart-bottom-cont"> 
				<view class="cart-bot-left">
					<view>总价格：<text class="cart-price">￥{{totalPrice}}</text></view>
					<view>总数量：<text class="cart-price">{{totalNum}}</text></view>
				</view>
				<button type="default" @click="toSumit()" class="cart-bot-right">提交订单</button>
			</view>
		</view>
		
		<!-- 提交订单弹层内容开始 -->
		<view></view>
		<!-- 提交订单弹层内容结束 -->
		<!-- 底部导航 -->
		<tabBar :current="currentTabIndex" :column="4" :options="tabList"></tabBar>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	export default {
		components:{
			uniSwipeAction,
			uniSwipeActionItem
		},
		data() {
			return {
				userInfo:{},//用户信息
				cartList:[],//购物车
				note:'',//备注
				totalPrice:0,//总价格
				totalNum:0,//总数量
				ckAll:true,
				manager : false,//是否显示批量删除
				isShow: false,
				options : [{
					text : '删除',
					style : {
						backgroundColor : '#ff0000'
					}
				}],
				tabList: [
					{
						pagePath : '../index/index',
						iconPath:"../../../static/images/icon_index_bottom01.png",
						selectedIconPath:"../../../static/images/icon_index_bottom11.png",
						text : '首页',
						badge : ''
					},{
						pagePath : '../cart/cart',
						iconPath:"../../../static/images/icon_index_bottom03.png",
						selectedIconPath:"../../../static/images/icon_index_bottom13.png",
						text : '购物车',
						badge : uni.getStorageSync('cartNum'),
						type : uni.getStorageSync('cartNum') == "" ? '' : 'error'
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
				currentTabIndex:1
			}
		},
		onLoad(option) {
			this.init();
		},
		onShow(){
			this.totalPrice = 0,//总价格
			this.totalNum = 0,//总数量
			this.init();
		},
		methods: {
			init(){
				//读取存储数据
				let this_ = this;
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
						this_.userInfo = res.data[0];
						//获取购物车列表
						this_.getCartList();
						
				    }
				});
			},
			//获取购物车列表
			getCartList(code){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.GetShopCart+'?c_id='+ this_.userInfo.c_id,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					this_.cartList = res.data;
					console.log(res.data);
					let sum_price = 0;
					let sum_num = 0;
					for(let i=0;i<res.data.length;i++){
						sum_price += res.data[i].s_qty * res.data[i].currentprice;
						sum_num += res.data[i].s_qty;
					}
					this_.totalPrice = sum_price;
					this_.totalNum = sum_num;
					uni.setStorageSync('cartNum',this_.totalNum);
					this_.tabList[1].badge = this_.totalNum;
				},error => {
					console.log(error);
				});
			},
			//加减购物车
			changeCart(type,item){
				let this_ = this;
				if(type=='add'){
					item.s_qty++;
					this_.totalNum++;
					this_.totalPrice += item.currentprice;
					this_.addCart(item.erpcode,item.s_qty,item.s_a_id);
				}else if(type=='reduce'){
					if(item.s_qty>1){
						item.s_qty--;
						this_.totalNum--;
						this_.totalPrice -= item.currentprice;
						this_.addCart(item.erpcode,item.s_qty,item.s_a_id);
					}else if(item.s_qty == 1){
						uni.showToast({
							icon : 'none',
							title : '该宝贝不能减少了呦～',
							duration:1500
						})
					}
				}
				
			},
			//删除购物车
			toDelCart(item){
				let this_ = this;
				let sIdArr = [];
				if(item){
					sIdArr = [{"s_id":item.s_id}]
				}else{
					let checkboxList = uni.createSelectorQuery().in(this)._component.$refs.checkboxItem;
					checkboxList.forEach(item => {
						if(item.checkboxList[0].checkboxChecked == true){
							let _ = {"s_id":item.checkboxList[0].checkboxValue};
							sIdArr.push(_);
							
						}
					})
				}
				//console.log(sIdArr);
				uni.showModal({
					title: '提示',
					content: '确认将该宝贝删除吗？',
					success: (res) => {
						if (res.confirm) {
							this_.delCart(sIdArr);
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
				// let sIdArr = [{"s_id":item.s_id}]
				// uni.showModal({
				// 	title: '提示',
				// 	content: '确认将这1个宝贝删除？',
				// 	success: (res) => {
				// 		if (res.confirm) {
				// 			this_.delCart(sIdArr);
				// 		} else if (res.cancel) {
				// 			console.log('用户点击取消');
				// 		}
				// 	}
				// })
			},
			//购物车数量修改
			addCart(erpcode,qty,aId){
				let this_ = this;
				//加减购物车接口
				this_.$http.httpTokenRequest({
					url:this_.$api.AddShopCart,
					method:'POST',
					data:{"c_id":this_.userInfo.c_id,"c_ma001":this_.userInfo.c_ma001,"c_ma002":this_.userInfo.c_ma002,"i_mb001":erpcode,"qty":qty,"a_id":aId},
				}).then(res => {
					//请求成功
					if(res.data.State){
						console.log("添加购物车成功");
						uni.setStorageSync('cartNum',this_.totalNum);
						this_.tabList[1].badge = this_.totalNum;
					}
				},error => {
					console.log(error);
				});
			},
			//删除购物车
			delCart(sIdArr){
				let this_ = this;
				//删除购物车
				this_.$http.httpTokenRequest({
					url:this_.$api.DelShopCart,
					method:'POST',
					data:sIdArr,
				}).then(res => {
					//请求成功
					if(res.data.State){
						this_.cartList = [];
						this_.init();
					}
				},error => {
					console.log(error);
				});
			},
			//管理
			delAll() {
				if(!this.manager){
					this.$refs.button.$el.innerHTML = "完成";
				}else{
					this.$refs.button.$el.innerHTML = "管理";
				}
				this.manager = !this.manager;
			},
			//全选
			checkAll(e){
				this.ckAll = !this.ckAll;
				let checkboxList = uni.createSelectorQuery().in(this)._component.$refs.checkboxItem;
				checkboxList.forEach(item => {
					if(this.ckAll){
						item.checkboxList[0].checkboxChecked = true;
					}else{
						item.checkboxList[0].checkboxChecked = false;
					}
				})
			},
			//监听单个checkbox的change
			checkboxChange(e){
				if(e.detail.value.length == 0){
					this.ckAll = false;
				}else{
					let checkboxList = uni.createSelectorQuery().in(this)._component.$refs.checkboxItem;
					let len = 0;
					checkboxList.forEach(item => {
						if(item.checkboxList[0].checkboxChecked == true){
							len++;
						}
					})
					if(len == this.cartList.length){
						this.ckAll = true;
					}
				}
			},
			//打开备注留言弹窗
			toSumit(){
				let this_ = this;
				this_.isShow = !this_.isShow;
			},
			//关闭弹窗并提交订单
			closeModal(){
				var this_ = this;
				this_.isShow = !this_.isShow;
				let sIdArr = [];
				for(var i=0;i<this_.cartList.length;i++){
					sIdArr.push({"s_id":this_.cartList[i].s_id});
				}
				this_.$http.httpTokenRequest({
					url:this_.$api.OrderNew,
					method:'POST',
					data:{
						"c_id":this_.userInfo.c_id,
						"c_openid":this_.userInfo.c_openid,
						"c_nickname":this_.userInfo.c_nickname,
						"c_ma001":this_.userInfo.c_ma001,
						"c_ma002":this_.userInfo.c_ma002,
						"c_tel":this_.userInfo.c_tel,
						"c_address":this_.userInfo.c_address,
						"note":this_.note,
						"cart":sIdArr,
						"m_id":this_.userInfo.c_m_id
						},
				}).then(res => {
					//请求成功
					if(res.data.State == 'true'){
						uni.showToast({
							icon:'none',
							title: '订单提交成功！',
							duration:1500
						})
						setTimeout(function(){
							uni.navigateTo({
								url : '../myorder/myorder'
							})
						},1700)
					}else{
						uni.showToast({
							icon:'none',
							title: res.data.Message,
							duration:1500
						})
					}
				},error => {
					console.log(error);
				});
			},
			cancelModal(){
				var this_ = this;
				this_.isShow = !this_.isShow;
			},
		}
	}
</script>

<style>
.login-title{
	padding-bottom: 15rpx;
	font-size: 32rpx;
	color: #333333;
}
</style>
