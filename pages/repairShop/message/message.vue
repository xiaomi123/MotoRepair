<template>
	<view class="evaluate-container">
		<view class="evaluate-list">
			标签：
			<view class="example-body">
				<view class="tag-view" v-for="item in tags">
					<uni-tag :text="item.name" :inverted="item.isChecked" :type="type" @click="selected(item)"></uni-tag>
				</view>
				<view class="am-clear"></view>
			</view>
		</view>
	    <view class="evaluate-list">
	    	描述：
	    	<view>
	    		<textarea class="evaluate-txt" placeholder="说说你的意见,我们会做的更好~~~~~~~~~~~说说你的感受,为更多小伙伴购买提供参考~" v-model="r_content" />
	    	</view>
	    </view>
		<button type="primary" @click="evalSubmit()">提交</button>
	</view>
</template>

<script>
	import uniTag from "@/components/uni-tag/uni-tag.vue"
	export default {
		components: {
			uniTag
		},
		data() {
			return {
				type : 'primary',
				r_content : '',
				tags : [
					{name:'产品质量',isChecked:'true'},
					{name:'物流',isChecked:'true'},
					{name:'代理商',isChecked:'true'},
				]
			}
		},
		onLoad(){
			//读取存储数据
			let this_ = this;
			uni.getStorage({
			    key: 'userInfo',
			    success: function (res) {
					console.log(res);
					this_.userInfo = res.data[0];
			    }
			});
		},
		methods: {
			selected(item){
				item.isChecked = !item.isChecked;
				if(!item.isChecked){
					console.log(item.name);
				}
			},
		}
	}
</script>

<style scoped>
	.evaluate-container{
		padding:4%;
		font-size:28rpx;
	}
	.evaluate-txt{
		width: auto;
		margin:5% 0;
		padding:4%;
		font-size:28rpx;
		color:#343434;
		border:1px solid #ddd;
	}
	.example-body {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}
	.tag-view {
		float: left;
		margin: 10rpx 15rpx;
	}
</style>
