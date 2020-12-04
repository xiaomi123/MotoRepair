<template>
	<view class="myorder-container f28">
		<!-- 产品明细弹层内容开始 -->
		<uni-popup ref="popup" type="center" class="myorder-popcont">
			<view class="myorder-title02">产品详情<text class="iconfont" @click="closePopup">&#xe60f;</text></view>
			<view class="myorder-potitle">订单号：{{detailList.erpCode}}</view>
			<view class="order-list-item ub-box-shadow" v-for="list in detailList.item" :key="list.s_code">
				<view  class="list-item ub ub-ac am-text-white order-uinn myOrder-uinn">
					<view style="margin-right:10rpx;">销货单：{{list.s_code}}</view>
					<view>发货仓库：{{list.storage}}</view>
				</view>
				<view class="order-uinn">
					<uni-segmented-control :current="list.tabIndex" :values="tabItems01" @clickItem="onClickTab02($event,list)" style-type="text" active-color="#3079F3"></uni-segmented-control>
				</view>
				<view class="order-uinn" v-if="list.tabIndex == 0">
					<view v-if="list.logisList.length>0">
						<uni-steps :options="list.logisList" direction="column" :active="list.logisList.length"></uni-steps>
					</view>
					<view class="com-nodata" style="padding:0 0 20rpx;" v-else>暂无数据</view>
				</view>
				<view class="order-uinn" v-if="list.tabIndex == 1">
					<view class="detail-table" v-if="list.proList.length>0">
						<view class="detail-tr no-ubb">
							<view class="detail-td" style="width:20%">产品编号</view>
							<view class="detail-td" style="width:50%">名称</view>
							<view class="detail-td" style="width:10%">数量</view>
							<view class="detail-td" style="width:20%">单位</view>
						</view>
						<view class="detail-tr ub-ac" v-for="item in list.proList">
							<view class="detail-td" style="width:25%">{{item.oem}}</view>
							<view class="detail-td" style="width:50%">{{item.std}}</view>
							<view class="detail-td" style="width:10%">{{parseInt(item.num)}}</view>
							<view class="detail-td" style="width:20%">{{item.unit}}</view>
						</view> 
						<view class="detail-tr">
							<view class="detail-td" style="width: 100%;">总数量：<text class="am-blod">{{list.proTotal}}</text></view>
						</view>
					</view>
					<view class="com-nodata" style="padding:0 0 20rpx;" v-else>暂无数据</view>
				</view>
			</view>
		</uni-popup>
		<!-- 产品明细弹层内容结束 -->
		
		<!-- header中tab切换内容开始 -->
		<view class="am-fixedBar" ref="tabitem">
			<uni-segmented-control :current="tabIndex" :values="tabItems" :badge="badge" @clickItem="onClickTab" style-type="text" active-color="#3079F3"></uni-segmented-control>
		</view>
		<!-- header中tab切换内容结束 -->
		
		<!-- 主要内容开始 -->
		<view :style="{marginTop:`${marginTop}px`}">
			<view class="order-list-item ub-box-shadow" v-for="(items,index) in orderList">
				<view class="list-item ub ub-ac am-bg-active am-text-white order-uinn">
					<!-- <view class="ub ub-f1">发货仓库：{{items.o_storage}}</view> -->
					<view class="ub ub-f1">订单号：{{items.o_code}}</view>
					<view class="ub">{{items.o_state}}</view>
				</view>
				<view class="order-uinn">
					<!-- <view class="list-item umar-b"><text class="am-text-99">订单号：</text>{{items.o_code}}</view> -->
					<view class="list-item umar-b"><text class="am-text-99">备注：</text>{{items.o_note}}</view>
					<view style="margin-top: 8rpx;">
						<view class="detail-table" v-if="items.item.length>0">
							<view class="detail-tr no-ubb">
								<view class="detail-td">商品名称</view>
								<view class="detail-td number">数量</view>
								<view class="detail-td price">单价</view>
								<view class="detail-td">规格</view>
								<view class="detail-td">小计</view>
							</view>
							<view class="detail-tr ub-ac" v-for="list in items.item.slice(0, 5)" v-if="!items.isMore">
								<view class="detail-td">{{list.title}}</view>
								<view class="detail-td number">{{list.i_qty}}</view>
								<view class="detail-td price">{{parseInt(list.i_price)}}</view>
								<view class="detail-td">{{list.uqdescription}}</view>
								<view class="detail-td">{{$check.isEmpty(list.unitquantity) ? ist.i_qty*list.i_price : list.unitquantity*list.i_qty*list.i_price}}</view>
							</view> 
							<view class="detail-tr ub-ac" v-for="list in items.item" v-if="items.isMore">
								<view class="detail-td">{{list.title}}</view>
								<view class="detail-td number">{{list.i_qty}}</view>
								<view class="detail-td price">{{parseInt(list.i_price)}}</view>
								<view class="detail-td">{{list.uqdescription}}</view>
								<view class="detail-td">{{$check.isEmpty(list.unitquantity) ? ist.i_qty*list.i_price : list.unitquantity*list.i_qty*list.i_price}}</view>
							</view> 
							<view class="detail-tr" v-if="items.isMore">
								<view class="detail-td" style="width: 50%;">合计：<text class="am-blod">{{items.o_qty}}</text></view>
								<view class="detail-td" style="width: 50%;">总价：<text class="am-blod">{{items.priceTotal}}</text></view>
							</view>
							<view class="order_more" @click="toMore(items,index)" v-if="!items.isMore">查看全部<text class="iconfont">&#xe620;</text></view>
						</view>
					</view>
					<view class="ub am-btn-panel ub-ac">
						<view class="ub umar-r am-text-99">下单时间：{{items.o_create_time}}</view>
					</view>
					<view class="ub am-btn-panel ub-ac myorder-new">
						<view class="ub ub-f1 ub-pe">
							<!-- <view class="com-tip" style="width:58%" v-if="items.o_state != '已收货'&&items.o_state != '待接单'">点击"确认收货"可获积分奖励</view> -->
							<view class="ub umar-r" v-if="items.o_state != '待接单'">
								<button class="f24 am-btn-warning" @click="orderDetail(items)">查看详情</button>
							</view>
							<view class="ub" v-if="items.o_state != '已收货'&&items.o_state != '待接单'">
								<button class="f24 am-btn-primary" @click="orderOk(items,index)">确认收货</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 主要内容结束 -->
		
		<!-- 上拉加载 start -->
		<uni-load-more :status="status"></uni-load-more>
		<!-- 上拉加载 end -->
	</view>
</template>

<script>
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	export default {
		components:{
			uniSegmentedControl,
			uniLoadMore,
			uniPopup,
			uniSteps
		},
		data() {
			return {
				userInfo:{},//用户信息
				orderList:[],
				tabItems: ['待接单','已接单','配货中','已发货','已收货'],
				badge:[0,0,0,0,0],
				state:['0','1','2','3','4'],//切换传值
				tabIndex: 0,
				marginTop: '',
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
				detailList:{
					o_id:'',
					erpCode:'',
					item:[],
				},//订单详情
				tabIndex01:0,
				tabItems01: ['发货明细','产品明细'],
				timer:null,
			}
		},
		onLoad() {
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					this_.getOrderList();
					this_.orderQty();//获取数字
					//每隔5秒刷新
					this_.timer = setInterval(function() {
						this_.orderQty();//获取数字
					}, 5000);
					
			    }
			});
		},
		mounted() {
			this.marginTop = this.$refs.tabitem.$el.getBoundingClientRect().height;
		},
		onUnload(){
			let this_ = this;
			if(this_.timer){
				clearInterval(this_.timer);  
				this_.timer = null; 
			}
		},
		//上拉加载
		onReachBottom (){
			if(this.p < this.pageCount){
				this.p++;
				this.status = 'loading';
				this.getOrderList();
			}else{
				this.status = 'noMore';
			}
		},
		methods: {
			//tab切换
			onClickTab(e){
				let this_ = this;
				if (this_.tabIndex !== e.currentIndex) {
					this_.p = 1;
					this_.tabIndex = e.currentIndex;
					this_.getOrderList();
				}
			},
			
			//详情弹层tab切换
			onClickTab02(e,list){
				let this_ = this;
				if (list.tabIndex !== e.currentIndex) {
					list.tabIndex = e.currentIndex;
				}
			},
			
			//获取订单列表
			getOrderList(){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.OrderList+'?sdt=&edt=&c_ma001='+ this_.userInfo.c_ma001 +'&c_ma002=&state=' + this_.state[this_.tabIndex] +'&pageindex='+ this_.p +'&pagesize=' + this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					console.log(res);
					uni.hideLoading();
					for(let i = 0; i < res.data.rows.length; i++){
						this_.$set(res.data.rows[i],'priceTotal',0);
						if(res.data.rows[i].item.length>5){
							this_.$set(res.data.rows[i],'isMore',false);
						}else{
							this_.$set(res.data.rows[i],'isMore',true);
						}
						let item = res.data.rows[i].item;
						for(let m = 0; m < item.length; m++){
							if(this_.$check.isEmpty(item[m].unitquantity)){
								res.data.rows[i].priceTotal += item[m].i_qty * item[m].i_price;
							}else{
								res.data.rows[i].priceTotal += item[m].i_qty * item[m].unitquantity * item[m].i_price;
							}
							
						}
					}
					//请求成功
					if(this_.p > 1){
						this_.orderList = this_.orderList.concat(res.data.rows);
					}else{
						this_.orderList = res.data.rows;
					}
					if(0 <= res.data.total < this_.pageSize){
						this_.status = 'noMore';
					}else{
						this_.status = 'more';
					}
					this_.papeTotal(res.data.total);
				},error => {
					console.log(error);
				});
			},
			
			//获取代理商进单列表头部红点数量
			orderQty(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.OrderNew+'?c_ma001='+ this_.userInfo.c_ma001 +'&m_id=0',
					method:'GET',
					data:{},
				}).then(res => {
					for(let i=0;i<res.data.length;i++){
						if(res.data[i].o_state_no == 0){
							this_.badge[0] = res.data[i].qty;
						}else if(res.data[i].o_state_no == 1){
							this_.badge[1] = res.data[i].qty;
						}else if(res.data[i].o_state_no == 2){
							this_.badge[2] = res.data[i].qty;
						}else if(res.data[i].o_state_no == 3){
							this_.badge[3] = res.data[i].qty;
						}else if(res.data[i].o_state_no == 4){
							this_.badge[4] = res.data[i].qty;
						}
					}
					this_.$set(this_.badge,true);
					
				},error => {
					console.log(error);
				});
			},
			
			//查看全部
			toMore(item,index){
				let this_ = this;
				item.isMore = true;
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
			//订单详情
			orderDetail(list){
				let this_ = this;
				this_.detailList.erpCode = list.o_code;
				this_.detailList.o_id = list.o_id;
				this_.detailList.item = [];
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.OrderArrival+'?erpno='+ list.o_erpno,
					method:'GET',
					data:{},
				}).then(res => {
					uni.hideLoading();
					if(res.data.length>0){
						for(let i = 0; i < res.data.length; i++){
							if(!this_.$check.isEmpty(res.data[i].column1)){
								let itemPar = {
									's_code':res.data[i].column1,
									'storage':'',
									'detTab':0,
									'proList':[],
									logisList:[],
									proTotal:0,
									tabIndex:0,
								};
								//获取仓库
								this_.$http.httpTokenRequest({
									url:this_.$api.Store+'?billsort='+ res.data[i].column1.split("-")[0] +'&billno=' + res.data[i].column1.split("-")[1] + '&ma001=' + this_.userInfo.c_ma001,
									method:'GET',
									data:{},
								}).then(res02 => {
									uni.hideLoading();
									if(res02.data.length>0){
										if(!this_.$check.isEmpty(res02.data[0].storage)){
											itemPar.storage = res02.data[0].storage;
										}
									}
								},error => {
									console.log(error);
								});
								//获取发货明细
								this_.$http.httpTokenRequest({
									url:this_.$api.OrderTimeLine+'?o_id='+ this_.detailList.o_id +'&copno=' + res.data[i].column1,
									method:'GET',
									data:{},
								}).then(res04 => {
									uni.hideLoading();
									itemPar.logisList = [];
									if(res.data.length>0){
										for(let z=0;z<res04.data.length;z++){
											itemPar.logisList.push({'title':res04.data[z].f_state_text,'contet':res04.data[z].f_message,'desc':res04.data[z].f_create_time});
											
										}
									}
								},error => {
									console.log(error);
								});
								//获取产品明细
								this_.$http.httpTokenRequest({
									url:this_.$api.OrderTimeLine+'?copno=' + res.data[i].column1,
									method:'GET',
									data:{},
								}).then(res03 => {
									uni.hideLoading();
									for(let j=0;j<res03.data.length;j++){
										itemPar.proTotal = itemPar.proTotal + res03.data[j].num;
									}
									itemPar.proList = res03.data;
									
								},error => {
									console.log(error);
								});
								
								this_.detailList.item.push(itemPar);
							}
						}
					}
					
				},error => {
					console.log(error);
				});
				this_.$refs.popup.open();
			},
			//关闭订单详情
			closePopup(){
				this.$refs.popup.close()
			},
			//订单明细
			proDetail(item){
				let this_ = this;
				//产品明细
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.OrderTimeLine+'?copno=' + item.s_code,
					method:'GET',
					data:{},
				}).then(res => {
					uni.hideLoading();
					for(let i=0;i<res.data.length;i++){
						this_.proTotal = this_.proTotal + res.data[i].num;
					}
					this_.proList = res.data;
					this_.$refs.popupDet.open();
					
				},error => {
					console.log(error);
				});
				
			},
			
			//发货详情
			logistDetail(list){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.OrderTimeLine+'?o_id='+ this_.detailList.o_id +'&copno=' + list.s_code,
					method:'GET',
					data:{},
				}).then(res => {
					uni.hideLoading();
					this_.logistics = [];
					if(res.data.length>0){
						for(let i=0;i<res.data.length;i++){
							this_.logistics.push({'title':res.data[i].f_state_text,'desc':res.data[i].f_create_time});
						}
					}
					this_.$refs.popuplog.open();
				},error => {
					console.log(error);
				});
			},
			
			
			//确认收货
			orderOk(list,index){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url:this_.$api.OrderArrival,
					method:'POST',
					data:{c_nickname:list.o_c_nickname,c_ma001:list.o_c_ma001,o_id:list.o_id},
				}).then(res => {
					uni.hideLoading();
					if(res.data.State){
						uni.showToast({
							//title:'已确认发货,去个人中心评价可获取100积分奖励～',
							title:'操作成功',
							duration:1500
						});
						this_.orderList.splice(index,1);
					}else{
						uni.showToast({
							title:'操作失败～',
							duration:1500
						});
					}
				},error => {
					console.log(error);
				});
			},
		}
	}
</script>

<style>
	.myorder-new uni-button{
		padding-left:8px;
		padding-right:8px;
	}
	.umar-r{margin-right: 20rpx;}
	.detail-tr:first-child,.detail-tr:last-child{
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
	.number{
		width: 12%;
	}
	.price{
		width: 22%;
	}
	.td-br{
		word-break: break-all;
	}
	.icon-del{
		width: 35rpx;
		height: 35rpx;
	}
	.umar-rs{
		margin-right: 8rpx;
	}
	.order_more{
		padding:4rpx;
		text-align: center;
	}
	.order_more text.iconfont{
		display: inline-block;
		margin-left: 10rpx;
		font-size: 28rpx;
	}
	.myOrder-uinn{
		background-color: #6290dc;
		border-top-right-radius: 16rpx;
		border-top-left-radius: 16rpx;
	}
</style>
