import fetch from '../config/fetch'


/**
 * 创建临时数据
 */
const setpromise = data => {
	return new Promise((resolve, reject) => {
		resolve(data)
	})
}

//编译环境使用真实数据
/*if (process.env.NODE_ENV == 'development') {*/

  var getBanner = (appCode) =>fetch("GET",'/cms/getCmsResource',{
    position:'weibo_banner',
    appCode:appCode,
    appVersion:'1.0.0',
    channel:'browser',
    deviceId:'other_browser'
  });
  var getActivity = (appCode) =>fetch("GET",'/cms/getCmsResource',{
    position:'weibo_activity',
    appCode:appCode,
    appVersion:'1.0.0',
    channel:'browser',
    deviceId:'other_browser'
  });

  var themeList = (deviceId,appCode,tag) => fetch("GET",'/v9/private/'+deviceId+'/weibo/theme/list',{
      appCode,tag
  });
  var themeReward = (deviceId,appCode) => fetch("GET",'/v9/private/'+deviceId+'/weibo/theme/reward',{
      appCode
  });

  var themeDetail = (deviceId,themeId,appcode,sc) =>fetch("GET",'/v9/private/'+deviceId+'/weibo/theme/info',{
    themeId,appcode,sc
  });
  var userInfo = () =>fetch("GET",'/common/browserUserInfo',{});

  var likeTheme = (deviceId,themeId,like,appCode) =>fetch("GET",'/v9/private/'+deviceId+'/weibo/theme/like',{
    themeId,
    like,
    appCode
  });
  var awardTheme = (deviceId,themeId,reward,appCode) =>fetch("GET",'/v9/private/'+deviceId+'/weibo/theme/reward',{
    themeId,
    reward,
    appCode
  });

  var getVerifyCode=(mobile,appCode) =>fetch("GET",'/v9/weibo/bind/verifyMobile',{
    mobile,
    appCode
  });

  var mobileLogin = (deviceId,mobile,verifyCode,appCode,verifyId)=>fetch('GET','/v9/weibo/'+deviceId+'/bind/verifyCode',{
    mobile,verifyCode,appCode,verifyId
  });

  var userIndex = (deviceId,lastTime)=>fetch('GET','/v9/private/'+deviceId+'/user/index',{
    lastTime
  });

  var userSign = (deviceId,appCode)=>fetch('GET','/v9/private/'+deviceId+'/sign/doSign',{
    deviceId,appCode
  });

  var sendComment =(deviceId,themeId,content,visible,appCode)=>fetch('GET','/v9/private/' +deviceId+ '/weibo/theme/comments',{
    themeId,content,visible,appCode
  });
  var lotteryTime = (deviceId) => fetch("GET",'/v9/private/'+deviceId+'/weibo/lottery',{});
  /**
   * 点赞帖子
   */
  var upTheme =(deviceId,themeId,like,appCode)=>fetch('GET','/v9/private/'+deviceId+'/weibo/theme/like',{
    themeId,like,appCode
  });

  var upComment =(deviceId,themeId,like,commentId,appCode)=>fetch('GET','/v9/private/'+deviceId+'/weibo/comment/like',{
    themeId,like,commentId,appCode
  });
  var deleteComment =(deviceId,commentId)=>fetch('GET','/v9/private/'+deviceId+'/weibo/theme/delComment',{
      commentId
    });

  var loadCommentBottom=(deviceId,themeId,pageIndex,pageSize)=>fetch('GET','/v9/private/'+deviceId+'/weibo/theme/commentList',{
    themeId,pageIndex,pageSize
  });

  var loadListBottom=(deviceId,pageIndex,pageSize,appCode,tag)=>fetch('GET','/v9/private/'+deviceId+'/weibo/theme/list',{
    pageIndex,pageSize,appCode,tag
  });

  var themeScratch = (deviceId) => fetch("GET",'/v9/private/'+deviceId+'/weibo/doScrape',{});

  var themeScratchCoupon = (deviceId,recordId) => fetch("GET",'/v9/private/'+deviceId+'/weibo/receivePrize',{
      recordId
  });

  var logout = (deviceId) => fetch('GET','/v9/unbind/'+deviceId+'/mobile',{});

  var loadCouponList=(deviceId,appCode)=>fetch('GET','/v9/private/'+deviceId+'/coupon/list',{
	  appCode
  });

  var couponExchange=(deviceId,appCode,couponUserId)=>fetch('GET','/v9/private/'+deviceId+'/coupon/makeGift',{
      appCode,couponUserId
  });

  var loaduploadImg=(deviceId,img)=>fetch('POST','/v9/private/'+deviceId+'/weibo/uploadImg',{
  	img
  });
  var loadrelease=(deviceId,imgs,source,content,visible)=>fetch('GET','/v9/private/'+deviceId+'/weibo/theme/release',{
  	imgs,source,content,visible
  });

  var personThemeList=(deviceId,casId,userType,userAccount,pageSize)=>fetch('GET','/v9/private/'+deviceId+'/weibo/theme/personThemeList',{
    casId,userType,userAccount,pageSize
  });

  var deletePersonTheme=(deviceId,casId,themeId)=>fetch('GET','/v9/private/'+deviceId+'/weibo/theme/delete',{
    casId,themeId
  });

  var personNum=(deviceId,casId,userType,userAccount)=>fetch('GET','/v9/private/'+deviceId+'/weibo/person',{
    casId,userType,userAccount
  });

  var popCheck=(deviceId,sc,appcode,sign,casId)=>fetch('GET','/weibo/activity/'+deviceId+'/popup/check',{
      sc,appcode,sign,casId
  });

  var popPrize=(deviceId,sc,appcode,sign,mobile,casId)=>fetch('GET','/weibo/activity/'+deviceId+'/receive/prize',{
    sc,appcode,sign,mobile,casId
  });

  var wrList=(deviceId,sc)=>fetch('GET','/weibo/activity/'+deviceId+'/prize/list',{
    sc
  });

	/**
	 * 获取shop页面商铺详情
	 */

	var shopDetails = (shopid, latitude, longitude) => fetch('GET', '/shopping/restaurant/' + shopid, {
		latitude,
		longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
	});



	/**
	 * 获取food页面的商家属性活动列表
	 */

	var foodMenu = restaurant_id => fetch('GET', '/shopping/v2/menu', {
		restaurant_id
	});


	/**
	 * 获取商铺评价列表
	 */

	var getRatingList = (offset, tag_name = '') => fetch('GET', '/ugc/v2/restaurants/834828/ratings', {
		has_content: true,
		offset,
		limit: 10,
		tag_name
	});


	/**
	 * 获取商铺评价分数
	 */

	var ratingScores = shopid => fetch('GET', '/ugc/v2/restaurants/' + shopid + '/ratings/scores', {});


	/**
	 * 获取商铺评价分类
	 */

	var ratingTags = shopid => fetch('GET', '/ugc/v2/restaurants/' + shopid + '/ratings/tags', {});


	/**
	 * 获取短信验证码
	 */

	var mobileCode = phone => fetch('GET', '/weibo/bind/verifyMobile?mobile='+phone, {});




	var getcaptchas = () => fetch('POST', '/v1/captchas', {});


	/**
	 * 账号密码登录
	 */

	var accountLogin = (username, password, captcha_code) => fetch('POST', '/v2/login', {username, password, captcha_code});


	/**
	 * 检测帐号是否存在
	 */

	var checkExsis = (checkNumber, type) => fetch('GET', '/v1/users/exists', {
		[type]: checkNumber,
		type
	});


	/**
	 * 发送帐号
	 */

	var sendMobile = (sendData, captcha_code, type, password) => fetch('POST', '/v1/mobile/verify_code/send', {
		action: "send",
		captcha_code,
		[type]: sendData,
		type: "sms",
		way: type,
		password,
	});


	/**
	 * 确认订单
	 */

	var checkout = (geohash, entities) => fetch('POST', '/v1/carts/checkout', {
		come_from: "web",
		geohash,
		entities,
	});


	/**
	 * 获取快速备注列表
	 */

	var getRemark = (id, sig) => fetch('GET', '/v1/carts/' + id + '/remarks', {
		sig
	});


	/**
	 * 获取地址列表
	 */

	var getAddress = (id, sig) => fetch('GET', '/v1/carts/' + id + '/addresses', {
		sig
	});


	/**
	 * 搜索地址
	 */

	var searchNearby = keyword => fetch('GET', '/v1/pois', {
		type: 'nearby',
		keyword
	});


	/**
	 * 添加地址
	 */

	var postAddAddress = (userId, address, address_detail, geohash, name, phone, phone_bk, poi_type, sex, tag, tag_type) => fetch('POST', '/v1/users/' + userId + '/addresses', {
		address,
		address_detail,
		geohash,
		name,
		phone,
		phone_bk,
		poi_type,
		sex,
		tag,
		tag_type,
	});


	/**
	 * 下订单
	 */

	var placeOrders = (user_id, cart_id, address_id, description, entities, geohash, sig) => fetch('POST', '/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
		address_id,
		come_from: "mobile_web",
		deliver_time: "",
		description,
		entities,
		geohash,
		paymethod_id: 1,
		sig,
	});


	/**
	 * 重新发送订单验证码
	 */

	var rePostVerify = (cart_id, sig, type) => fetch('POST', '/v1/carts/' + cart_id + '/verify_code', {
		sig,
		type,
	});



	/**
	 * 下订单
	 */

	var validateOrders = ({
		user_id,
		cart_id,
		address_id,
		description,
		entities,
		geohash,
		sig,
		validation_code,
		validation_token
	}) => fetch('POST', '/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
		address_id,
		come_from: "mobile_web",
		deliver_time: "",
		description,
		entities,
		geohash,
		paymethod_id: 1,
		sig,
		validation_code,
		validation_token,
	});


	/**
	 * 重新发送订单验证码
	 */

	var payRequest = (merchantOrderNo, userId) => fetch('GET', '/payapi/payment/queryOrder', {
		merchantId: 5,
		merchantOrderNo,
		source: 'MOBILE_WAP',
		userId,
		version: '1.0.0',
	});



	// /**
	//  * 获取服务中心信息
	//  */

	var getService = () => fetch('GET', '/m.ele.me@json/profile/explain', {});



	/**
	*兑换会员卡
	*/

	var vipCart= (id, number, password) => fetch('POST','/member/v1/users/' + id + '/delivery_card/physical_card/bind',{
		number,
		password
	})



	/**
	 * 获取红包数量
	*/

	var getHongbaoNum= id => fetch('GET','/promotion/v2/users/' + id + '/hongbaos',{});



	/**
	 * 获取过期红包
	*/


	var getExpired= id => fetch('GET','/promotion/v2/users/' + id + '/expired_hongbaos?limit=10&offset=0',{});


	/**
	 * 兑换红包
	*/

	var exChangeHongbao= (id, exchange_code, captcha_code) => fetch('POST','/v1/users/' + id + '/hongbao/exchange',{
		exchange_code,
		captcha_code,
	});


	/**
	 * 获取用户信息
	 */

	var getUser = () => fetch('GET', '/v1/user', {});


	// /**
	//  * 手机号登录
	//  */

	// var sendLogin = (code, mobile, validate_token) => fetch('POST', '/v1/login/app_mobile', {
	// 	code,
	// 	mobile,
	// 	validate_token
	// });


	// /**
	//  * 获取订单列表
	//  */

	var getOrderList = (user_id, offset) => fetch('GET', '/bos/v2/users/' + user_id + '/orders', {
		limit: 10,
		offset,
	});


	/**
	 * 获取订单详情
	 */

	var getOrderDetail = (user_id, orderid) => fetch('GET', '/bos/v1/users/' + user_id + '/orders/' + orderid + '/snapshot', {});


	/**
	*个人中心里编辑地址
	*/

	var getAddressList = (user_id) => fetch('GET', '/v1/users/'+user_id+'/addresses')

	/**
	*个人中心里搜索地址
	*/

	var getSearchAddress=(keyword) => fetch('GET','v1/pois',{
		keyword:keyword,
		type:'nearby'
	})

	/**
	* 删除地址
	*/

	var deleteAddress=(userid, addressid) => fetch('OPTIONS','/v1/users/' + userid + '/addresses/' + addressid,{})

/*
}else{
  //var getBanner = ()=>setpromise(home.guesscity);
	var cityGuess = () => setpromise(home.guesscity);
	var hotcity = () => setpromise(home.hotcity);
	var groupcity = () => setpromise(home.groupcity);
	var currentcity = number => setpromise(city.currentcity);
	var searchplace = (cityid, value) => setpromise(city.searchdata);
	var msiteAdress = geohash => setpromise(msite.msiteAdress);
	var msiteFoodTypes = geohash => setpromise(msite.foodTypes);
	var shopList = (latitude, longitude, offset) => setpromise(msite.shopList);
	var searchRestaurant = (geohash, keyword) => setpromise(search.searchData);
	var foodCategory = (latitude, longitude) => setpromise(food.category);
	var foodDelivery = (latitude, longitude) => setpromise(food.delivery);
	var foodActivity = (latitude, longitude) => setpromise(food.activity);
	var shopDetails = (shopid, latitude, longitude) => setpromise(shop.shopDetails);
	var foodMenu = restaurant_id => setpromise(shop.shopMenu);
	var getRatingList = (offset, tag_name = '') => setpromise(shop.ratingList);
	var ratingScores = shopid => setpromise(shop.scores);
	var ratingTags = shopid => setpromise(shop.tage);
	var mobileCode = phone => setpromise(login.validate_token);
	var accountLogin = (username, password, captcha_code) => setpromise(login.userInfo);
	var checkExsis = (checkNumber, type) => setpromise(login.checkExsis);
	var sendMobile = (sendData, captcha_code, type, password) => setpromise(login.send);
	var checkout = (geohash, entities) => setpromise(confirm.checkout);
	var getRemark = (id, sig) => setpromise(confirm.remark);
	var getAddress = (id, sig) => setpromise(confirm.addressList);
	var getcaptchas = () => setpromise(login.cpatchs);
	var searchNearby = keyword => setpromise(confirm.searchAddress);
	var postAddAddress = (userId, address, address_detail, geohash, name, phone, phone_bk, poi_type, sex, tag, tag_type) => setpromise(confirm.addAddress);
	var placeOrders = (user_id, cart_id, address_id, description, entities, geohash, sig) => setpromise(confirm.palceOrder);
	var rePostVerify = (cart_id, sig, type) => setpromise(confirm.verfiyCode);
	validateOrders = ({
		user_id,
		cart_id,
		address_id,
		description,
		entities,
		geohash,
		sig,
		validation_code,
		validation_token
	}) => setpromise(confirm.orderSuccess);
	var payRequest = (merchantOrderNo, userId) => setpromise(confirm.payDetail);
	getService = () => setpromise(service.serviceData);
	var vipCart= (id, number, password) => setpromise(vip.vipcart);
	var getHongbaoNum= id => setpromise(hongbao.dataList);
	var getExpired= id => setpromise(hongbao.expired);
	var exChangeHongbao= (id, exchange_code, captcha_code) => setpromise(hongbao.exchange);
	var getUser = () => setpromise(login.userInfo);
	var getOrderList = (user_id, offset) => setpromise(order.orderList);
	var getOrderDetail = (user_id, orderid) => setpromise(order.orderDetail);
	var getAddressList = (user_id) => setpromise(addresspart.address);
	var getSearchAddress=(keyword) => setpromise(addDetail.addData);
	var deleteAddress=(userid, addressid) =>  setpromise(vip.vipcart);
}
*/


/**
 * 以下Api接口不需要进行反向代理
 */

var sendLogin = (code, mobile, validate_token) => setpromise(login.userInfo);


export {logout,loadListBottom,getBanner,getActivity,userInfo,themeList,likeTheme,themeReward,awardTheme,themeDetail,getVerifyCode,mobileLogin,userIndex,userSign,sendComment,upTheme,upComment,deleteComment,loadCommentBottom, shopDetails, foodMenu, getRatingList, ratingScores, ratingTags, mobileCode, accountLogin, checkExsis, sendMobile, checkout, getRemark, getAddress, getcaptchas, searchNearby, postAddAddress, placeOrders, rePostVerify, validateOrders, payRequest, getService, vipCart, getHongbaoNum, getExpired, exChangeHongbao, getUser, sendLogin, getOrderList, getOrderDetail, getAddressList, getSearchAddress, deleteAddress,lotteryTime,themeScratch,themeScratchCoupon,loadCouponList,couponExchange,loaduploadImg,loadrelease,personThemeList,deletePersonTheme,personNum,popCheck,popPrize,wrList}

