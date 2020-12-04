<template>
	<view class="myorder_container f28">
		
		<button type="primary" class="conditionQuery" style="right: 200rpx;" @click="allShow">显示全部</button>
		<button type="primary" class="conditionQuery" @click="openDialogShow">条件搜索</button>
		<uni-popup ref="popup" type="bottom">
			<view class="uni-common-mt">
				<view class="uni-form-item uni-column">
					<view class="title">客户名称：</view>
					<input class="uni-input" v-model="search.nickname" placeholder="请输入客户名称" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">电话：</view>
					<input class="uni-input" v-model="search.tel" placeholder="请输入客户电话" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">发动机识别码：</view>
					<input class="uni-input" v-model="search.code" placeholder="请输入code" />
				</view>
				<view class="uni-form-item uni-column" style="text-align: center;">
					<button type="primary" class="search" @click="searchDo">查询</button>
				</view>
			</view>	
		</uni-popup>
		
		<!-- 手动录入发动机号 -->
		<view class="login-dialog" v-if="isShow">
			<view class="login-dialog-cont">
				<!-- <view class="login-title">为了准确为您和您的客户推送消息，请准确录入您的手机号</view> -->
				<view class="login-list">
					<text class="login-txt">发动机编码</text>
					<input class="uni-input login-input" v-model="engineCode"  placeholder="请录入发动机编码" />
				</view>
				<view class="ub">
					<button type="primary" class="login-dialog-btn" @click="cancelDo()" style="background-color: #CCCCCC;color:#000000">取消</button>
					<button type="primary" class="login-dialog-btn" @click="handleOutDo()">提交</button>
				</view>
			</view>
		</view>
		
		<!-- tabItem -->
		<view class="am-fixedBar" ref="tabitem" style="top: 43px;">
			<uni-segmented-control :current="tabIndex" :values="tabItems" :badge="badge" @clickItem="onClickTab" style-type="text" active-color="#3079F3"></uni-segmented-control>
		</view>
		<view :style="{marginTop:`${marginTop}px`}">
			<view class="order-list-item ub-box-shadow" v-for="(items,index) in orderList">
				<view class="list-item ub ub-ac am-bg-active am-text-white order-uinn">
					<view class="ub ub-f1">订单号：{{items.s_code}}</view>
					<view class="ub">{{items.s_state}}</view>
				</view>
				<view class="order-uinn">
					<view class="list-item umar-b"><text class="am-text-99">备注：</text>{{items.s_note}}</view>
					<view class="list-item umar-b"><text class="am-text-99">客户名称：</text>{{items.s_c_nickname}}</view>
					<view class="list-item umar-b" @click="tel(items.s_tel)">
						<text class="am-text-99">联系电话：</text>
						<a style="background-color: #0090CE; border-radius: 3rpx; padding: 0 5rpx; color: #F1F1F1;"><uni-icons type="phone" size="16" color="#FFFFFF"></uni-icons>{{items.s_tel}}</a>
					</view>
					<view class="list-item umar-b"><text class="am-text-99">收货地址：</text>{{items.s_address}}</view>
					<view style="margin-top: 8rpx;">
						<view class="detail-table">
							<view class="detail-tr no-ubb">
								<view class="detail-td">商品名称</view>
								<view class="detail-td number">数量</view>
								<view class="detail-td">单价</view>
								<view class="detail-td">规格</view>
								<!-- <view class="detail-td codenum">发动机号</view> -->
								<view class="detail-td codenum">小计</view>
							</view>
							<view class="detail-tr ub-ac" v-for="list in items.item">
								<view class="detail-td">{{list.title}}</view>
								<view class="detail-td number">{{list.i_qty}}<text v-if="parseInt(list.unitquantity)>0">件</text></view>
								<view class="detail-td price" v-if="items.s_type_no == 0">{{parseInt(list.currentprice)}}/{{list.unit}}</view>
								<!-- <view class="detail-td price" v-else-if="items.s_type_no == 1 && items.c_isview == 0">协议价</view> -->
								<view class="detail-td price" v-else-if="items.s_type_no == 1 && items.c_isview == 1">{{list.a_price}}</view>
								<view class="detail-td">{{list.uqdescription}}</view>
								<!-- <view class="detail-td codenum" v-if="list.code !=''&&list.code !=null">
									<view class="ub ub-ac" v-for="codList in list.code.split(',')" @click="delCode(list,codList,index)" :ref="index">
										<view class="ub umar-rs">{{codList}}</view>
										<image src="../../../static/images/del.png" class="ub icon-del" v-if="tabIndex == 0"></image>
									</view>
									
								</view>
								<view class="detail-td codenum" v-else></view> -->
								<view class="detail-td codenum">{{list.currentprice*list.i_qty*list.unitquantity}}</view>
							</view> 
							<view class="detail-tr">
								<view class="detail-td" style="width: 50%;">合计：<text class="am-blod">{{items.s_qty}}</text></view>
								<view class="detail-td" style="width: 50%;">总金额：<text class="am-blod">{{items.priceTotal}}</text></view>
							</view>
						</view>
					</view>
					<view class="ub am-btn-panel ub-ac">
						<view class="ub umar-r am-text-99">下单时间：{{items.s_create_time}}</view>
					</view>
					<!-- <view class="com-tip" style="text-align: right;" v-if="tabIndex == 0">扫描发动机外箱二维码出库后，可确认发货</view> -->
					<view class="ub am-btn-panel ub-ac">
						<view class="ub ub-f1 ub-pe">
							<!-- <view class="ub umar-r" v-if="tabIndex == 0">
								<button class="f24 am-btn-danger uinn-a1" @click="scanOut(items)">扫描出库</button>
							</view>
							<view class="ub umar-r" v-if="tabIndex == 0">
								<button class="f24 am-btn-danger uinn-a1" @click="handleOut(items)">手动出库</button>
							</view> -->
							<view class="ub umar-r" v-if="tabIndex == 0">
								<button class="f24 am-btn-primary uinn-a1" @click="orderOk(items,index)">确认发货</button>
							</view>
							<view class="ub" v-if="tabIndex == 0 || tabIndex == 1">
								<button class="f24 uinn-a1" @click="orderCancel(items,index)">取消订单</button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 上拉加载 start -->
			<uni-load-more :status="status"></uni-load-more>
			<!-- 上拉加载 end -->
		</view>
	</view>
</template>

<script>
	import wx from '@/common/js/jwweixin.js'
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	
	export default {
		components:{
			uniSegmentedControl,
			uniLoadMore,
			uniPopup,
			uniIcons
		},
		data() {
			return {
				userInfo: {}, //用户信息
				orderList: [], //订单列表
				state : [0,1,2,-1],//待接单/已发货/已收货/已取消
				p:1,
				total : 0,
				pageSize:10,
				pageCount: '',
				status:'more',
				tabItems: ['待接单','已发货','已收货','已取消'],
				tabIndex: 0,
				badge:[0,0,0,0],
				marginTop: '',
				timer:null,
				engineCode:'A',
				isShow:false,
				s_id:'',
				search:{
					nickname: '',
					tel: '',
					code: 'A'
				},
				s_type_no : 0,
				headerTitle : '修理厂订单'
			}
		},
		onLoad(options) {
			console.log(options);
			//读取存储数据
			let this_ = this;
			this_.s_type_no = options.type;
			this_.tabIndex = parseInt(options.id) == -1 ? 3 : parseInt(options.id);
			if(this_.s_type_no == 0){
				this_.headerTitle = "修理厂订单";
			}else{
				this_.headerTitle = "协议客户订单";
			}
			uni.setNavigationBarTitle({
				title:this_.headerTitle
			})
			this_.wxInit();
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
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
			allShow(){
				this.getOrderList();
			},
			showChange(e){
				this.getOrderList();
			},
			searchDo(){
				console.log(this.tabIndex);
				this.getOrderList();
				this.$refs.popup.close()
				this.clearSearchData();
				this.orderList = [];
			},
			closeDialogShow(){
				this.$refs.popup.close()
				this.clearSearchData();
			},
			clearSearchData (){
				this.search.nickname = '';
				this.search.tel = '';
				this.search.code = 'A';
			},
			openDialogShow(){
				this.$refs.popup.open()
			},
			tel(phoneNum){
				uni.makePhoneCall({
				    phoneNumber: phoneNum //仅为示例
				});
			},
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
			//微信
			wxInit() {
				let this_ = this;
				let _data = {
					url: 'http://gao.vocen.cn:8044/',
				};
				// 获取微信签名
				this_.$http.httpTokenRequest({
					url: 'JsSdkUiPackage',
					method: 'POST',
					data: _data,
				}).then(res => {
					//请求成功
					this_.wxConfig(res.data.Timestamp, res.data.NonceStr, res.data.Signature, res.data.AppId);
				}, error => {
					console.log(error);
				});

			},
			wxConfig(_timestamp, _nonceStr, _signature, _appId) {
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: _appId, // 必填，公众号的唯一标识
					timestamp: _timestamp, // 必填，生成签名的时间戳
					nonceStr: _nonceStr, // 必填，生成签名的随机串
					signature: _signature, // 必填，签名，见附录1
					jsApiList: ['scanQRCode']
					// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			},

			//获取订单列表
			getOrderList() {
				uni.showLoading();
				let this_ = this;
				this_.$http.httpTokenRequest({
					url: this_.$api.CustOrderList + '?c_id=' + '&c_ma001=' + this_.userInfo.c_ma001 + '&state=' +this_.state[this_.tabIndex] + '&nickname=' + this.search.nickname + '&tel=' + this.search.tel + '&code=' + this.search.code + '&m_id=' + this_.userInfo.c_m_id +
						'&pageindex='+this_.p+'&pagesize='+this_.pageSize+'&s_type_no='+this_.s_type_no,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					console.log(res.data);
					for(let i = 0; i < res.data.rows.length; i++){
						this_.$set(res.data.rows[i],'priceTotal',0);
						let item = res.data.rows[i].item;
						for(let m = 0; m < item.length; m++){
							if(res.data.rows[i].s_type_no == 0){
								res.data.rows[i].priceTotal += item[m].i_qty * item[m].unitquantity * item[m].currentprice;
							}else if(res.data.rows[i].s_type_no == 1 && res.data.rows[i].c_isview == 0){
								res.data.rows[i].priceTotal += item[m].i_qty * 0;
							}else if(res.data.rows[i].s_type_no == 1 && res.data.rows[i].c_isview == 1){
								res.data.rows[i].priceTotal += item[m].i_qty * item[m].unitquantity * item[m].a_price;
							}
							
						}
					}
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
				}, error => {
					console.log(error);
				});
			},
			//获取修理厂列表头部红点数量
			orderQty(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.CustNewOrderQty+'?c_ma001='+ this_.userInfo.c_ma001 +'&m_id='+ this_.userInfo.c_m_id +'&c_id='+'&s_type_no='+this_.s_type_no,
					method:'GET',
					data:{},
				}).then(res => {
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
			proDetail(list) {
				let this_ = this;
				list.item = [];
				this_.$http.httpTokenRequest({
					url: this_.$api.CustOrderItem + '?s_id=' + list.s_id,
					method: 'GET',
					data: {},
				}).then(res => {
					//请求成功
					list.item = res.data;
				}, error => {
					console.log(error);
				});
				

			},
			//扫码出库
			scanOut(list) {
				let this_ = this;
				if (list.item.length > 0) {
					wx.ready(function() {
						wx.scanQRCode({
							needResult: 1,
							scanType: ["qrCode", "barCode"],
							success: function(res) {
								let urlName = res.resultStr;
								let engineCode = urlName.split("?")[1].split("=")[1];
								
								uni.showLoading();
								this_.$http.httpTokenRequest({
									url:this_.$api.MotorBind + '?s_id=' + list.s_id,
									method:'POST',
									data:{code:engineCode,ma002:this_.userInfo.c_ma002,level:this_.userInfo.c_level,m_id:this_.userInfo.c_m_id},
								}).then(res => {
									//请求成功
									uni.hideLoading();
									if(res.data.State){
										this_.proDetail(list);
									}
									uni.showModal({
									    title: '温馨提示',
									    content: res.data.Message,
									    success: function (res) {
									        // if (res.confirm) {
									        //     console.log('用户点击确定');
									        // } else if (res.cancel) {
									        //     console.log('用户点击取消');
									        // }
									    }
									});
								},error => {
									uni.showModal({
									    title: '温馨提示',
									    content: "扫描出库失败"
									});
									uni.hideLoading();
								});
								
							},
							error: function(res) {
								alert("失败："+JSON.stringify(res));
							}
						});
					});
				} else {
					this_.proDetail(item, 'refresh');
				}
			},
			handleOut(item){
				this.isShow = true;
				this.s_id = item.s_id;
			},
			cancelDo(){
				this.isShow = false;
			},
			handleOutDo(item){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.MotorBind + '?s_id=' + this.s_id,
					method:'POST',
					data:{code:this.engineCode,ma002:this_.userInfo.c_ma002,level:this_.userInfo.c_level,m_id:this_.userInfo.c_m_id},
				}).then(res => {
					//请求成功
					uni.hideLoading();
					if(res.data.State){
						this_.proDetail(list);
					}
					uni.showModal({
					    title: '温馨提示',
					    content: res.data.Message,
					    success: function (res) {
					        // if (res.confirm) {
					        //     console.log('用户点击确定');
					        // } else if (res.cancel) {
					        //     console.log('用户点击取消');
					        // }
					    }
					});
				},error => {
					uni.hideLoading();
					alert("扫描出库失败");
					console.log(error);
				});
			},
			// scanOut(item) {
			// 	let this_ = this;
			// 	if (item.detail.length > 0) {
			// 		wx.ready(function() {
			// 			wx.scanQRCode({
			// 				needResult: 1,
			// 				scanType: ["qrCode", "barCode"],
			// 				success: function(res) {
			// 					//获取url中engineCode
			// 					//alert(res.resultStr);
			// 					let urlName = res.resultStr;
			// 					if (urlName.split("?").length > 1) {
			// 						let paraArr = urlName.split("?")[1].split("&");
			// 						let engineCode = '';
			// 						for (var i = 0; i < paraArr.length; i++) {
			// 							if (paraArr[i].split("=")[0] == 'engineCode') {
			// 								engineCode = paraArr[i].split("=")[1];
			// 							}
			// 						}
			// 					}
			// 					//判断明细中是否含有code相同的
			// 					let isHas = false;
			// 					/*for(var j=0;j<item.detail.length;j++){
			// 						let codeArr = item.detail[j].code.split(",");
			// 						for(var z=0;z<codeArr.length;z++){
			// 							if(codeArr[z] == engineCode){
			// 								isHas = true;
			// 							}
			// 						}
			// 					}*/
			// 					if(isHas){
			// 						alert("该发动机已扫码");
			// 					}else{
			// 						uni.showLoading();
			// 						this_.$http.httpTokenRequest({
			// 							url:this_.$api.MotorBind + '?s_id=' + item.s_id,
			// 							method:'POST',
			// 							data:{code:engineCode},
			// 						}).then(res => {
			// 							//请求成功
			// 							uni.hideLoading();
			// 							if(res.data.Sate){
			// 								this_.proDetail(item,'refresh');
			// 							}
			// 							alert(res.data.Message);
			// 						},error => {
			// 							uni.hideLoading();
			// 							alert("扫描出库失败");
			// 							console.log(error);
			// 						});
			// 					}

			// 				},
			// 				error: function(res) {
			// 					alert("失败");
			// 					console.log("失败");
			// 					console.log(res);
			// 				}
			// 			});
			// 		});
			// 	} else {
			// 		this_.proDetail(item, 'refresh');
			// 	}
			// },
			//确认发货
			orderOk(list, index) {
				let this_ = this;
				// uni.showLoading();
				// this_.$http.httpTokenRequest({
				// 	url: this_.$api.CustSendOrder + '?s_id=' + list.s_id,
				// 	method: 'GET',
				// 	data: {},
				// }).then(res => {
				// 	uni.hideLoading();
				// 	if(res.data.State){
				// 		uni.showModal({
				// 			title: '温馨提示',
				// 			content: res.data.Message,
				// 			success: function (res) {
				// 				if (res.confirm) {
				// 					this_.confirmOrder(list.s_c_id,list.s_id,list.s_code,list.c_tel,list.s_c_nickname,index);
				// 				} else if (res.cancel) {
				// 					//console.log('用户点击取消');
				// 				}
				// 			}
				// 		});
				// 	}else{
				// 		uni.showToast({
				// 			icon : 'none',
				// 			title : "未扫描绑定发动机识别码,请先扫描出库",
				// 			duration:1500
				// 		});
				// 	}
					
				// }, error => {
				// 	console.log(error);
				// });
				uni.showModal({
					title: '温馨提示',
					content: "是否确认收货？",
					success: function (res) {
						if (res.confirm) {
							this_.confirmOrder(list.s_c_id,list.s_id,list.s_code,list.c_tel,list.s_c_nickname,index);
						} else if (res.cancel) {
							//console.log('用户点击取消');
						}
					}
				});
				
				
			},
			//确认发货接口
			confirmOrder(s_c_id,s_id,s_code,s_tel,s_c_nickname,index){
				let this_ = this;
				uni.showLoading();
				this_.$http.httpTokenRequest({
					url: this_.$api.CustSendOrder + '?ma001=' + this_.userInfo.c_ma001 + '&m_id=' + this_.userInfo.c_m_id,
					method: 'POST',
					data: {
						c_id: s_c_id,
						c_tel: this_.userInfo.c_tel,
						c_nickname: this_.userInfo.c_nickname,
						s_id: s_id,
						s_code: s_code,
						s_tel : s_tel,
						s_c_nickname:s_c_nickname,
					},
				}).then(res => {
					uni.hideLoading();
					if(res.data.State){
						this_.orderList.splice(index, 1);
					}
					uni.showToast({
						icon : 'none',
						title : res.data.Message,
						duration:1500
					});
					
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
			//删除发动机号
			delCode(item,delCode,index){
				let this_ = this;
				if(this_.tabIndex == 0){
					uni.showModal({
					    title: '温馨提示',
					    content: '确定要删除该发动机号吗？',
					    success: function (res) {
					        if (res.confirm) {
								this_.$http.httpTokenRequest({
									url: this_.$api.MotorClear,
									method: 'POST',
									data: {
										s_id: item.i_s_id,
										i_code: delCode,
									},
								}).then(res => {
									if(res.data.State){
										this_.$refs[index][0].$el.innerHTML = '';
									}
									uni.showToast({
										icon : 'none',
										title : res.data.Message,
										duration:1500
									});
									
								}, error => {
									console.log(error);
								});
								
					        } else if (res.cancel) {
					            //console.log('用户点击取消');
					        }
					    }
					});
				}
				
			},
			//取消订单
			orderCancel(list,index){
				let this_ = this;
				uni.showModal({
				    title: '温馨提示',
				    content: '是否取消？',
				    success: function (res) {
				        if (res.confirm) {
							uni.showLoading();
							this_.$http.httpTokenRequest({
								url: this_.$api.CustCancelOrder + '?s_c_id=' + list.s_c_id,
								method: 'POST',
								data: {
									"c_nickname":list.c_nickname,
									"c_tel":list.s_tel,
									"s_id":list.s_id,
									"s_code":list.s_code,
								},
							}).then(res => {
								uni.hideLoading();
								if(res.data.State){
									this_.orderList.splice(index, 1);
								}
								uni.showToast({
									icon : 'none',
									title : res.data.Message,
									duration:1500
								});
								
							}, error => {
								console.log(error);
							});
							
				        } else if (res.cancel) {
				            //console.log('用户点击取消');
				        }
				    }
				});
				
			},
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
	.conditionQuery{
		position: fixed;
		right: 20rpx;
		bottom: 30rpx;
		font-size: 24rpx;
	}
	.uni-common-mt{
		background: #FFFFFF;
		padding: 60rpx 60rpx 0 60rpx;
	}
	.search{
		margin-top: 100rpx;
		width: 180rpx;
		display: inline-block;
	}
	.uni-input{
		height: 32px;
		font-size: 24rpx;
		line-height: 36rpx;
		margin: 20rpx 0;
		border-bottom: 1px solid #CCCCCC;
	}
	.uinn-a1{
		padding-left: 26rpx;
		padding-right: 26rpx;
	}
</style>
