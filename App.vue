<script>
	export default {
		globalData:{
			carsType : [{
				name : '奔驰',
				imgPath : '../../../static/images/pictures/benchi.png',
				code : "a180207,a180254,a180255,a180256,a180262"
			},{
				name : '宝马',
				imgPath : '../../../static/images/pictures/baoma.png',
				code : 'a180208,a180209,a180210,a180258,a180260,a180263'
			},{
				name : '奥迪/大众',
				imgPath : '../../../static/images/pictures/aodi.png',
				code : "1180084,1180107,1180093,1180183,1180124,1180186,1180134,1180156,1180180,1180107,a180246,a180247,a180248"
			},{
				name : '路虎',
				imgPath : '../../../static/images/pictures/luhu.png',
				code : "a180251,a180253"
			},{
				name : '现代/起亚',
				imgPath : '../../../static/images/pictures/xiandai.png',
				code : '1180083,1180082,1180103,1180096,1180098,1180099'
			},{
				name : '通用',
				imgPath : '../../../static/images/pictures/tongyong.png',
				code :'1180062,1180063,1180112,1180085,1180032,1180092,1180081,1180090,1180087'
			},{
				name : '比亚迪',
				imgPath : '../../../static/images/pictures/biyadi.png',
				code :'1180088,1180089,1180105'
			},{
				name : '宝马',
				imgPath : '../../../static/images/pictures/xiandai.png',
				code : '1180083,1180082,1180103,1180096,1180098,1180099'
			},{
				name : '通用',
				imgPath : '../../../static/images/pictures/tongyong.png',
				code :'1180062,1180063,1180112,1180085,1180032,1180092,1180081,1180090,1180087'
			},{
				name : '比亚迪',
				imgPath : '../../../static/images/pictures/biyadi.png',
				code :'1180088,1180089,1180105'
			}
			,{
				name : '吉利',
				imgPath : '../../../static/images/pictures/jili.png',
				code :'1180114,1180115,1180116,1180117,1180118,1180119,1180120,1180121,1180122,1180123'
			},{
				name : '长安轿车',
				imgPath : '../../../static/images/pictures/changan.png',
				code :'1180058,1180059,1180060,1180104'
			},{
				name : '金杯',
				imgPath : '../../../static/images/pictures/jinbei.png',
				code :'1180070,1180111,1180131,1180132'
			},{
				name : '三菱',
				imgPath : '../../../static/images/pictures/sanling.png',
				code :'1180127,1180216,1180118,1180125,1180126'
			},{
				name : '昌河汽车',
				imgPath : '../../../static/images/pictures/changhe.png',
				code :'1180044,1180051,1180061,1180067,1180072,1180202'
			},{
				name : '东风风光',
				imgPath : '../../../static/images/pictures/dffg.png',
				code :'1180136,1180137,1180138,1180139,1180140,1180141,1180142,1180143,1180144,1180145,1180146,1180147,1180148,1180149,1180151,1180152,1180154,1180155,1180176,1180181'
			},{
				name : '东风小康',
				imgPath : '../../../static/images/pictures/dfxk.png',
				code :'1180011,1180050,1180037,1180071,1180045'
			},{
				name : '五菱/宝骏',
				imgPath : '../../../static/images/pictures/baojun.png',
				code :'1180030,1180019,1180031,1180043,1180064,1180056,1180035,1180036,1180033,1180053,1180068,1180065,1180079,1180080'
			},{
				name : '长安',
				imgPath : '../../../static/images/pictures/changan1.png',
				code :'1180005,1180004,1180038,1180039,1180049,1180046'
			},{
				name : '465系列',
				imgPath : '../../../static/images/pictures/465.png',
				code :'1180029,1180027,1180007,1180006,1180016,1180024,1180014,1180009'
			},{
				name : '其它',
				imgPath : '../../../static/images/pictures/other.png',
				code :'1180075,1180074,1180200,1180057,1180069,1180110'
			}]
		},
		onLaunch: function() {
			//console.log('App Launch')
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("/common/css/motorOrder.css");
	@import url("/common/css/motorOrder02.css");
	@font-face{
		font-family:iconfont;src:url(./static/font/iconfont.eot);
		src:url(./static/font/iconfont.eot?#iefix) format('embedded-opentype'),url(./static/font/iconfont.woff) format('woff'),url(./static/font/iconfont.ttf) format('truetype'),url(./static/font/iconfont.svg#iconfont) format('svg')
	}
	.iconfont{font-family:iconfont!important;font-size:20px;font-style:normal;-webkit-font-smoothing:antialiased}
</style>
