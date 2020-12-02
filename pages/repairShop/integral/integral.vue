<template>
	<view class="f28">
		<view class="order-list-item ub-box-shadow ub ub-ac" v-for="item in list">
			<view class="ub ub-f1 ub-ver">
				<view class="list-item ub">{{item.if_message}}</view>
				<view class="list-item ub am-text-99 f26">{{item.if_create_date}}</view>
			</view>
			<view class="ub am-text-primary">{{item.if_qty}}</view>
		</view>
		<!-- 上拉加载 start -->
		<uni-load-more :status="status"></uni-load-more>
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
				userInfo:{},//用户信息
				list:[],
				p:1,
				pageSize:10,
				pageCount: '',
				status:'more'
			}
		},
		onLoad() {
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					this_.userInfo = res.data[0];
					//获取订单列表
					this_.getList();
					
			    }
			});
		},
		//上拉加载
		onReachBottom (){
			if(this.p < this.pageCount){
				this.p++;
				this.status = 'loading';
				this.getList();
			}else{
				this.status = 'noMore';
			}
		},
		methods: {
			getList(){
				let this_ = this;
				this_.$http.httpTokenRequest({
					url:this_.$api.Integral+'?c_id=' + this_.userInfo.c_id + '&pageindex='+this_.p+'&pagesize='+this_.pageSize,
					method:'GET',
					data:{},
				}).then(res => {
					//请求成功
					console.log(res.data);
					
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
		}
	}
</script>

<style>
.order-list-item{
	padding: 15rpx 20rpx 0;
}
.list-item{
	padding-bottom: 15rpx;
}
</style>
