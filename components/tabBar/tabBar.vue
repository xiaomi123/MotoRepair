<template>
	<view>
		<view class="tabbar" :style="{backgroundColor:backgroundColor}">
			<uni-grid :column="column" :show-border="false" :square="false" :highlight="false" @change="switchTab">
				<uni-grid-item v-if="index < 6" v-for="(item ,index) in options" :index="index" :key="index">
					<view class="grid-item-box">
						<image v-if="currentTabIndex == index" class="image" :src="item.selectedIconPath" mode="aspectFill" />
						<image v-else class="image" :src="item.iconPath" mode="aspectFill" />
						<text class="text" :style="[currentTabIndex == index ? {'color': tintColor} : {'color': color}]">{{item.text}}</text>
						<view v-if="item.badge" class="grid-dot">
							<uni-badge :text="item.badge" :type="item.type" />
						</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
	</view>
</template>

<script>
	import uniGrid from '@/components/uni-grid/uni-grid.vue'
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniBadge from '@/components/uni-badge/uni-badge.vue'
	export default {
		components: {
			uniGrid,
			uniGridItem,
			uniBadge
		},
		data() {
			return {
				currentTabIndex: this.current
			}
		},
		props: {
			current: { type: [Number, String], default: 0 },
			column: {type: Number, default:3},
			backgroundColor: { type: String, default: '#fbfbfb' },
			color: { type: String, default: '#999999' },
			tintColor: { type: String, default: '#3079F3' },			
			options:{
				type : Array,
				default(){
					return []
				}
			}
		},
		methods: {
			switchTab(e){
				this.currentTabIndex = e.detail.index;
				var src = this.options[this.currentTabIndex];
				uni.navigateTo({
					url : src.pagePath
				})
			}
		},
	}
</script>
<style>
	.tabbar{
		height: 98rpx;
		overflow: hidden;
		width: 100%;
		position: fixed;
		bottom:0;
		left:0;
		border-top: 1px solid #EEEEEE;
		z-index: 1010;
	}
	.grid-item-box {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0;
	}
	.image{
		width: 44rpx;
		height: 44rpx;
		margin-top: 12rpx;
	}
	.text{
		font-size: 22rpx;
		font-family:PingFang SC;
		padding-top: 4rpx;
	}
	.grid-dot{
		position: absolute;
		top: 0;
		right: 28%;
	}
	.uni-badge{
		width: 20rpx !important;
	}
</style>