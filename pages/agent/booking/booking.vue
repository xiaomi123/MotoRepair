<template>
	<view class="tobuy-container">
		<!--备注弹层-->
		<view class="login-dialog" v-if="isShow">
			<view class="login-dialog-cont">
				<view class="login-title">备注信息</view>
				<view class="login-list">
					<textarea class="f32" v-model="note" placeholder="请填写您的备注信息" placeholder-style="color:#999" style="height: 80px;" />
				</view>
				<!-- 订单预览 -->
				<scroll-view scroll-y="true" class="scroll-Y" show-scrollbar="true">
					<view>
						<view v-for="cangku in priview" style="margin-bottom: 20rpx;">
							<!-- <text class="stock-name" :style="{backgroundColor : cangku.name == '预定提醒' ? '#ff7f50' : '#6dacf0'}">所属仓库：{{cangku.name}}</text> -->
							<text class="stock-name" v-if="cangku.name == '预定提醒'" style="background-color: #ff7f50;">缺货产生的预订单</text>
							<text class="stock-name" v-else style="background-color: #6dacf0;">{{cangku.name}}进货单</text>
							<view class="detail-table">
								<view class="detail-tr no-ubb">
									<view class="detail-td" style="width:25%">产品编号</view>
									<view class="detail-td" style="width:40%">名称</view>
									<view class="detail-td" style="width:15%">数量</view>
									<view class="detail-td" style="width:20%">单价</view>
								</view>
								<view class="detail-tr ub-ac" v-for="data in cangku.list">
									<view class="detail-td" style="width:25%">{{data.erpcode}}</view>
									<view class="detail-td" style="width:40%">{{data.name}}</view>
									<view class="detail-td" style="width:15%">{{data.qty}}</view>
									<view class="detail-td" style="width:20%">{{data.price}}</view>
								</view> 
								<view class="detail-tr" style="background-color: #EEEEEE;">
									<view class="detail-td" style="width: 50%;">合计：<text class="am-blod">{{cangku.nums}}</text></view>
									<view class="detail-td" style="width: 50%;">总金额：<text class="am-blod">{{cangku.money}}</text></view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<!-- 订单预览 -->
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
						<input class="index-search-txt" confirm-type="search" v-model="keyTxt" placeholder="请输入"  @confirm="toSearch"  />
						<button class="index-search-btn s-btn" @click="toSearch()">搜索</button>
					</view>
				</view>
			</view>
			<!-- 搜索内容结束 -->
			
			<view class="custpro-list" v-for="(item,index) in proList">
				<view class="goods-info" @click="toDetail(item)">
					<image :src="$http.imgUrl + item.titlepicurl" mode="widthFix" class="custpro-img"></image>
					<view class="custpro-fr">
						<view class="">
							<text class="custpro-title">{{item.title}}</text>
							<view>
								<!-- 售价:<text class="am-text-danger">￥</text><text class="index-price">{{item.currentprice}}</text>进价:{{item.inprice}} -->
								进价:<text class="am-text-danger">￥</text><text class="index-price">{{item.inprice}}</text>
								<view v-if="!$check.isEmpty(item.suitable)">品牌:{{item.suitable}}</view>
								<view v-if="!$check.isEmpty(item.uqdescription)">规格:{{item.uqdescription}}</view>
							</view>
							<!-- <view>我的库存:{{item.storemin}}</view> -->
						</view>
					</view>
				</view>
				<view class="stock-info">
					<view class="stock-item">
						<view class="custpro-cont" v-for="(stock, index) in item.stockList" :key="index">
							<!-- <view class="custpro-item">{{stock.name}}:{{stock.storage}}</view> -->
							<view class="custpro-item">厂家库存:{{stock.storage}}</view>
							<view class="custpro-cart" v-if="stock.storage > 0">
								<uni-number-box :min="0" :max="stock.storage" :value="stock.boot_qty >= stock.storage ? stock.storage : stock.boot_qty" :disabled="isDisabled" @change="changeCart($event,index,item.stockList)" :height="24" :width="90"></uni-number-box>
							</view>
							<view class="custpro-cart" v-else>
								<block v-if="stock.isCancel">
									<uni-number-box :min="0" :value="stock.boot_qty" :height="24" :width="90"></uni-number-box>
									<view class="booking-btn"><button type="warn" size="mini" @click="remindCancel(stock)">取消预订</button></view>
								</block>
								<block v-else>
									<uni-number-box :min="0" :value="stock.boot_qty" :disabled="true" :height="24" :width="90"></uni-number-box>
									<view class="booking-btn"><button type="warn" size="mini" style="background-color: #CCCCCC;">已取消</button></view>
								</block>
							</view>
						</view>
					</view>
					
				</view>
			</view>
		</view>
		<view class="cart-bottom custpro-bottom" style="bottom: 0;">
			<view class="cart-bottom-cont"> 
				<view class="cart-bot-left">
					<view>总价格：<text class="cart-price">￥{{totalPrice}}</text></view>
					<view>总数量：<text class="cart-price">{{totalNum}}</text></view>
				</view>
				<button type="default" @click="toSumit()" class="cart-bot-right">提交订单</button>
			</view>
		</view>
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
				custInfo:{},
				enter:'',//判断是推荐还是下单
				note:'',//代下单备注
				isShow:false,//代下单弹层
				totalPrice:0,//总价格
				totalNum:0,//总数量
				keyTxt:'',//关键字
				cartItem:[],//选择商品
				priview : [],//订单预览
				isDisabled : false
			}
		},
		onLoad() {
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
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
					url:this_.$api.Remind+'?c_id=' + this_.userInfo.c_id,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					console.log(res);
					uni.hideLoading();
					this_.proList = res.data.rows;
					for(let i=0;i<res.data.rows.length;i++){
						this_.$set(this_.proList[i], 'inprice', 0);
						this_.$set(this_.proList[i], 'zstorage', 0);
						this_.$set(this_.proList[i], 'stockList', []);
						this_.$set(this_.proList[i], 'companyName', '');
						this_.$set(this_.proList[i], 'storemin', 0);
					}
					this_.getInPrice();//进价
					//this_.getStoreQty();//库存
					this_.getStoreMinQty();//自己库存
				},error => {
					console.log(error);
				});
			},
			
			//进详情
			toDetail(item){
				let this_ = this;
				uni.navigateTo({
				 	url: '../detail/detail?code='+item.erpcode + '&type=tobuy'
				}); 
			},
			
			//获取进货价
			getInPrice(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.InPrice+'?c_ma001=' + this_.userInfo.c_ma001 + '&code=',
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					for(let i=0;i<res.data.length;i++){
						for(let j=0;j<this_.proList.length;j++){
							if(res.data[i].mb001 == this_.proList[j].erpcode){
								this_.proList[j].inprice = res.data[i].price.toFixed(2);
							}
						}
					}
					this_.getStoreQty();//库存
				},error => {
					console.log(error);
				});
			},
			
			//获取库存
			getStoreQty(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.StoreQty+'?c_id= ' + this_.userInfo.c_id + '&storage=' + this_.userInfo.storage + '&code=',
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					console.log("获取库存");
					console.log(res.data);
					for(let z=0;z<this_.proList.length;z++){
						for(let m=0;m<res.data.length;m++){
							if(res.data[m].mc001 == this_.proList[z].erpcode){
								if(res.data[m].mc007 == 0){
									var storageName = "预定提醒";
								}else{
									var storageName = res.data[m].storage;
								}
								//判断对应库存所预定得数量
								if(this_.proList[z].item.length<2){
									if(this_.proList[z].item[0].r_mc002.indexOf(res.data[m].mc002) > -1){
										var boot_qty = this_.proList[z].item[0].r_qty;
									}
								}else{
									for(let a = 0; a < this_.proList[z].item.length; a++){
										if(this_.proList[z].item[a].r_mc002 == res.data[m].mc002){
											var boot_qty = this_.proList[z].item[a].r_qty;
										}
									}
								}
								
								let obj = {
									'name' : res.data[m].storage,
									'bname' : storageName,
									'storage' : res.data[m].mc007,
									'mc002' : res.data[m].mc002,
									'mb001' : this_.proList[z].erpcode,
									'boot_qty' : boot_qty,
									'isCancel' : true
								};
								this_.proList[z].stockList.push(obj);
								this_.proList[z].zstorage = this_.proList[z].zstorage + res.data[m].mc007;
							}
						}
					}
					console.log('-------------------获取产品列表------------------------');
					console.log(this_.proList);
				},error => {
					console.log(error);
				});
			},
			//获取自己库存
			getStoreMinQty(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.CustStorage+'?ma002=' + this_.userInfo.c_ma002 + '&level=' + this_.userInfo.c_level + '&m_id=' + this_.userInfo.c_m_id,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					for(let l=0;l<this_.proList.length;l++){
						for(let k=0;k<res.data.length;k++){
							if(res.data[k].erpcode == this_.proList[l].erpcode){
								this_.proList[l].storemin = this_.proList[l].storemin + res.data[k].qty;
							}
						}
					}
					
				},error => {
					console.log(error);
				});
			},
			
			//加减购物车
			changeCart(e,index,list){
				let this_ = this;
				this_.$set(list[index],'s_qty',e);
				this_.totalNum = 0;
				this_.totalPrice = 0;
				console.log(this_.proList);
				for(let i=0;i<this_.proList.length;i++){
					for(let m = 0; m < this_.proList[i].stockList.length; m++){
						if(!this_.$check.isEmpty(this_.proList[i].stockList[m].s_qty)){
							if(this_.proList[i].stockList[m].storage > 0){
								this_.totalNum = parseInt(this_.totalNum) + parseInt(this_.proList[i].stockList[m].s_qty);
								console.log("总数量："+this_.proList[i].inprice);
								this_.totalPrice = this_.totalPrice + (this_.proList[i].stockList[m].s_qty*this_.proList[i].inprice);
							}
						}
					}
				}
			},
			//提交订单
			toSumit(){
				let this_ = this;
				this_.cartItem = [];
				let oldData = [];
				console.log(this_.proList);
				for(let i=0;i<this_.proList.length;i++){
					for(let m = 0; m < this_.proList[i].stockList.length; m++){
						if(!this_.$check.isEmpty(this_.proList[i].stockList[m].s_qty)){
							if(this_.proList[i].stockList[m].s_qty != 0){
								if(this_.proList[i].stockList[m].storage > 0){
									this_.cartItem.push({
										mc002:this_.proList[i].stockList[m].mc002,
										mb001:this_.proList[i].stockList[m].mb001,
										qty:this_.proList[i].stockList[m].s_qty, 
										price: this_.proList[i].inprice
									});
								}
								
								//预览的订单信息
								let a = {
									erpcode : this_.proList[i].erpcode,
									name : this_.proList[i].title,
									qty : this_.proList[i].stockList[m].s_qty,
									price : this_.proList[i].inprice,
									storageName : this_.proList[i].stockList[m].bname,
									storage : this_.proList[i].zstorage
								};
								oldData.push(a);
								
								// 把源数据先变成目标数据的规则
								let oldDataRule = []
								oldData.forEach(el => {
									let oldObj = {
										name: el.storageName,
										list:[]
									  }
									let listObj = {
										erpcode : el.erpcode,
										name : el.name,
										qty : el.qty,
										price : el.price,
										storage : el.storage
									}
									oldObj.list.push(listObj)
									oldDataRule.push(oldObj)
								})
								 
								/**
								 * 先去重，后合并
								 * 1、源数据去重
								 * 2、把去重后的数据和源数据中相同name的数据合并list
								*/
								var newData = []
								var newObj = {}
								oldDataRule.forEach((el, i) => {
								  if (!newObj[el.name]) {
								    newData.push(el);
								    newObj[el.name] = true;
								  } else {
								    newData.forEach(el => {
								      if (el.name === oldDataRule[i].name) {
								        el.list = el.list.concat(oldDataRule[i].list);
								      }
								    })
								  }
								}) 
								
								this_.priview = newData.sort(this_.compare);
								for(let k = 0; k < this_.priview.length; k++){
									this_.$set(this_.priview[k], 'nums', 0);
									this_.$set(this_.priview[k], 'money', 0);
									for(let j = 0; j < this_.priview[k].list.length; j++){
										this_.priview[k].nums = this_.priview[k].nums + parseInt(this_.priview[k].list[j].qty);
										this_.priview[k].money = this_.priview[k].money + this_.priview[k].list[j].qty * this_.priview[k].list[j].price;
									}
								}
							
							}
							
						}
					}
				}
				if(this_.cartItem.length>0){
					this_.isShow = true;
				}else{
					uni.showToast({
						icon:'none',
						title:'请选择产品',
						duration:1500
					});
				}
				
			},
			//数组排序
			compare(obj1,obj2){
				let val1 = obj1.name;
				let val2 = obj2.name;
				if (val1 < val2) {
					return -1;
				} else if (val1 > val2) {
					return 1;
				} else {
					return 0;
				}      
			},
			//”备注“弹层确认提交
			confirmSub(){
				let this_ = this;
				uni.showLoading();
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
						"storage": this_.userInfo.storage,
						"item":this_.cartItem,
						"m_id":this_.userInfo.c_m_id
					},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					if(res.data.State){
						uni.showToast({
							title: '订单提交成功！',
							duration:1500
						});
						setTimeout(function(){
							uni.navigateTo({
								url : '../myorder/myorder'
							})
						},1500);
					}
				},error => {
					console.log(error);
				});
				this_.isShow = false;
			},
			//查询
			toSearch(){
				let this_ = this;
				this_.getProduct();
			},
			//取消预定提醒
			remindCancel(item){
				console.log(item);
				let this_ = this;
				this_.$http.httpTokenRequest({
					url : this_.$api.Remind+'?c_id=' + this_.userInfo.c_id,
					method: 'POST',
					data : {
						mb001: item.mb001,
				        mc002 : item.mc002
					}
				}).then(res => {
					console.log(res);
					if(res.data.State){
						item.isCancel = false;
						uni.showToast({
							icon : 'success',
							title : '取消成功!',
							duration:1500
						})
						// setTimeout(() => {
						// 	this_.getProduct();
						// },1500)
					}
				},error => {
					console.log(error);
				})
			},
		},
		
	}
</script>
<style scoped>
.index-price{
	display: inline-block;
	margin-right:10rpx;
}
.tobuy-container{
	padding-bottom:200rpx;
}
.custpro-cart{
	width: auto;
	display: flex;
}
.custpro-cont{
	align-items: baseline;
}
.custpro-list,.stock-item{
	flex-direction: column;
}
.stock-item{
	flex: 1;
}
.goods-info,.stock-info{
	display: flex;
}
.stock-info{
	align-items: center;
}
.booking-btn{
	margin-left: 30rpx;
}
.booking-btn button{
	height: 24px;
	line-height: 24px;
	padding: 0 0.5em;
	font-size: 12px;
}
.custpro-item{
	font-size: 28rpx;
	width: auto;
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
	width: 44%;
	font-size: 24rpx;
}
.stock-name{
	display: block;
	padding: 10rpx 20rpx;
	background-color: #6dacf0;
	font-weight: 700;
}
.login-dialog-cont{
	top:10%;
	padding: 5% 2%;
}
.scroll-Y{
	max-height: 600rpx;
}
</style>
