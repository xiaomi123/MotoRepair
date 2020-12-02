<template>
	<view class="newRepair-container">
		<!-- 主要内容开始 -->
		<view class="newRepair-main">
			<!-- <view v-if="list.length>0"> -->
			<view>
				<view v-for="(item,index) in list" class="newRepair-list ub-ac">
					<view class="newRepair-fl">
						<view>修理厂名称：{{item.c_nickname}}</view>
						<view>联系电话：{{item.c_tel}}</view>
						<!-- <view>备用电话：{{item.c_tel1}}</view> -->
						<view>详细地址：{{item.c_prov + item.c_city + item.c_address}}</view>
					</view>
					<button type="primary" class="newRepair-fr" @click="reply(item)">查看</button>
				</view>
			</view>
			<!-- <view class="com-nodata" v-if="list.length==0">暂无数据</view> -->
		</view>
		<!-- 主要内容结束 -->
		<!-- 上拉加载 start -->
		<uni-load-more :status="status" class="am-umar-tbar"></uni-load-more>
		<!-- 上拉加载 end -->
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	export default {
		components:{
			uniLoadMore
		},
		data() {
			return {
				userInfo: {}, //用户信息
				list: [], //修理厂用户
				p: 1,
				pageSize: 10,
				pageCount: '',
				status: 'more',
			}
		},
		onLoad(option) {
			//读取存储数据
			let this_ = this;
			uni.getStorage({
				key: 'userInfo',
				success: function(res) {
					this_.userInfo = res.data[0];
					this_.getNewRepair();
				}
			});
		},
		//上拉加载
		onReachBottom() {
			if (this.p < this.pageCount) {
				this.p++;
				this.status = 'loading';
				this.getNewRepair();
			} else {
				this.status = 'noMore';
			}
		},
		methods: {
			//获取新增修理厂待审核数量
			getNewRepair() {
				let this_ = this;
				let state = 0;
				this_.$http.httpTokenRequest({
					url:this_.$api.GetUser+'?name=&tel=&ma001='+ this_.userInfo.c_ma001 +'&m_id='+ this_.userInfo.c_m_id +'&state='+ state +'&pageindex='+ this_.p +'&pagesize='+this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					if(this_.p > 1){
						this_.list = this_.list.concat(res.data.rows);
					}else{
						this_.list = res.data.rows;
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
			//获取总页数
			papeTotal(rowCount) {
				let this_ = this;
				if (rowCount != null && rowCount != "") {
					if (rowCount % this_.pageSize == 0) {
						this_.pageCount = parseInt(rowCount / this_.pageSize);
					} else {
						this_.pageCount = parseInt(rowCount / this_.pageSize) + 1;
					}
				} else {
					return 0;
				}
			},
			//回复
			reply(item){
				uni.navigateTo({
					url : '../message/message?data='+item.c_openid
				})
			}
		}
	}
</script>
