<template>
	<view class="order-container f28">
		<!-- 取消订单弹层内容开始 -->
		<view class="order-dialog" v-show="isCancel">
			<view class="order-cancel">
				<view class="order-cancel-main">
					<view class="order-cancel-title">取消原因</view>
					<radio-group class="order-cancel-list" @change="radioChange">
						<view class="order-radio-cont" v-for="(item, index) in cancelCk" :key="item.value">
							<view class="order-radio">
								<radio :value="item.value" :checked="index === current" />
							</view>
							<view class="order-radio-name">{{item.name}}</view>
						</view>
					</radio-group>
					<view class="order-cancel-detail">
						<text class="order-cancel-txt">描述</text>
						<textarea class="order-cancel-area" value="" v-model="cancelDetail" placeholder="请提出你的建议,我们会多多改进" />
					</view>
				</view>
				<view class="order-cancel-btn">
					<button class="order-cancel-btn01" type="default" @click="isCancel=!isCancel">取消</button>
					<button class="order-cancel-btn02"  type="primary" @click="toCancel()">确定</button>
				</view>
			</view>
		</view>
		<!-- 取消订单弹层内容结束 -->
		
		<!-- tabItem -->
		<view class="am-fixedBar" ref="tabitem">
			<uni-segmented-control :current="tabIndex" :values="tabItems" :badge="badge" @clickItem="onClickTab" style-type="text" active-color="#3079F3"></uni-segmented-control>
		</view>
		<!-- 主要内容开始 -->
		<view :style="{marginTop:`${marginTop}px`}">
			<view class="order-list-item ub-box-shadow" v-for="(items,index) in orderList">
				<view class="list-item ub ub-ac am-bg-active am-text-white order-uinn">
					<view class="ub ub-f1">订单号：{{items.s_code}}</view>
					<view class="ub">{{items.s_state}}</view>
				</view>
				<view class="order-uinn">
					<view style="margin-top: 8rpx;">
						<view class="detail-table">
							<view class="detail-tr no-ubb">
								<view class="detail-td">商品名称</view>
								<view class="detail-td number">数量</view>
								<view class="detail-td">单价</view>
								<!-- <view class="detail-td codenum">发动机号</view> -->
								<view class="detail-td">规格</view>
								<view class="detail-td">小计</view>
							</view>
							<view class="detail-tr ub-ac" v-for="list in items.item">
								<view class="detail-td">{{list.title}}</view>
								<view class="detail-td number">{{list.i_qty}}/件</view>
								<view class="detail-td price" v-if="userInfo.c_type == 1">{{parseInt(list.currentprice)}}/{{list.unit}}</view>
								<view class="detail-td price" v-else-if="userInfo.c_type == 3 && userInfo.c_isview == 0">协议价</view>
								<view class="detail-td price" v-else-if="userInfo.c_type == 3 && userInfo.c_isview == 1">{{parseInt(list.a_price)}}</view>
								<!-- <view class="detail-td codenum" v-if="list.code !=''&&list.code !=null">
									<view class="td-br" v-for="codList in list.code.split(',')">
										{{codList}}
									</view>
								</view>
								<view class="detail-td codenum" v-else></view> -->
								<view class="detail-td" v-if="!$check.isEmpty(list.uqdescription)">{{list.uqdescription}}</view>
								<view class="detail-td">{{list.unitquantity*list.i_qty*parseInt(list.currentprice)}}</view>
							</view> 
							<view class="detail-tr">
								<view class="detail-td" style="width: 50%;">合计：<text class="am-blod">{{items.s_qty}}</text></view>
								<view class="detail-td" style="width: 50%;">总金额：<text class="am-blod">{{items.priceTotal}}</text></view>
							</view>
						</view>
					</view>
					<view class="ub am-btn-panel ub-ac">备注：{{items.s_note}}</view>
					<!-- <view class="com-tip" style="text-align: right;" v-if="tabIndex == 1">点击“确认收货”可获积分奖励</view> -->
					<view class="ub am-btn-panel ub-ac">
						<view class="ub ub-f1 am-text-99">下单时间：{{items.s_create_time}}</view>
						<view class="ub ub-pe">
							<!-- <button class="f24 am-btn-primary" @click="receiptOk(items,index)" v-if="tabIndex == 1">确认收货</button> -->
							<!-- <button class="f24" @click="orderCancle(item)" v-if="tabIndex == 0">取消订单</button> -->
						</view>
					</view>
					<!-- <view class="am-text-primary am-text-right umar-t f24" v-if="tabIndex == 1">确认收货后可获得积分奖励</view> -->
				</view>
			</view>
			<!-- 上拉加载 start -->
			<uni-load-more :status="status"></uni-load-more>
			<!-- 上拉加载 end -->
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components:{
			uniSegmentedControl,
			uniLoadMore
		},
		data() {
			return {
				userInfo:{},//用户信息
				orderList:[],//订单列表
				state : [0,1,2,-1],//全部/待接单/已发货/已收货/已取消
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more',
				cancelCk: [{
						value: '0',
						name: '收货地址/商品信息错误',
						checked: 'true'
					},
					{
						value: '2',
						name: '重复下单/误下单'
					},
					{
						value: '1',
						name: '不想买了',
					},
					{
						value: '3',
						name: '其他原因'
					},
				],
				current: 0,//取消订单选项
				cancelDetail:'',//取消详情
				isCancel:false,//取消订单弹层
				s_code:'',
				s_id:'',
				tabItems: ['待发货','已发货','已收货','已取消'],
				tabIndex: 0,
				badge:[0,0,0,0],
				marginTop: '',
				timer:null,
				s_type_no: 0
			}
		},
		onLoad(options) {
			//读取存储数据
			//console.log(parseInt(options.id));
			let this_ = this;
			this_.tabIndex = parseInt(options.id) == -1 ? 3 : parseInt(options.id);
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					this_.s_type_no = this_.userInfo.c_type == 3 ? 1 : 0;
					//获取订单列表
					this_.getOrderList();
					
					this_.orderQty();//获取数字
					//每隔5秒刷新
					this_.timer = setInterval(function() {
						this_.orderQty();//获取数字
					}, 5000);
					
			    }
			});
		},
		onUnload(){
			let this_ = this;
			if(this_.timer){
				clearInterval(this_.timer);  
				this_.timer = null; 
			}
		},
		mounted() {
			this.marginTop = this.$refs.tabitem.$el.getBoundingClientRect().height;
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
				console.log(e);
				let this_ = this;
				if (this_.tabIndex !== e.currentIndex) {
					this_.p = 1;
					this_.tabIndex = e.currentIndex;
					this_.getOrderList();
				}
			},
			radioChange: function(evt) {
				let this_ = this;
				for (let i = 0; i < this_.cancelCk.length; i++) {
					if (this_.cancelCk[i].value === evt.target.value) {
						this_.current = i;
						break;
					}
				}
			},
			//获取订单列表
			getOrderList(){
				uni.showLoading();
				let this_ = this;
				this_.$http.httpTokenRequest({
					//url:this_.$api.CustOrderList+'?c_id=' + this_.userInfo.c_id + '&c_ma001=' +'&state='+this_.state[this_.tabIndex]+'&nickname=&m_id=' + this_.userInfo.c_m_id +'&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					url:this_.$api.CustOrderList+'?c_id=' + this_.userInfo.c_id + '&c_ma001=' +'&state='+this_.state[this_.tabIndex]+'&nickname=&tel=&code=&m_id=&pageindex='+this_.p+'&pagesize='+this_.pageSize+'&s_type_no='+this_.s_type_no,
					method:'GET'
				}).then(res => {
					//请求成功
					uni.hideLoading();
					console.log(res.data);
					res.data.rows.forEach((list, index) => {
						this_.$set(list, 'isShow', false);
						this_.$set(list, 'priceTotal', 0);
						let item = list.item;
						for(let m = 0; m < item.length; m++){
							if(this_.userInfo.c_type == 3 && this_.userInfo.c_isview == 0){
								list.priceTotal += item[m].i_qty * 0;
							}else if(this_.userInfo.c_type == 3 && this_.userInfo.c_isview == 1){
								list.priceTotal += item[m].i_qty * item[m].a_price * item[m].unitquantity;
							}else{
								list.priceTotal += item[m].i_qty * item[m].currentprice * item[m].unitquantity;
							}
						}
					});
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
			//获取修理厂列表头部红点数量
			orderQty(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.CustNewOrderQty+'?c_ma001=&m_id=&c_id='+ this_.userInfo.c_id+'&s_type_no='+this_.s_type_no,
					method:'GET',
					data:{},
				}).then(res => {
					console.log(res.data);
					for(let i=0;i<res.data.length;i++){
						if(res.data[i].s_state_no == 0){
							this_.badge[0] = res.data[i].qty;
						}else if(res.data[i].s_state_no == 1){
							this_.badge[1] = res.data[i].qty;
						}else if(res.data[i].s_state_no == 2){
							this_.badge[2] = res.data[i].qty;
						}else if(res.data[i].s_state_no == -1){
							this_.badge[3] = res.data[i].qty;
						}
					}
					this_.$set(this_.badge,true);
					
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
			//确认收货
			receiptOk(item,index){
				let this_ = this;
				uni.showModal({
					title: '温馨提示',
					content: '是否确认收货？',
					success: function (res) {
						if (res.confirm) {
							uni.showLoading();
							this_.$http.httpTokenRequest({
								url: this_.$api.CustEndOrder,
								method: 'POST',
								data: {c_id:this_.userInfo.c_id,c_nickname:this_.userInfo.c_nickname,s_id:item.s_id,s_code:item.s_code},
							}).then(res => {
								//请求成功
								uni.hideLoading();
								if(res.data.State){
									this_.orderQty();
									uni.showToast({
										title:'已确认发货,去个人中心评价可获取100积分奖励～',
										duration:3000
									});
									this_.orderList.splice(index,1);
									setTimeout(function(){
										uni.navigateTo({
											url:'../evalList/evalList?id=0'
										})
									},3000)
								}
								// uni.showToast({
								// 	icon : 'none',
								// 	title : res.data.Message,
								// 	duration:1500
								// });
							}, error => {
								console.log(error);
							});
						} else if (res.cancel) {
							//console.log('用户点击取消');
						}
					}
				});
				
			},
			//取消订单
			// orderCancle(item){
			// 	let this_ = this;
			// 	this_.isCancel = true;
			// 	this_.s_id = item.s_id;
			// 	this_.s_code = item.s_code;
			// },
			
			//提交取消原因
			// toCancel(){
			// 	let this_ = this;
			// 	let cancelCont = this_.cancelCk[this_.current] + this_.cancelDetail;
			// 	uni.showLoading();
			// 	this_.$http.httpTokenRequest({
			// 		url: this_.$api.CustCancelOrder,
			// 		method: 'POST',
			// 		data:{c_id:this_.userInfo.c_id,c_nickname:this_.userInfo.c_nickname,s_id:this_.s_id,s_code:this_.s_code,s_cancel:cancelCont},
			// 	}).then(res => {
			// 		//请求成功
			// 		uni.hideLoading();
			// 		alert(res.data.Message);
			// 		if(res.data.State){
			// 			this_.isCancel = false;
			// 		}
			// 	}, error => {
			// 		console.log(error);
			// 	});
			// },
			
		}
	}
</script>
<style>
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
		width: 25%;
		font-size: 24rpx;
	}
	.number{
		width: 12%;
	}
	.price{
		width: 22%;
	}
	.codenum{
		width: 41%;
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
	.umar-t{
		margin-top: 10rpx;
	}
</style>
