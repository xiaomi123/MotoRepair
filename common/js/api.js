export default {
	CustomerInfo:'CustomerInfo',//获取用户信息
	UserState:'UserState',//修理厂/代理商信息补全//修改修理厂账号状态
	CustQRCode:'CustQRCode',//代理商和修理厂扫码进入，注册
	ProductHome:'ProductHome',//获取首页产品列表
	ProductByPre: 'ProductByPre',//获取首页预售产品列表
	ProductByCode:'ProductByCode',//产品详情页信息//由一级原车代码获取二级原车代码
	AddShopCart:'AddShopCart',//添加购物车
	DelShopCart:'DelShopCart',//删除购物车
	GetShopCart:'GetShopCart',//查询购物车
	ShopCartQty:'ShopCartQty',//查询购物车数量
	CustAddOrder:'CustAddOrder',//生成订单//修理厂立即购买
	OrderNew:'OrderNew',//一级代理商生成订单
	AddFavorite:'AddFavorite',//添加收藏
	DelFavorite:'DelFavorite',//删除收藏夹
	GetFavorite:'GetFavorite',//查询收藏
	CustOrderList:'CustOrderList',//订单查询
	CustOrderItem:'CustOrderItem',//订单明细
	CustNewOrderQty:'CustNewOrderQty',//代理商新订单数量（每次登录后查询）
	CustSendOrder:'CustSendOrder',//代理商确认发货
	MotorBind:'MotorBind',//扫码出库
	CustEndOrder:'CustEndOrder',//修理厂确认收货
	CustCancelOrder:'CustCancelOrder',//修理厂取消订单
	UserQty:'UserQty',//修理厂待审核数量
	GetUser:'GetUser',//读取开通账号的修理厂数据
	CustAgentOrder:'CustAgentOrder',//代理商代下单
	CustRecommend:'CustRecommend',//代理商推荐产品
	MotorClear:'MotorClear',//移除发动机编号
	review:'review',//评价
	//Review:'Review',//评价列表--------前端不用（国华后台用）
	shopReview:'shopReview',//查询评价
	UserAudit:'UserAudit',//修理厂申请审核
	CustSendOrder:'CustSendOrder',//检验是否允许发货
	AddMarket:'AddMarket',//添加经销商
	GetMarket:'GetMarket',//查询经销商
	GetCustomer:'GetCustomer',//查询修理厂所属代理商列表
	GetAgreeCustomer:'GetCustomerByMid', //查询协议客户所属代理商
	AddAllocate:'AddAllocate',//代理商添加调拨单//调拨单绑定发动机识别码	
	DelAllocate:'DelAllocate',//代理商删除调拨单
	MotorClear:'MotorClear',//调拨移除发动机编号
	GetAllocate:'GetAllocate',//添加调拨单前调用，如有数据直接显示,//查询调拨单列表
	AllocateSend:'AllocateSend',//代理商确认发货
	CustStorage:'CustStorage',//获取代理商库存
	CustStorageQty : 'CustStorageQty',//获取代理商库存总数量
	CustCancelOrder:'CustCancelOrder',//代理商-取消订单
	Integral: 'Integral', //修理厂-积分流水
	OrderList:'OrderList',//一级代理商订单列表
	OrderArrival:'OrderArrival',//一级代理商,获取销货单号//代理商确认收货
	Store:'Store',//获取销货单仓库
	OrderTimeLine:'OrderTimeLine',//代理商订单时间轴,//代理商销货单明细
	InPrice:'InPrice',//获取进货价
	StoreQty:'StoreQty',//获取库存数量
	ReplyMessage:'ReplyMessage',//代理商回复留言
	CarCode:'CarCode',//机型查询
	Wish:'Wish', //修理厂许愿池
	Remind: 'Remind',//到货查询
	RemindQty: 'RemindQty',//到货数量查询
	CustShopCart : 'CustShopCart', //代理商购物车接口
	CloseMarket : 'CloseMarket',
	CustomerComplain : 'CustomerComplain', //投诉
	UploadFile : 'UploadFilesByFromData',  //图片上传
	AgreementProductHome : 'AgreementProductHome' //协议客户首页
	
}