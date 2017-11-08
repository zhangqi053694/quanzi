<template>
  <div id="themeList" style="background-color: #f2f2f2;">

    <input id="_bbid" type="hidden"/>
    <input type="hidden" id="_appCode">
    <input type="hidden" id="_channel">
    <input type="hidden" id="_appVersion">
    <input type="hidden" id="_deviceId">
    <input type="hidden" id="_uuid">
    <input type="hidden" id="_ooid">

    <div class="top-bg-div">
      <div class="top-header-div left">
        <img @click="loginOrAccount" :src="loginUserIcon!=null?loginUserIcon:require('../../images/defaultUserIcon.png')">
      </div>
      <div class="top-tab-div left" v-if="isShowTopTab">
        <div>
          <div class="top-tab" :class="{'top-tab-active':isTabSelect}" @click="tabChange(0)">热点</div>
          <div class="top-tab" :class="{'top-tab-active':!isTabSelect}" @click="tabChange(1)">新鲜</div>
        </div>
      </div>
      <div class="top-release-div right">
          <img @click="loginOrRelease" src="../../images/icon_release.png">
      </div>
    </div>

    <!--<div class="headerFix">-->
      <!--<router-link to="account">-->
        <!--<img @click="loginOrAccount" :src="loginUserIcon!=null?loginUserIcon:require('../../images/defaultUserIcon.png')">-->
      <!--</router-link>-->
    <!--</div>-->

    <div id="topBanner" class="banner">
      <swiper class="banner" :options="bannerOption">
        <swiper-slide v-for="item in items">
          <a :href="item.url">
            <img class="img2" :src="item.icon"/>
          </a>
        </swiper-slide>
        <div class="swiper-pagination paging" slot="pagination"></div>
      </swiper>
    </div>

    <div id="indexTopTab" class="index-tab-div">
      <div class="index-tab" :class="{'index-tab-active':isTabSelect}" @click="tabChange(0)">热点</div>
      <div class="index-tab" :class="{'index-tab-active':!isTabSelect}" @click="tabChange(1)">新鲜</div>
    </div>

    <div v-if="todos.length>0" class="activity-btn">
      <a v-for="todo in todos" :href="todo.url">
        <p class="activity-btn-icon"><img :src="todo.icon"/></p>
        <p class="activity-btn-name">{{todo.cname}}</p>
      </a>
    </div>
    <div style="margin-top: 0.5rem;">
      
      <!--列表部分  话题2-->
      <div class="comment" v-for="(listData,index) in listDatas" v-if="isTabSelect">
        <div v-if="listData.type==2?true:false">
        <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId" class="con-img-a">
          <div class="con">
            <!--头像-->
            <div class="con-top">
              <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId">
                <a class="con-top-a1">
                  <!--默认头像的给予-->
                  <img @click.prevent="toPersonThemeList(listData.userType,listData.userAccount,listData.nickName,listData.userIcon)" :src="(listData.userIcon!=null && listData.userIcon!='')?listData.userIcon:require('../../images/cr-033.png')"/>
                </a>
              </router-link>
              <div class="con-top-p">
                <p class="con-top-p1">{{listData.nickName}}</p>
                <p class="con-top-p2">{{countTime(listData.showTime)}}</p>
              </div>
            </div>
            <!--评论-->
            <div class="con-tit">
              <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId">
                                    <span class="con-tit-span1"
                                          v-if="listData.content!=null">{{listData.content.substring(0,79)}}</span><span
                v-if="listData.content!=null && listData.content.length>80" class="con-tit-point">...</span>
                <span class="con-tit-span2"
                      v-if="listData.content!=null && listData.content.length>80">全文</span>
              </router-link>
            </div>
            <!--嗮图-->
            <div class="con-img">
              <div class="con-img-2">

                <a v-if="key<3" class="con-img-a con-show-img"
                   v-for="(value,key) in listData.imgList">
                  <img :src="value.smallImg"/>
                  <img class="gif-flag" src="../../images/gif-flag.png" v-if="value.img.indexOf('gif')>0?true:false">
                </a>
                <span class="con-img-num"
                      v-if="listData.imgList!=null && listData.imgList.length>3">共{{listData.imgList.length}}张</span>
              </div>
            </div>
          </div>
        </router-link>
        <!--留言，赞，打赏-->
        <div class="con-talk">
                <span>
                     <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId" class="con-img-a">
                         <a class="con-talk-aImg"><img src="../../images/cr-004.png"/></a>
                         <i>{{listData.commentCount}}</i>
                     </router-link>
                </span>

          <span @click="likeData(listData.likeCount,listData.themeId,'1')" v-if="isHaveLike(listData.behaviors)">
            <img src="../../images/index-dz-b.png"/><i style="color: #FF9728;">{{listData.likeCount}}</i>
          </span>
          <span @click="likeData(listData.likeCount,listData.themeId,'2')" v-else="">
            <img src="../../images/index-dz-a.png"/><i>{{listData.likeCount}}</i>
          </span>

          <span class="con-talk-btn" @click="listDataFun(listData.themeId,listData.userType,1,listData.auditStatus)">
                <a class="con-talk-aImg">
                  <img v-if="isHaveReward(listData.behaviors) && listData.behaviors!=null" src="../../images/index-ds-a.png"/>
                </a>
                <i v-if="isHaveReward(listData.behaviors) && listData.behaviors!=null">{{listData.rewardCount}}</i>

                <a class="con-talk-aImg">
                  <img v-if="HaveReward(listData.behaviors) && listData.behaviors!=null" src="../../images/index-ds-b.png"/>
                </a>
                <i v-if="HaveReward(listData.behaviors) && listData.behaviors!=null" style="color: #FF9728;">{{listData.rewardCount}}</i>

                <a class="con-talk-aImg">
                  <img v-if="listData.behaviors==null" src="../../images/index-ds-a.png"/>
                </a>
                <i v-if="listData.behaviors==null">{{listData.rewardCount}}</i>
          </span>
        </div>
        </div>

        <div v-if="listData.type==3?true:false">
          <a :href="listData.url">
            <img class="img2" :src="listData.img"/>
          </a>
        </div>

        <div class="scratch-wrapper" v-if="listData.type==4?true:false">
          <div class="scratch-bg">
            <img src="../../images/cr-032.png">
            <div class="scratch-txt-wrapper" @click="scratchFun(index)" v-if="listData.scratchList==null">
              <div>
                <p class="scratch-txt">{{listData.content}}</p>
                <button class="blowCardBtn">点我刮奖</button>
              </div>
            </div>
            <!--loading-->
            <div class="scratch-loading-wrapper" v-if="scratchLoadingShow">
              <div>
                <div class="hcircle-wait">
                  <div class="loading-wrapper">
                    <img src="../../images/loadingImg.png">
                  </div>
                </div>
              </div>
            </div>
            <!--prizeType 0 谢谢参与 2 优惠券 3 第三方-->
            <div class="scratch-result-wrapper" v-if="listData.scratchList!=null">
              <!-- <p class="scratch-result-share" v-if="listData.scratchList.isShare == 1">分享</p> -->
              <div>
                <p class="scratch-result-name">{{listData.scratchList.prizeName}}</p>
                <p class="scratch-result-desc">{{listData.scratchList.prizeDesc}}</p>
                <a class="scratch-result-btn" :href="listData.scratchList.awardUrl" v-if="listData.scratchList.prizeType==3">点击领取</a>
                <a class="scratch-result-btn" v-if="(listData.scratchList.prizeType==2 || listData.scratchList.prizeType==6) && !listData.scratchCouponShow" @click="getCouponFun(listData.scratchList.recordId,index)">点击领取</a>
                <a class="scratch-result-btn" v-if="listData.scratchCouponShow" @click="selectCouponFun">去查看</a>
              </div>
            </div>
          </div>
        </div>

      </div>


      <div class="comment" v-for="(listData,index) in freshList" v-if="!isTabSelect">
        <div v-if="listData.type==2?true:false">
          <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId" class="con-img-a">
            <div class="con">
              <!--头像-->
              <div class="con-top">
                <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId">
                  <a class="con-top-a1">
                    <!--默认头像的给予-->
                    <img @click.prevent="toPersonThemeList(listData.userType,listData.userAccount,listData.nickName,listData.userIcon)" :src="(listData.userIcon!=null && listData.userIcon!='')?listData.userIcon:require('../../images/cr-033.png')"/>
                  </a>
                </router-link>
                <div class="con-top-p">
                  <p class="con-top-p1">{{listData.nickName}}</p>
                  <p class="con-top-p2">{{countTime(listData.showTime)}}</p>
                </div>
              </div>
              <!--评论-->
              <div class="con-tit">
                <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId">
                                    <span class="con-tit-span1"
                                          v-if="listData.content!=null">{{listData.content.substring(0,79)}}</span><span
                        v-if="listData.content!=null && listData.content.length>80" class="con-tit-point">...</span>
                  <span class="con-tit-span2"
                        v-if="listData.content!=null && listData.content.length>80">全文</span>
                </router-link>
              </div>
              <!--嗮图-->
              <div class="con-img">
                <div class="con-img-2">

                  <a v-if="key<3" class="con-img-a con-show-img"
                     v-for="(value,key) in listData.imgList">
                    <img :src="value.smallImg"/>
                    <img class="gif-flag" src="../../images/gif-flag.png" v-if="value.img.indexOf('gif')>0?true:false">
                  </a>
                  <span class="con-img-num"
                        v-if="listData.imgList!=null && listData.imgList.length>3">共{{listData.imgList.length}}张</span>
                </div>
              </div>
            </div>
          </router-link>
          <!--留言，赞，打赏-->
          <div class="con-talk">
                <span>
                     <router-link :to="'/comment/' + listData.themeId" :key="listData.themeId" class="con-img-a">
                         <a class="con-talk-aImg"><img src="../../images/cr-004.png"/></a>
                         <i>{{listData.commentCount}}</i>
                     </router-link>
                </span>

            <span @click="freshLikeData(listData.likeCount,listData.themeId,'1',listData.auditStatus)" v-if="isHaveLike(listData.behaviors)">
                <img src="../../images/index-dz-b.png"/><i style="color: #FF9728;">{{listData.likeCount}}</i>
            </span>
            <span @click="freshLikeData(listData.likeCount,listData.themeId,'2',listData.auditStatus)" v-else="">
          
                <img src="../../images/index-dz-a.png"/><i>{{listData.likeCount}}</i>
            </span>

            <span class="con-talk-btn" @click="listDataFun(listData.themeId,listData.userType,0,listData.auditStatus)">
                <a class="con-talk-aImg">
                  <img v-if="isHaveReward(listData.behaviors) && listData.behaviors!=null" src="../../images/index-ds-a.png"/>
                </a>
                <i v-if="isHaveReward(listData.behaviors) && listData.behaviors!=null">{{listData.rewardCount}}</i>

                <a class="con-talk-aImg">
                  <img v-if="HaveReward(listData.behaviors) && listData.behaviors!=null" src="../../images/index-ds-b.png"/>
                </a>
                <i v-if="HaveReward(listData.behaviors) && listData.behaviors!=null" style="color: #FF9728;">{{listData.rewardCount}}</i>

                <a class="con-talk-aImg">
                  <img v-if="listData.behaviors==null" src="../../images/index-ds-a.png"/>
                </a>
                <i v-if="listData.behaviors==null">{{listData.rewardCount}}</i>
          </span>
          </div>
        </div>

        <div v-if="listData.type==3?true:false">
          <a :href="listData.url">
            <img class="img2" :src="listData.img"/>
          </a>
        </div>

        <div class="scratch-wrapper" v-if="listData.type==4?true:false">
          <div class="scratch-bg">
            <img src="../../images/cr-032.png">
            <div class="scratch-txt-wrapper" @click="scratchFun(index)" v-if="listData.scratchList==null">
              <div>
                <p class="scratch-txt">{{listData.content}}</p>
                <button class="blowCardBtn">点我刮奖</button>
              </div>
            </div>
            <!--loading-->
            <div class="scratch-loading-wrapper" v-if="scratchLoadingShow">
              <div>
                <div class="hcircle-wait">
                  <div class="loading-wrapper">
                    <img src="../../images/loadingImg.png">
                  </div>
                </div>
              </div>
            </div>
            <!--prizeType 0 谢谢参与 2 优惠券 3 第三方-->
            <div class="scratch-result-wrapper" v-if="listData.scratchList!=null">
              <!-- <p class="scratch-result-share" v-if="listData.scratchList.isShare == 1">分享</p> -->
              <div>
                <p class="scratch-result-name">{{listData.scratchList.prizeName}}</p>
                <p class="scratch-result-desc">{{listData.scratchList.prizeDesc}}</p>
                <a class="scratch-result-btn" :href="listData.scratchList.awardUrl" v-if="listData.scratchList.prizeType==3">点击领取</a>
                <a class="scratch-result-btn" v-if="(listData.scratchList.prizeType==2 || listData.scratchList.prizeType==6) && !listData.scratchCouponShow" @click="getCouponFun(listData.scratchList.recordId,index)">点击领取</a>
                <a class="scratch-result-btn" v-if="listData.scratchCouponShow" @click="selectCouponFun">去查看</a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!--加载转圈-->
      <div class="hcircle-wait" v-show="isShowLoading">
          <!--loading动画-->
          <!--<div class="Hing-span">-->
            <!--<div class="Hing-help"></div>-->
          <!--</div>-->
          <div class="loading-wrapper">
            <img src="../../images/loadingImg.png">
          </div>
      </div>
      <div class="hcircle-wait" v-show="!isShowLoading">
        <p>已经到底啦</p>
      </div>
    </div>


    <!--打赏弹窗-->
    <div class="award-pop" @click="awardNone2" @touchmove.prevent v-show="isshow"></div>
    <div class="award-tc" v-show="isshow">
      <div class="award-1"><img src="../../images/cr-014.png"/></div>
      <div class="award-2" @click="popNone"><img src="../../images/cr-015.png"/></div>
      <div v-if="islogin" class="award-3"><b>给他打赏</b></div>
      <!--未登录-->
      <div v-else="" class="award-3"><b>打赏</b></div>
      <div v-if="islogin && copyUserType == 3" class="award-4">{{jackpotCopy}}</div>
      <div v-if="islogin && copyUserType != 3" class="award-4">{{personCopy}}</div>
      <div v-if="!islogin" class="award-4">打赏赢果币即有机会参与抽奖<br />赶快登录参与吧</div>
      <div class="award-5" v-show="islogin">
        <div class="award-minus" @click="awardMinus"><img src="../../images/cr-016.png"/></div>
        <div class="award-money">{{listNumber}}个果币</div>
        <div class="award-plus" @click="awardPlus"><img src="../../images/cr-017.png"/></div>
      </div>
      <div  v-if="islogin" class="award-6" @click="awardGo()">立刻打赏</div>
      <div v-else="" @click="awardLogin" class="award-6">立刻登录</div>
      <div style="line-height: 1;color: red;text-align: center;margin-bottom: 0.5rem;" v-if="rewardMsg !=''">
        {{rewardMsg}}
      </div>
      <!--<div class="award-7">中奖后可在<span>"我的"-"果币"</span>中查看</div>-->
    </div>

      
    <div class="award-pop" @touchmove.prevent v-show="scratchAlertShow"></div>
    <div class="wx-alert-div" v-show="scratchAlertShow">
        <div class="wx-alert-title">
            <span>提示</span>
        </div>
        <div class="line-hr"></div>
        <div class="wx-alert-main">
            <p>您获得的优惠券已到账，赶快下载客户端使用吧！</p>
        </div>
        <div class="wx-alert-btn">
            <a href="javascript:void(0);" @click="closeCouponAlert">确认</a>
        </div>
    </div>

    <!--领奖弹窗-->
    <div class="award-pop" @touchmove.prevent v-if="isLjPopShow"></div>
    <div class="lj-alert-div" v-if="isLjPopShow">
      <div class="lj-top-div">
        <img src="../../images/lj-pop-top.png">
      </div>
      <div class="lj-close-div" @click="isLjPopShow = false">
        <img src="../../images/lj-pop-close.png">
      </div>
      <div class="lj-content-div">
        <div class="lj-content-phone">
          <input type="tel" maxlength="11" placeholder="请输入手机号码" v-model="ljPhone" />
        </div>
        <div class="lj-content-rule" v-if="ljRuleList!=null">
          <p>1、前{{ljRuleList.limit}}名登记领取成功的用户可最多免费领取话费10元；</p>
          <p>2、每个用户只能登记领取1次；</p>
          <p>3、领取时间仅限{{ljRuleList.endDate}}当天；</p>
          <p>4、登记领取成功后，话费将在1-3个工作日充值到账,您可在“中奖纪录”中查看进度；</p>
          <p>5、客服电话：4008518832。</p>
        </div>
        <div class="lj-btn-div" @click="ljPopSubmit">
          <img src="../../images/lj-pop-btn-bg.png">
          <p>登记领取</p>
        </div>
      </div>
    </div>

    <div class="release-bg" @touchmove.prevent v-if="isLjSuc"></div>
    <div class="release-tip" v-if="isLjSuc">
      <p style="font-size: 1rem;">提示</p>
      <p>恭喜您成功领取{{ljRuleList.bill}}元话费!</p>
      <a @click="ljSucClick">确定</a>
    </div>

  </div>
</template>

<script>
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {getStore, setStore} from 'src/config/mUtils'

  import {Loadmore,Toast,Indicator,MessageBox} from 'mint-ui';

  import {userAgent, isUserAgentIsFL, isUserAgentIsWX, isUserAgentIsZT, urlHost} from '../../service/userAgent'
  import {wxShare} from '../../service/wxShare'
  import {hex_md5} from '../../service/md5'

  import {
    getBanner,
    getActivity,
    userInfo,
    themeList,
    likeTheme,
    themeReward,
    awardTheme,
    loadListBottom,
    themeScratch,
    themeScratchCoupon,
    popCheck,
    popPrize,
    userIndex
  } from '../../service/getData'

  var gbcount = 1;
  var gbthemeId = 0;
  var isHot = 1;
  var md5Key = '6f374060aebf4d4f9a846337dd989c5a'

  var appCode = 'other_browser';
  var scUrl = 'other_browser'
  var signUrl = 'other_browser'

  export default {
    name: 'themeList',
    data(){
      return {
        commentData: {},
        userIcon: null, //用户头像
        items: [],
        todos: [],
        listDatas: [],
        listTypeDatas:[],
        dzDatas: [],
        dsDatas: [],
        bannerOption: {
          autoplay: 3000,
          direction: 'horizontal',
          autoplayDisableOnInteraction: false,
          pagination: '.swiper-pagination',
        },
        isshow: false,
        listNumber: 1,
        isCanvasShow: true,
        allLoaded: null,
        bottomStatus: null,
        commentsCount: null,
        pageIndex: 1,
        pageSize: 10,
        deviceId: null,
        isLikeNum: 2,
        rewardMsg: null,
        loginUserIcon: null,
        scratchResult:[],
        scratchResultIndex:[],
        scratchLoadingShow:false,
        scratchCouponShow:false,
        scratchAlertShow:false,
        islogin:false,
        isTabSelect: true,
        isShowTopTab: false,
        freshList: [],
        freshPageIndex: 1,
        freshPageSize: 10,
        jackpotCopy: '每打赏一个果币将得到一次获得奖池所有果币的机会，打赏越多，机会越大哦',
        personCopy: '每打赏一个果币对方将得到一个果币',
        copyUserType: 0,
        isShowLoading: true,
        isLjPopShow: false,
        ljPhone: '',
        isLjSuc: false,
        ljRuleList: null,
        isEffective: true
      }
    },
    activated(){
        //验证登录信息
        this.getUserIsLogin()

        var userId = getStore("_uuid");
        if(userId != null && userId != ''){
            this.islogin = true;
        }else{
            this.islogin = false;
        }

        var bbId = getStore('_bbid');
        if (bbId==null||bbId==''){
            this.browserUserInfo();
        }

        var userIconLocal = getStore("userIcon");
        if (userIconLocal != null && userIconLocal != '') {
            this.loginUserIcon = userIconLocal;
        }
        else {
            this.loginUserIcon = null;
        }

        var themeSimple = JSON.parse(getStore("themeSimple"));
        if(themeSimple != null){
//          var theme ;
          for(var i = 0;i<this.listDatas.length;i++){
            if(themeSimple.themeId == this.listDatas[i].themeId){
              if(themeSimple.behaviors != null){
                this.listDatas[i].behaviors = themeSimple.behaviors;
              }
              if(themeSimple.commentCount != null){
                this.listDatas[i].commentCount = themeSimple.commentCount;
              }
              if (themeSimple.likeCount != null) {
                this.listDatas[i].likeCount = themeSimple.likeCount;
              }
              if (themeSimple.rewardCount != null) {
                this.listDatas[i].rewardCount = themeSimple.rewardCount;
              }
            }
          }
          for(var i = 0;i<this.freshList.length;i++){
              if(themeSimple.themeId == this.freshList[i].themeId){
                  if(themeSimple.behaviors != null){
                      this.freshList[i].behaviors = themeSimple.behaviors;
                  }
                  if(themeSimple.commentCount != null){
                      this.freshList[i].commentCount = themeSimple.commentCount;
                  }
                  if (themeSimple.likeCount != null) {
                      this.freshList[i].likeCount = themeSimple.likeCount;
                  }
                  if (themeSimple.rewardCount != null) {
                      this.freshList[i].rewardCount = themeSimple.rewardCount;
                  }
              }
          }
        }
        this.indexScroll();

        this.scrollLoad();
    },
    created() {
      //验证登录信息
      this.getUserIsLogin()

      var urlPara = GetQueryString('appcode');
      if (urlPara!=null){
          appCode = urlPara;
      }
      urlPara = GetQueryString('sc');
      if (urlPara!=null){
          scUrl = urlPara
      }
      urlPara = GetQueryString('sign');
      if (urlPara!=null){
          signUrl = urlPara
      }

      this.browserUserInfo();
      var userId = getStore("_uuid");
      if(userId != null && userId != ''){
          this.islogin = true;
      }else{
          this.islogin = false;
      }
      this.deviceId = getStore("_bbid");
      let time = setInterval(() => {
          this.deviceId = getStore("_bbid");
          if (this.deviceId != null) {
              clearInterval(time)
              this.getThemeList()
              this.isLjPop()
          }
      }, 50)


      var str = window.location.href;
      str = str.substring(str.lastIndexOf("/") + 1);
      str = str.substring(str.lastIndexOf("#") + 1) + 'Scroll';
      localStorage.setItem(str, 0)
      var strFresh = window.location.href;
      strFresh = strFresh.substring(strFresh.lastIndexOf("/") + 1);
      strFresh = strFresh.substring(strFresh.lastIndexOf("#") + 1) + 'ScrollFresh';
      localStorage.setItem(strFresh, 0)

      this.scrollLoad();

      let isShare = true;
      let title = "我在圈子里看到了一件不得了的事情，快来围观！";
      let content = "圈子活动火爆来袭~";
      // let imageUrl = "http://filestore.zt.raiyi.com/fs/userIcon/79800.png";
      let imageUrl = "http://filestore.zt.raiyi.com/fs/icon/95828.png";
      let shareUrl = "http://hd.zt.raiyi.com/weibo/index?sc="+scUrl+"&sign="+signUrl;
      if (isUserAgentIsWX) {
          doWXShareInfo(title, content, imageUrl, shareUrl, isShare);
      }
    },
    mounted(){
      var userIconLocal = getStore("userIcon");
      if (userIconLocal != null && userIconLocal != '') {
        this.loginUserIcon = userIconLocal;
      }

      getBanner(appCode).then(res => {
        //console.log(res);
        this.items = res.data;
      });
      getActivity(appCode).then(json => {
        //console.log(json);
        this.todos = json.data;
      });
    },
    computed: {},
    methods: {
      getThemeList(){
          themeList(this.deviceId,appCode,'fresh').then(json => {
              this.freshList = json.data;
          });
          themeList(this.deviceId,appCode,'hot').then(json => {
              this.listDatas = json.data;
          }).catch(function (e) {
              //console.log(e)
              Toast({
                  message: '数据异常，请稍候再试',
                  duration: 2000
              })
          })
      },
      toPersonThemeList(userType,userAccount,userNickName,userIcon){
          var iconArr = new Array();
          iconArr = userIcon.split('/');
          userIcon = iconArr[iconArr.length-1]
          this.$router.push('/personThemeList/'+'1'+'/'+userType+'/'+userAccount+'/'+userNickName+'/'+userIcon);
      },
      browserUserInfo(){
        var local_bbid = getStore("_bbid");
        let validity = 30;
        let now = new Date();
        let browserId = getStore("_browserId");
        now.setTime(now.getTime() + validity * 24 * 60 * 60 * 1000);
        if (local_bbid != undefined && local_bbid != "" && local_bbid != null && local_bbid !== "[object HTMLInputElement]"
          && browserId != null && browserId != "") {
          document.cookie = "USER_BBID=" + local_bbid + ";path=/;expires=" + now.toGMTString();
        }
        else {
          userInfo().then(result => {
            //console.log(result);
            if (result && result.success) {
              local_bbid = result.data.bbid;
              var _uuid = result.data.uuid;
              localStorage.setItem("_bbid", local_bbid);
            } else if (result.code == "3003") {
              local_bbid = result.data.bbid;
              browserId = result.data.browserId; 
              localStorage.setItem("_bbid", local_bbid);
              localStorage.setItem("_browserId", browserId);
            }
          }).catch(function (e) {
              this.browserUserInfo()
          })
        }
      },
      listDataFun(themeid,copyUserType,isHotVal,auditStatus){
        if (auditStatus>=0) {
            this.isshow = !this.isshow;
            this.copyUserType = copyUserType;
            gbthemeId = themeid
            isHot = isHotVal
        }
        else {
            Toast({
                message: '暂未审核通过，无法打赏',
                duration: 2000
            });
        }
      },
      popNone(){
        this.isshow = false
        this.rewardMsg=null
      },
      awardNone2(){
        this.isshow = false
        this.rewardMsg=null
      },
      awardMinus(){
        this.listNumber--
        if (this.listNumber <= 1) {
          this.listNumber = 1
        }
        gbcount = this.listNumber

      },
      awardPlus(){
        this.listNumber++
        gbcount = this.listNumber
      },
      isHaveLike(behaviorsList){
        var isHave = false;
        if (behaviorsList != null) {
          for (var i = 0; i < behaviorsList.length; i++) {
            if (behaviorsList[i].behaviorType == 'LIKE' && behaviorsList[i].behaviorValue == '1') {
              isHave = true;
            }
          }
        }
        return isHave;
      },
      likeData(pice, themeId, like){
        if (like == 1) {
          like = 2;
        }
        else {
          like = 1;
        }
        var _self = this;

        //页面优先展示点赞效果
        var LikeObj = {"":"LIKE","behaviorValue":'1'};
        var LikeArr = [{"behaviorType":"LIKE","behaviorValue":'1'}];

        if (like == 1) {
            pice = pice + 1;
        } else {
            pice = pice - 1;
        }
        for (var i = 0; i < _self.listDatas.length; i++) {
            if (_self.listDatas[i].themeId == themeId) {
                if (_self.listDatas[i].behaviors != null) {
                    //判断behaviorType是否存在LIKE
                    var isHaveLikeItem = true;
                    for (var j = 0; j < _self.listDatas[i].behaviors.length; j++) {
                        if (_self.listDatas[i].behaviors[j].behaviorType == 'LIKE') {
                            isHaveLikeItem = false;
                            _self.listDatas[i].behaviors[j].behaviorValue = like;
                        }
                    }
                    if (isHaveLikeItem) {
                        _self.listDatas[i].behaviors.push(LikeObj);
                    }
                }
                else {
                    _self.listDatas[i].behaviors = LikeArr;
                }
                _self.listDatas[i].likeCount = pice;
            }
        }

        likeTheme(this.deviceId,themeId,like,appCode).then(json=>{
            //console.log(json);
            if (json.code == "0000") {
            }
          });
      },
      freshLikeData(pice, themeId, like, auditStatus){
          if (auditStatus>=0) {
              if (like == 1) {
                  like = 2;
              }
              else {
                  like = 1;
              }
              var _self = this;

              //页面优先展示点赞效果
              var LikeObj = {"behaviorType": "LIKE", "behaviorValue": '1'};
              var LikeArr = [{"behaviorType": "LIKE", "behaviorValue": '1'}];

              if (like == 1) {
                  pice = pice + 1;
              } else {
                  pice = pice - 1;
              }
              for (var i = 0; i < _self.freshList.length; i++) {
                  if (_self.freshList[i].themeId == themeId) {
                      if (_self.freshList[i].behaviors != null) {
                          //判断behaviorType是否存在LIKE
                          var isHaveLikeItem = true;
                          for (var j = 0; j < _self.freshList[i].behaviors.length; j++) {
                              if (_self.freshList[i].behaviors[j].behaviorType == 'LIKE') {
                                  isHaveLikeItem = false;
                                  _self.freshList[i].behaviors[j].behaviorValue = like;
                              }
                          }
                          if (isHaveLikeItem) {
                              _self.freshList[i].behaviors.push(LikeObj);
                          }
                      }
                      else {
                          _self.freshList[i].behaviors = LikeArr;
                      }
                      _self.freshList[i].likeCount = pice;
                  }
              }

              likeTheme(this.deviceId, themeId, like, appCode).then(json => {
                  //console.log(json);
                  if (json.code == "0000") {
                  }
              });
          }
          else {
              Toast({
                  message: '暂未审核通过，无法点赞',
                  duration: 2000
              });
          }
      },
      toggle(){
        this.isCanvasShow = !this.isCanvasShow;
      },
      isHaveReward(behaviorsList){
        var isHave = false;
        if (behaviorsList != null) {
          if (!(behaviorsList.hasOwnProperty('REWARD'))) {
            isHave = true;
          }
          for (var i = 0; i < behaviorsList.length; i++) {
            if (behaviorsList[i].behaviorType == 'REWARD') {
              isHave = false;
            }
          }
        }
        return isHave;
      },
      HaveReward(behaviorsList){
        var isHave = false;
        if (behaviorsList != null) {
          for (var i = 0; i < behaviorsList.length; i++) {
            if (behaviorsList[i].behaviorType == 'REWARD') {
              isHave = true;
            }
          }
        }
        return isHave;
      },
      awardGo(){
        var _self = this;
//        var commentId = _self.commentId;
        var userId = getStore('_uuid');
        if (userId!=null && userId!='') {
            awardTheme(this.deviceId, gbthemeId, gbcount,appCode)
                .then(json => {
                    //console.log(json);
                    if (json.code == '0000') {
                        _self.isshow = false;
                        if (isHot == 1) {
                            for (var i = 0; i < _self.listDatas.length; i++) {
                                if (_self.listDatas[i].themeId == gbthemeId) {
                                    _self.listDatas[i].behaviors = json.data.behaviors;
                                    _self.listDatas[i].rewardCount = gbcount + _self.listDatas[i].rewardCount;
                                }
                            }
                        }
                        else{
                            for (var i = 0; i < _self.freshList.length; i++) {
                                if (_self.freshList[i].themeId == gbthemeId) {
                                    _self.freshList[i].behaviors = json.data.behaviors;
                                    _self.freshList[i].rewardCount = gbcount + _self.freshList[i].rewardCount;
                                }
                            }
                        }
                        _self.listNumber = 1;
                    } else if (json.code == '3003') {
                        this.$router.push('/login_reward');
                    }
                    else {
                        this.rewardMsg = json.msg;
                    }
                })
        }
        else {
            this.$router.push('/login_reward');
        }
      },
      countTime(item){
        let curentTime = new Date()
        let showTime = new Date(item);
        let day = showTime.getDate();
        let month = showTime.getMonth() + 1;
        let year = showTime.getFullYear();
        let hour = showTime.getHours();
        let min = showTime.getMinutes();

        if (month < 10) {
          month = '0' + month;
        }
        if (day < 10) {
          day = '0' + day;
        }
        if (hour < 10) {
          hour = '0' + hour;
        }
        if (min < 10) {
          min = '0' + min;
        }

        let lastShowTime = '';

        if (curentTime.getFullYear() - year > 0) {
          lastShowTime += year + '-';
        }
        if (curentTime.getDate() - day > 0 || curentTime.getMonth() + 1 - month != 0) {
          lastShowTime += month + '-' + day + ' ';
        }
        lastShowTime += hour + ':' + min;

        return lastShowTime;
      },
      scrollLoad(){
        let _this = this;
        window.onscroll = function () {

          var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
          var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
          var innerHeight = window.innerHeight;

          if (_this.isTabSelect) {
              var str = window.location.href;
              str = str.substring(str.lastIndexOf("/") + 1);
              str = str.substring(str.lastIndexOf("#") + 1) + 'Scroll';
              localStorage.setItem(str, scrollTop)
          }
          else {
              var str = window.location.href;
              str = str.substring(str.lastIndexOf("/") + 1);
              str = str.substring(str.lastIndexOf("#") + 1) + 'ScrollFresh';
              localStorage.setItem(str, scrollTop)
          }

          if (scrollTop+20>=(document.getElementById('topBanner').offsetHeight+document.getElementById('indexTopTab').offsetHeight)){
              _this.isShowTopTab = true;
          }
          else {
              _this.isShowTopTab = false;
          }


          if (scrollTop + innerHeight >= (htmlHeight-1) && innerHeight < htmlHeight) {
            _this.isShowLoading = true
            var tag = 'hot'
            if (_this.isTabSelect && _this.listDatas.length >= (_this.pageIndex*_this.pageSize)) {
                tag = 'hot'
                _this.pageIndex += 1;
                loadListBottom(_this.deviceId, _this.pageIndex, _this.pageSize, appCode, tag).then(json => {
                    if (json.code=='0000') {
                        if (json.data != null) {
                            for (var i = 0; i < json.data.length; i++) {
                                _this.listDatas.push(json.data[i]);
                            }
                        }
                        else {
                            _this.isShowLoading = false
                        }
                    }
                });
            }
            else if (_this.isTabSelect && _this.listDatas.length < (_this.pageIndex*_this.pageSize)){
                //_this.isShowLoading = false
            }
            else if (!_this.isTabSelect && _this.freshList.length >= (_this.freshPageIndex*_this.freshPageSize)) {
                tag = 'fresh'
                _this.freshPageIndex += 1;
                loadListBottom(_this.deviceId, _this.freshPageIndex, _this.freshPageSize, appCode, tag).then(json => {
                    if (json.code=='0000') {
                        if (json.data != null) {
                            for (var i = 0; i < json.data.length; i++) {
                                _this.freshList.push(json.data[i]);
                            }
                        }
                        else {
                            _this.isShowLoading = false
                        }
                    }
                });
            }
            else if (!_this.isTabSelect && _this.freshList.length < (_this.freshPageIndex*_this.freshPageSize)){
                _this.isShowLoading = false
            }
          }
        };
      },
      awardLogin(){
        this.$router.push('/login_reward');
      },
      loginOrAccount(){
          var userId = getStore('_uuid');
          if (userId == null || userId == ''){
              this.$router.push('/login');
          }
          else {
              this.$router.push('/account');
          }
      },
      loginOrRelease(){
          var userId = getStore('_uuid');
          if (userId == null || userId == ''){
              this.$router.push('/login');
          }
          else {
              this.$router.push('/release');
          }
      },
      indexScroll(){
          if (this.isTabSelect) {
              var str = window.location.href;
              str = str.substring(str.lastIndexOf("/") + 1);
              str = str.substring(str.lastIndexOf("#") + 1) + 'Scroll';
              var listScroll = getStore(str);
              document.body.scrollTop = listScroll;
          }
          else {
              var str = window.location.href;
              str = str.substring(str.lastIndexOf("/") + 1);
              str = str.substring(str.lastIndexOf("#") + 1) + 'ScrollFresh';
              var listScroll = getStore(str);
              document.body.scrollTop = listScroll;
          }
      },
      scratchFun(curId){
          var _this = this;
          var userId = getStore('_uuid');
          this.scratchLoadingShow=true;
          themeScratch(this.deviceId).then(res=>{
              //console.log(res);
              if (res.code=='0000'){

//                  for (var i=0;i<_this.listDatas.length;i++){
//                      if(_this.listDatas[i].themeId == curId){
//                          _this.listDatas[curId].scratchList = res.data;
//                      }
//                  }
                  if (_this.isTabSelect) {
                      _this.listDatas[curId].scratchList = res.data;
                  }
                  else {
                      _this.freshList[curId].scratchList = res.data;
                  }
                  //console.log(_this.listDatas)

                  //_this.scratchResult = res.data;
                  this.scratchLoadingShow=false;

                  //微信分享
                  if (isUserAgentIsWX) {
                      doWXShareInfo(res.data.shareTitle, res.data.shareContent, res.data.shareImage, res.data.shareUrl, res.data.isShare==1?true:false);
                  }
              }
          });
      },
      getCouponFun(recordId,curIndex){
          var _this = this;
          var userId = getStore('_uuid');
          //console.log(userId)
          if (userId != null) {
              this.scratchLoadingShow = true;
              themeScratchCoupon(this.deviceId,recordId).then(res => {
                  //console.log(res);
                  if (res.code == '0000') {
                      Toast({
                          message: '领取成功',
                          duration: 2000
                      });
                      this.scratchLoadingShow = false;
                      if (this.isTabSelect) {
                          this.listDatas[curIndex].scratchCouponShow = true;
                      }
                      else {
                          this.freshList[curIndex].scratchCouponShow = true;
                      }
                      this.scratchCouponShow = true;
                  }
                  else{
                      Toast({
                          message: res.msg,
                          duration: 2000
                      });
                      this.scratchLoadingShow = false;
                  }
              })
          }
          else {
              this.$router.push('/login');
          }
      },
      selectCouponFun(){
          //this.scratchAlertShow = true;
          this.$router.push('/couponList');
      },
      closeCouponAlert(){
          this.scratchAlertShow = false;
          location.href="http://wap.zt.raiyi.com/download/common?channel=TG006";
      },
      tabChange(changeType){
          if (changeType != 1) {
              this.isTabSelect = true;

              var str = window.location.href;
              str = str.substring(str.lastIndexOf("/") + 1);
              str = str.substring(str.lastIndexOf("#")+1) + 'Scroll';
              var listScroll = getStore(str);
              document.body.scrollTop=listScroll;
              this.isShowLoading = true
          }
          else if (changeType != 0){
              this.isTabSelect = false;

              var str = window.location.href;
              str = str.substring(str.lastIndexOf("/") + 1);
              str = str.substring(str.lastIndexOf("#")+1) + 'ScrollFresh';
              var listScroll = getStore(str);
              document.body.scrollTop=listScroll;
              this.isShowLoading = false
          }
      },
      isLjPop(){
          var casId = getStore('casId')
          popCheck(this.deviceId,scUrl,appCode,signUrl,casId).then(res => {
              //console.log(res)
              if (res.code == '0000'){
                  this.ljRuleList = res.data
                  this.isLjPopShow = true
              }
              else if (res.code != '3025' && res.code != '3026' && res.code != '1003' && res.code != '2002') {
//                  Toast({
//                      message: res.msg,
//                      duration: 2000
//                  })
              }
          }).catch(function (e) {
              //console.log(e)
              Toast({
                  message: '数据异常，请稍候再试',
                  duration: 2000
              })
          })
      },
      checkMobile(){
          var toMobile = this.ljPhone
          var regMobile = /^1[3|4|5|6|7|8|9][0-9]{1}[0-9]{8}$/;
          if (!toMobile || !regMobile.test(toMobile)) {
              Toast({
                  message: '请输入正确的手机号',
                  duration: 4000
              });
              return false
          }
          return true
      },
      ljPopSubmit(){
          if (this.checkMobile()){
              MessageBox.confirm('确认为('+this.ljPhone+')领取吗?').then(action => {
                  Indicator.open({ spinnerType: 'fading-circle' });
                  var casId = getStore('casId')

                  var myDate = new Date();
                  var day = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate()
                  var month = (myDate.getMonth()+1)<10?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1)
                  var year = myDate.getFullYear()
                  var date = year+month+day
                  var md5Value=hex_md5(this.ljPhone+date+md5Key);

                  popPrize(this.deviceId, scUrl, appCode, md5Value, this.ljPhone,casId).then(res => {
                      //console.log(res)
                      Indicator.close();
                      if (res.code == '0000') {
                          this.isLjPopShow = false
                          this.isLjSuc = true
                      }
                      else if (res.code == '3025'){
                          this.isLjPopShow = false
                          Toast({
                              message: res.msg,
                              duration: 4000
                          })
                      }
                      else {
                          Toast({
                              message: res.msg,
                              duration: 4000
                          })
                      }
                  }).catch(function (e) {
                      //console.log(e)
                      Indicator.close();
                      Toast({
                          message: '数据异常，请稍候再试',
                          duration: 2000
                      });
                  })
              })
          }
      },
      ljSucClick(){
          this.isLjSuc = false
      },
      getUserIsLogin(){
          var localDate = Date.parse(new Date());
          this.deviceId = getStore('_bbid');
          var userId = getStore('_uuid');
          if (this.deviceId != null && userId != null) {
              userIndex(this.deviceId, localDate).then(res => {
                  //console.log(res)
                  if (res.code != '0000') {
                      Toast({
                          message: '登录信息已失效，请重新登录',
                          duration: 4000
                      })

                      this.isEffective = false

                      this.islogin = false
                  }
                  else {
                      this.isEffective = true
                  }
              })
          }
      }
    },
    components: {
      swiper,
      swiperSlide,
      Loadmore
    },

  }
</script>

<style scoped>
  body{
    background-color: #f2f2f2;
  }

  .banner {
    background: #f2f2f2;
  }

  .img2 {
    width: 100%;
    display: block;
  }

  .activity-btn {
    display: -webkit-flex;
    display: flex;
    background: #fff;
    padding: 0.2rem 0;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    position:relative;
  }

  .activity-btn:after{
    position: absolute;
    content: '';
    width: 100%;
    left: 0;
    bottom: 0;
    height: 1px;
    background-color: #d3d3d3;
    -webkit-transform: scale(1,0.5);
    transform: scale(1,0.5);
    -webkit-transform-origin: center bottom;
    transform-origin: center bottom;
  }

  .activity-btn a {
    /*width: 30%;*/
    padding: 0.5rem;
    text-align: center;
    border-radius: 0.3rem;
    margin: 0.6rem 0.5rem;
    flex: 1;
  }

  .activity-btn a:nth-child(1) {
    background: #27ccbb;
  }

  .activity-btn a:nth-child(2) {
    background: #ffc34b;
      margin: 0.6rem 0;
  }

  .activity-btn a:nth-child(3) {
    background: #8c83ff;
  }

  .activity-btn-icon{
    height:1.3rem;
  }

  .activity-btn-icon img {
    height: 100%;
    display: block;
    margin: 0 auto;
  }

  .activity-btn-name {
    color: #fff;
    text-align: center;
    font-size: 0.8rem;
    margin-top: 0.3rem;
  }

  /*个人头像*/
  .headerFix {
    position: fixed;
    bottom: 10%;
    right: 2%;
    z-index: 9;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    overflow: hidden;
    box-shadow: 0 0 0.3rem #666;
  }

  .headerFix img {
    width: 100%;
  }

  .con {
    background: #fff;
    padding: 0.8rem;
    position: relative;
  }

  .con:before{
    position: absolute;
    content: '';
    width: 100%;
    left: 0;
    top: 0;
    height: 1px;
    background-color: #d3d3d3;
    -webkit-transform: scale(1,0.5);
    transform: scale(1,0.5);
    -webkit-transform-origin: center bottom;
    transform-origin: center bottom;
  }

  .con:after{
    position: absolute;
    content: '';
    width: 100%;
    left: 0;
    bottom: 0;
    height: 1px;
    background-color: #d3d3d3;
    -webkit-transform: scale(1,0.5);
    transform: scale(1,0.5);
    -webkit-transform-origin: center bottom;
    transform-origin: center bottom;
  }

  .con-top a {
    display: inline-block;
    width: 2.7rem;
    height: 2.7rem;
    border-radius: 50%;
    vertical-align: middle;
    overflow: hidden;
  }

  .con-top a img {
    width: 100%;
    height: 100%;
    background-color: #ddd;
  }

  .con-top-p {
    display: inline-block;
    width: 80%;
    padding-left: 0.4rem;
    vertical-align: middle;
  }

  .con-top-p1 {
    color: #536792;
    font-weight: bold;
    font-size: 0.85rem;
    padding-bottom: 0.2rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .con-top-p2 {
    color: #afafaf;
    font-size: 0.7rem;
  }

  .con-tit {
    font-size: 0.8rem;
    padding: 0.5rem 0;
    text-align: justify;
  }

  .con-tit .con-tit-span1 {
    word-break: break-all;
    color: #333;
  }

  .con-tit-span2 {
    color: #5a6d96;
  }

  .con-tit-point{
    color: #5a6d96;
  }

  .con-img-1 img {
    width: 100%
  }

  .con-img-2 {
    /*display: -webkit-flex;*/
    /*display: flex;*/
    /*justify-content: space-between;*/
    position: relative;
    overflow: hidden;
  }

  .con-img-a {
    width: 32%;
  }

  .con-img-a img {
    width: 100%;
    display: block;
  }

  .con-img-num {
    position: absolute;
    z-index: 2;
    right: 0;
    bottom: 0;
    background: rgba(1, 1, 1, .7);
    color: #fff;
    padding: 0.2rem 0.6rem;
    font-size: 0.7rem;
  }

  .con-talk {
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
    background: #fff;
    padding: 0.6rem 0;
    position: relative;
  }
  .con-talk:after{
    position: absolute;
    content: '';
    width: 100%;
    left: 0;
    bottom: 0;
    height: 1px;
    background-color: #d3d3d3;
    -webkit-transform: scale(1,0.5);
    transform: scale(1,0.5);
    -webkit-transform-origin: center bottom;
    transform-origin: center bottom;
  }

  .con-talk span {
    width: 33.3333%;
    text-align: center;
    font-size: 0;
  }

  .con-talk-aImg {
    display: inline-block;
    vertical-align: middle;
  }
  .con-talk-aImg img{
    width: 0.8rem;
    display: block;
  }

  .con-talk span img {
    display: inline-block;
    vertical-align: middle;
    width: .8rem;
  }

  .con-talk span i {
    vertical-align: middle;
    font-style: normal;
    font-size: 0.8rem;
    padding-left: 0.5rem;
    color: #787878;
  }

  .con-talk span:nth-of-type(2) {
    position: relative;
  }

  .con-talk span:nth-of-type(2):before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: #d3d3d3;
    -webkit-transform: scale(0.5,1);
    transform: scale(0.5,1);
  }

  .con-talk span:nth-of-type(2):after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: #d3d3d3;
    -webkit-transform: scale(0.5,1);
    transform: scale(0.5,1);
  }

  .message-talk-top {
    overflow: hidden;
    padding: 0.9rem 0.8rem 0 0.8rem;
    background: #fff;
  }

  .message-top-header {
    float: left;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    overflow: hidden;
  }

  .message-top-header img {
    width: 100%;
    position: relative;
  }

  .message-top-name {
    float: left;
    padding-left: 0.4rem;
    width: 38%;
  }

  .message-top-name-p1 {
    color: #536792;
    font-size: 0.9rem;
    padding-bottom: 0.3rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .message-top-name-p2 {
    color: #afafaf;
    font-size: 0.85rem;
  }

  .message-top-shop {
    text-align: right;
    padding-top: 0.5rem;
  }

  .message-top-shop a {
    display: inline-block;
    margin-left: 1rem;
  }

  .message-top-shop a:first-child {
    margin-left: 0;
  }

  .message-top-shop a img {
    width: 0.9rem;
    display: inline-block;
    vertical-align: middle;
  }

  .message-top-shop a span {
    vertical-align: middle;
    color: #838383;
    padding-left: 0.3rem;
  }

  .message-talk-tit {
    font-size: 0.9rem;
    padding: 0.3rem 0.8rem 0.8rem 4rem;
    position: relative;
  }

  .message-talk-tit span {
    color: #536792;
  }

  .message-talk-tit:before {
    content: '';
    position: absolute;
    height: 1px;
    background: #e5e5e5;
    width: 100%;
    bottom: 0;
    right: 0;
  }

  .comment {
    margin-bottom: 0.5rem;
  }

  .message-talk-reply {
    background: #fff;
    font-size: 0.9rem;
    padding: 0.3rem 0.8rem 0.8rem 4rem;
    border-bottom: 1px solid #e5e5e5;
  }

  .message-talk-reply b {
    font-weight: 500;
    color: #536792;
  }

  /*打赏弹窗*/
  .award-pop {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 99;
    background: rgba(1, 1, 1, .5);
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    max-width: 720px;
  }

  .award-tc {
    background: #fff;
    border-radius: 6px;
    position: fixed;
    padding: 0.8rem;
    width: 80%;
    top: 25%;
    max-width: 720px;
    z-index: 100;
    right: 0;
    left: 0;
    margin: auto;
    font-size: 0.8rem;
  }

  .award-1 {
    position: absolute;
    top: -1.5rem;
    left: 0;
    right: 0;
    margin: auto;
    width: 3rem;
  }

  .award-1 img {
    width: 100%;
  }

  .award-2 {
    position: absolute;
    top: 0.2rem;
    right: 0.4rem;
    width: 1.5rem;
    padding: 0.4rem;
  }

  .award-2 img {
    width: 100%;
  }

  .award-3 {
    padding: 1.2rem 0 0.5rem 0;
    font-size: 0.9rem;
    text-align: center;
  }

  .award-4 {
    padding: 0 0.2rem 0.8rem 0.2rem;
    text-align: center;
    color: #9f9f9f;
  }

  .award-5 {
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .award-minus {
    float: left;
    width: 25%;
    text-align: center;
    border: 1px solid #e5e5e5;
    line-height: 2.2rem;
    border-radius: 10rem 0 0 10rem;
  }

  .award-minus img {
    display: inline-block;
    vertical-align: middle;
    width: 0.8rem;
  }

  .award-money {
    float: left;
    width: 39%;
    text-align: center;
    border: 1px solid #e5e5e5;
    line-height: 2.2rem;
    font-size: 0.9rem;
    color: #ff1400;
    margin: 0 4%;
  }

  .award-plus {
    float: left;
    width: 25%;
    text-align: center;
    border: 1px solid #e5e5e5;
    line-height: 2.2rem;
    border-radius: 0 10rem 10rem 0;
  }

  .award-plus img {
    display: inline-block;
    vertical-align: middle;
    width: 0.8rem;
  }

  .award-6 {
    background: #1cbafb;
    color: #fff;
    margin: 1rem 0.5rem 1rem 0.5rem;
    border-radius: 30rem;
    text-align: center;
    padding: 0.6rem 0;
    font-size: 0.9rem;
  }

  .award-6:active {
    background: #178ebe;
  }

  .award-7 {
    text-align: center;
    color: #9f9f9f;
  }

  .award-7 span {
    color: #1cbafb;
  }

  canvas {
    max-width: 720px;
  }

  .award {
    margin: 0 auto;
    text-align: center;
    position: relative;
  }

  .blowCardDsec-img {
    margin: auto;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: 130px;
  }

  .blowCardBtnDiv {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    padding-top: 1.2rem;
  }

  .descFonts {
    color: #fc4f2c;
    font-size: 1rem;
    font-weight: bold;
    padding-bottom: 0.8rem;
  }

  .blowCardBtn {
    background: #fc4f2c;
    border: 0;
    color: #fff;
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
  }

  .con-img-2 .con-show-img:nth-child(3n+2){
    margin: 0 2%;
  }

  .con-show-img {
    height: 6rem;
    overflow: hidden;
    float: left;
    position: relative;
  }

  .con-show-img img {
    min-height: 100%;
    object-fit: cover;
    background-color: #ddd;
  }

  .gif-flag{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 45% !important;
      height: auto !important;
      min-height: initial !important;
      object-fit: initial !important;
      background-color: transparent !important;
  }

  .page-loadmore .mint-spinner {
    display: inline-block;
    vertical-align: middle;
  }

  .page-loadmore-desc {
    text-align: center;
    color: #666;
    padding-bottom: 5px;
  }

  .page-loadmore-desc:last-of-type {
    border-bottom: solid 1px #eee;
  }

  .page-loadmore-listitem {
    height: 50px;
    line-height: 50px;
    border-bottom: solid 1px #eee;
    text-align: center;
  }

  .page-loadmore-listitem:first-child {
    border-top: solid 1px #eee;
  }

  .page-loadmore-wrapper {
    overflow: scroll;
  }

  .mint-loadmore-bottom span {
    display: inline-block;
    -webkit-transition: .2s linear;
    transition: .2s linear;
    vertical-align: middle
  }

  .mint-loadmore-bottom span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }



/*Loading*/

.hcircle-wait{
  padding:0.3rem 0 0.8rem;
  text-align: center;
  margin:0 auto;
  /*background: #fff;*/
}

.hcircle-wait p{
  font-size: 0.7rem;
  color: #bebebe;
}

.Hing-span:last-child{
    margin-right: 0px;
}
.Hing-help{
    display: inline-block;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px #333 solid;
    border-radius: 50%;
    -webkit-animation: rotation 1s ease-in-out infinite;
       -moz-animation: rotation 1s ease-in-out infinite;
            animation: rotation 1s ease-in-out infinite;
}
.Hing-help:after{
    width: 5px;
    height: 5px;
    background:#666;
    border-radius: 100%;
    position: absolute;
    content: "";
}
@-webkit-keyframes rotation{
    0%{-webkit-transform: rotate(0deg);}
    100%{-webkit-transform: rotate(360deg);}
}
@-moz-keyframes rotation{
    0%{-moz-transform: rotate(0deg);}
    100%{-moz-transform: rotate(360deg);}
}
@keyframes rotation{
    0%{transform: rotate(0deg);}
    100%{transform: rotate(360deg);}
}

.loading-wrapper{
  animation: rotation 1s ease-in-out infinite;
  width: 2rem;
  height: 2rem;
  margin: 0 auto;
}

.loading-wrapper img{
  width: 100%;
  height: 100%;
}


  .scratch-wrapper{
    background-color: #ff5b3f;
    padding-top: 0.4rem;
    box-sizing: border-box;
  }

  .scratch-bg{
    width: 100%;
    position: relative;
    min-height: 8rem;
  }

  .scratch-bg img{
    width: 100%;
  }

  .scratch-txt-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .scratch-txt-wrapper>div{
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
  }

  .scratch-txt{
    font-size: 1rem;
    color: #ff5b3f;
    text-align: center;
    margin-bottom: 0.3rem;
  }

  .scratch-result-btn{
    background: #fc4f2c;
    border: 0;
    color: #fff;
    font-size: 0.9rem;
    padding: 0.4rem 1.2rem;
    line-height: 1;
    border-radius: 0.2rem;
    display: inline-block;
  }

  .scratch-result-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .scratch-result-wrapper>div{
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
  }

  .scratch-result-name{
    color: #ff5b3f;
    line-height: 1;
  }

  .scratch-result-desc{
    color: #ff5b3f;
    font-size: 0.7rem;
    margin: 0.3rem 0;
    line-height: 1;
  }

  .scratch-loading-wrapper{
    position: absolute;
    top: -0.4rem;
    left: 0;
    width: 100%;
    height: 105%;
    text-align: center;
    z-index: 2;
    background: rgba(0,0,0,0.7);
  }

  .scratch-loading-wrapper>div{
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
  }

  .scratch-loading-wrapper .hcircle-wait{
    background: transparent;
  }

  .scratch-result-share{
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    color: #ff5b3f;
    font-size: 0.8rem;
    text-align: center;
    width: 2rem;
    line-height: 1.4rem;
  }

  /*弹窗 begin*/
  .wx-alert-div{
      position: fixed;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      background: #fff;
      border-radius: 0.2rem;
      padding: 0.5rem 0.5rem 1rem;
      box-sizing: border-box;
      width: 70%;
      min-width: 210px;
      max-width: 500px;
      z-index: 99;
  }

  .wx-alert-close img{
      width: 100%;
  }

  .wx-alert-title{
      font-size: 1rem;
      color: #1b1b1b;
      text-align: center;
      margin: 0.6rem 0;
  }

  .wx-alert-main{
      color: #484848;
      text-align: center;
      width: 90%;
      margin: 1rem auto;
      font-size: 0.8rem;
  }

  .wx-alert-btn{
      text-align: center;
  }

  .wx-alert-btn a{
      color: #fff;
      background: #1cbafb;
      text-align: center;
      border-radius: 9999px;
      width: 7rem;
      line-height: 2rem;
      display: inline-block;
  }

  .wx-alert-tip{
      position: fixed;
      top: 50%;
      left: 50%;
      -webkit-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
      background: #fff;
      border: 1px solid #00bbec;
      border-radius: 0.2rem;
      width: 50%;
      min-width: 150px;
      max-width: 360px;
      padding: 1rem;
      text-align: center;
      z-index: 98;
  }

  .line-hr {
      border: 0;
      width: 100%;
      height: 1px;
      background: #e5e5e5;
  }
  /*弹窗 end*/

  .swiper-container-horizontal > .swiper-pagination-bullets{
      bottom: 0.1rem;
  }



  .top-bg-div{
    background-color: rgba(0,0,0,0.4);
    overflow: hidden;
    padding: 0.3rem 0.5rem;
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
  }

  .top-header-div{
    width: 1.6rem;
    height: 1.6rem;
    border: 0.1rem solid #fff;
    border-radius: 9999px;
    overflow: hidden;
  }

  .top-header-div img{
    width: 100%;
  }

  .top-release-div{
    height: 1rem;
    margin-top: 0.2rem;
  }

  .top-release-div img{
    height: 100%;
  }

  .top-tab-div{
    width: 17.4rem;
    font-size: 0;
    text-align: center;
  }

  .top-tab{
    display: inline-block;
    font-size: 0.8rem;
    color: #fff;
    width: 3rem;
    text-align: center;
    line-height: 1.6rem;
    box-sizing: border-box;
  }

  .top-tab-active{
    position: relative;
    color: #fff100;
  }
  .top-tab-active:after{
    content: '';
    background-color: #fff100;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 70%;
    height: 0.1rem;
  }

  .index-tab-div{
    padding: 0.5rem;
    overflow: hidden;
    font-size: 0;
  }

  .index-tab{
    display: inline-block;
    font-size: 0.8rem;
    color: #7e7e7e;
    width: 50%;
    text-align: center;
    background-color: #fff;
    line-height: 2rem;
    border: 1px solid #e7e7e7;
    box-sizing: border-box;
  }

  .index-tab-div .index-tab:first-child{
    border-top-left-radius: 0.2rem;
    border-bottom-left-radius: 0.2rem;
    border-right: 0;
  }
  .index-tab-div .index-tab:last-child{
    border-top-right-radius: 0.2rem;
    border-bottom-right-radius: 0.2rem;
    border-left: 0;
  }

  .index-tab-active{
    background-color: #00a0e9;
    color: #fff;
  }


  /*领奖弹窗*/
  .lj-alert-div{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    z-index: 100;
  }

  .lj-content-div{
    position: relative;
    background-color: #fff;
    border-radius: 0.5rem;
    padding: 3rem 1.5rem 0.5rem;
    width: 80%;
    margin: 0 auto;
  }

  .lj-top-div{
    position: absolute;
    top: -5.2rem;
    left: 0;
    width: 97%;
    z-index: 101;
  }

  .lj-top-div img{
    width: 100%;
  }

  .lj-close-div{
    position: absolute;
    top: -5rem;
    right: 2rem;
    width: 2.2rem;
    z-index: 102;
  }

  .lj-close-div img{
    width: 100%;
  }

  .lj-content-phone input{
    -webkit-appearance: none;
    font-size: 1rem;
    color: #353535;
    line-height: 1;
    padding: 0.3rem 0;
    border-bottom: 1px solid #e9e9e9;
    width: 100%;
  }

  .lj-content-rule{
    color: #8a8a8a;
    font-size: 0.7rem;
    margin: 0.5rem 0;
    line-height: 1rem;
  }

  .lj-btn-div{
    position: relative;
    color: #bc4911;
    font-size: 1.1rem;
    width: 90%;
    margin: 1rem auto 0;
  }

  .lj-btn-div img{
    width: 100%;
  }

  .lj-btn-div p{
    position: absolute;
    top: 46%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    text-align: center;
  }

  /*领取成功弹窗*/
  .release-bg{
    width: 100%;
    background: rgba(1,1,1,.5);
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .release-tip{
    width:80%;
    background:#fff;
    border-radius: 4px;
    padding:1rem;
    position: fixed;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    margin:auto;
    z-index:100;
    font-size:0.9rem;
  }
  .release-tip p{
    text-align: center;
    margin-bottom:1rem;
  }
  .release-tip a{
    font-size:1rem;
    display: block;
    line-height: 2.6rem;
    background: rgba(28,186,251,1);
    border-radius: 4px;
    text-align: center;
    color:#fff;
  }
</style>
