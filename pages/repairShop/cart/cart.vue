<template>
	<view class="cart-container">
		<!--备注弹层-->
		<!-- <view class="login-dialog" v-if="isShow">
			<view class="login-dialog-cont">
				<view class="login-dialog-title">提交订单</view>
				<view class="login-list">
					<text class="login-list-fl">代&ensp;理&ensp;商：</text>
					<view class="login-list-fr">
						<input type="text" value="" @click="toCkCust()" readOnly />
					</view>
				</view>
				<view class="login-list">
					<text class="login-list-fl">备注信息：</text>
					<view class="login-list-fr">
						<textarea v-model="note" placeholder="请填写您的备注信息" placeholder-style="color:#999" />
					</view>
				</view>
				<view class="ub">
					<button type="default" class="login-dialog-btn ub ub-ac ub-pc" @click="cancelModal()">取消</button>
					<button type="primary" class="login-dialog-btn ub ub-ac ub-pc" @click="closeModal()">提交</button>
				</view>
			</view>
		</view> -->
		<!--备注弹层-->
		
		<!-- 备注\代理商选中弹层内容开始 -->
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
		<!-- 备注\代理商选中弹层内容结束 -->
		
		<!--头部管理-->
		<view class="ub ub-ac">
			<!-- <view class="cart-bot-left ub ub-f1 ub-ac">
				<checkbox-group @change="checkAll" v-show="cartList.length>1">
					<label>
						<checkbox value="all" :checked="ckAll" /><text>全选</text>
					</label>
				</checkbox-group>
			</view> -->
			<view class="ub cart-mag">
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
										<checkbox :value="`${item.s_id}`" :price="item.currentprice" :num="item.s_qty" checked="true" />
									</label>
								</checkbox-group>
							</view>
							<view class="cart-right am-fl">
								<view class="cart-right-cont">
									<image :src="$http.imgUrl+item.titlepicurl" mode="widthFix" class="cart-img"></image>
									<view class="cart-info">
										<view class="am-blod f32">{{item.title}}</view>
										<!-- <view class="cart-txt">适用范围：{{item.suitable}}</view> -->
										<view>单价：
											<text class="cart-price" v-if="userInfo.c_type == 1">￥{{item.currentprice}}<text style="display:inline-block;margin-left:10rpx;font-size:26rpx;color:#999">/{{item.unit}}</text></text>
											<text class="cart-price" v-else-if="userInfo.c_type == 3 && userInfo.c_isview == 1">￥{{item.a_price}}</text>
											<text class="cart-price f28" v-else="userInfo.c_type == 3 && userInfo.c_isview == 0">协议价</text>
											<text class="cart-recom" v-if="item.s_is_reco">已推荐</text>
											<text class="cart-recom" v-if="item.a_id>0">赠</text>
										</view>
										<view style="margin-bottom:14rpx;">
											规格：{{item.uqdescription}}
										</view>
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
				<button type="default" @click="openModal()" class="cart-bot-right">提交订单</button>
			</view>
		</view>
		<!-- 底部内容 价格结算 -->
		
		<!-- 提交订单弹层内容开始 -->
		<view></view>
		<!-- 提交订单弹层内容结束 -->
		<!-- 底部导航 -->
		<tabBar :current="currentTabIndex" :options="tabList"></tabBar>
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
				goodIds : [], //购买商品id集合
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
						iconPath:"../../../static/images/icon_index_bottom06.png",
						selectedIconPath:"../../../static/images/icon_index_bottom16.png",
						text : '购物车',
						badge : uni.getStorageSync('cartNum'),
						type : uni.getStorageSync('cartNum') == "" ? '' : 'error'
					},{
						pagePath : '../user/user',
						iconPath:"../../../static/images/icon_index_bottom04.png",
						selectedIconPath:"../../../static/images/icon_index_bottom14.png",
						text : '我的',
						badge : ''
					}
				],
				currentTabIndex:1,
				custList: [],//代理商列表
				current: 0,//选中代理商index
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
						if(this_.userInfo.c_type == 3){
							this_.tabList[0].pagePath = '../customerIndex/customerIndex';
						}
						//获取购物车列表
						this_.getCartList();
				    }
				});
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
					for(var i=0;i<res.data.length;i++){
						if(this_.userInfo.c_type == 3 && this_.userInfo.c_isview == 0){
							sum_price += res.data[i].s_qty * 0;
						}else if(this_.userInfo.c_type == 3 && this_.userInfo.c_isview == 1){
							sum_price += res.data[i].s_qty * res.data[i].a_price * res.data[i].unitquantity;
						}else if(this_.userInfo.c_type == 1){
							sum_price += res.data[i].s_qty * res.data[i].currentprice * res.data[i].unitquantity;
						}
						//sum_price += res.data[i].s_qty * res.data[i].currentprice;
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
				console.log(item);
				let this_ = this;
				let new_price = 0;
				if(this_.userInfo.c_type == 3 && this_.userInfo.c_isview == 0){
					new_price = 0;
				}else if(this_.userInfo.c_type == 3 && this_.userInfo.c_isview == 1){
					new_price = item.a_price*item.unitquantity;
				}else if(this_.userInfo.c_type == 1){
					new_price = item.currentprice*item.unitquantity;
				}
				
				if(type=='add'){
					item.s_qty++;
					this_.totalNum++;
					// this_.totalPrice += item.currentprice;
					this_.totalPrice += new_price;
					this_.addCart(item.erpcode,item.s_qty,item.s_a_id);
				}else if(type=='reduce'){
					if(item.s_qty>1){
						item.s_qty--;
						this_.totalNum--;
						// this_.totalPrice -= item.currentprice;
						this_.totalPrice -= new_price;
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
					sIdArr = [{"s_id":item.s_id}];
				}else{
					let checkboxList = uni.createSelectorQuery().in(this)._component.$refs.checkboxItem;
					checkboxList.forEach(item => {
						if(item.checkboxList[0].checkboxChecked){
							let _ = {"s_id":item.checkboxList[0].checkboxValue};
							sIdArr.push(_);
							
						}
					})
				}
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
			},
			//购物车数量修改
			addCart(erpcode,qty,aId){
				let this_ = this;
				//加减购物车接口
				this_.$http.httpTokenRequest({
					url:this_.$api.AddShopCart,
					method:'POST',
					data:{
						"c_id":this_.userInfo.c_id,
						"c_ma001":this_.userInfo.c_ma001,
						"c_ma002":this_.userInfo.c_ma002,
						"i_mb001":erpcode,
						"qty":qty,
						"a_id":aId,
						"is_reco":'0'
					},
				}).then(res => {
					//请求成功
					if(res.data.State){
						console.log("编辑购物车成功");
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
					console.log(res);
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
						if(item.checkboxList[0].checkboxChecked){
							len++;
							
						}
					})
					if(len == this.cartList.length){
						this.ckAll = true;
					}
				}
			},
			//提交订单
			openModal(){
				let this_ = this;
				this_.goodIds = [];
				let checkboxList = uni.createSelectorQuery().in(this)._component.$refs.checkboxItem;
				checkboxList.forEach(item => {
					if(item.checkboxList[0].checkboxChecked){
						this_.goodIds.push({"s_id":item.checkboxList[0].checkboxValue});
					}
				})
				if(this_.goodIds.length != 0){
					this_.isShow = !this_.isShow;
					//代理商产品列表
					let url = "";
					uni.showLoading();
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
						console.log(res);
						uni.hideLoading();
						this_.custList = res.data;
					},error => {
						console.log(error);
					});
				}else{
					uni.showToast({
						icon:'none',
						title:'请至少选择一件商品!',
						duration:1500
					})
				}
			
			},
			//关闭弹窗并提交订单
			toSumit(){
				var this_ = this;
				console.log(this_.custList);
				this_.$http.httpTokenRequest({
					url:this_.$api.CustAddOrder,
					method:'POST',
					data:{
						"c_id":this_.userInfo.c_id,
						"c_openid":this_.userInfo.c_openid,
						"c_nickname":this_.userInfo.c_nickname,
						"c_ma001":this_.custList[this_.current].c_ma001,
						"c_ma002":this_.custList[this_.current].c_ma002,
						"c_tel":this_.userInfo.c_tel,
						"c_address":this_.userInfo.c_prov + this_.userInfo.c_city + this_.userInfo.c_address,
						"note":this_.note,
						"cart":this_.goodIds,
						"m_id":this_.custList[this_.current].c_m_id,
						"s_type_no":this_.userInfo.c_type == 3 ? 1 : 0
						},
				}).then(res => {
					console.log(res);
					if(res.data.State == 'true'){
						uni.showToast({
							icon:'none',
							title: '订单提交成功！',
							duration:1500
						})
						this_.isShow = !this_.isShow;
						setTimeout(function(){
							uni.navigateTo({
								url : '../order/order?id=0'
							})
						},1500)
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
			},
			cancelModal(){
				var this_ = this;
				this_.isShow = !this_.isShow;
			},
		}
	}
</script>

<style>
.login-list{
	margin-top: 20rpx;
}
uni-button:after{
	content: none;
}
.umar-a{
	margin: 0 15rpx;
}
.cart-cust-btn .am-btn{
	padding:15rpx 0;
}
.cart-mag{
	position: absolute;
	top:-70rpx;
	right:25rpx;
	z-index: 999;
}
</style>
