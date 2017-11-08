<template>
  <div>
    <div v-if="false" class="Hreset-cen"></div>
    <div v-if="false" class="Hreset-fixed">
      <h2 class="Hreset-fixed-h2">
        个人信息

        <router-link to="/themeList">
        <a class="Hreset-fixed-back">
          <img src="../../images/goback.png">
          <span>返回</span>
        </a>
        </router-link>
      </h2>
    </div>
    <div class="head">

      <div class="Hd-sign-in">
        <a @click="signMe">
          <img src="../../images/cr-037.png"/>
          <span v-if="Hdqd">签到</span>
          <span v-else="">签到</span>
        </a>
      </div>
      <div class="a_headImg">
        <img :src="userIcon">
      </div>
      <div class="personDetail">
        <p class="personDetail-p1">{{userInfo.nickName}}</p>
        <p class="personDetail-p2">{{userInfo.mobile}}</p>
        <p class="personDetail-p3">
          <span class="person-apple-money">果币：</span>
          <span class="person-apple-num">{{gb.total}}</span>
          <span class="person-red-circle"></span>
        </p>
      </div>


      <div class="wave">
        <img src="../../images/cr-0119.png"/>
      </div>
    </div>

    <div class="dbjl" @click="toPersonThemeList">
      <div class="dbLeft">
        <img src="../../images/icon_ptl.png">
        <span>我的圈子 </span>
      </div>
    </div>
    <div class="dbjl" @click="toCouponList">
      <div class="dbLeft">
        <img src="../../images/my_yhq.png">
        <span>我的优惠券 </span>
      </div>
    </div>
    <div class="dbjl" @click="dbRecordsGo">
      <div class="dbLeft">
        <img src="../../images/cr-020.png">
        <span>夺宝记录 </span>
      </div>
      <div class="dbRight">
        <p v-show="dbExist" class="dbRight-p2">
          <span>3笔记录进行中</span>
          <img src="../../images/cr-023.png"/>
        </p>
      </div>
    </div>
    <div class="dbjl" @click="toWinningRecord">
      <div class="dbLeft">
        <img src="../../images/icon_wr.png">
        <span>中奖记录 </span>
      </div>
    </div>
    <a href="tel:4008518832">
      <div class="dbjl" style="color: #333;">
        <div class="dbLeft">
          <img src="../../images/icon_phone.png">
          <span>联系我们 </span>
        </div>
      </div>
    </a>

    <!--<div class="dbjl" @click="newsGo">
      <div class="dbLeft" >
        <img style="float: left;" src="../../images/cr-021.png">
        <span>我的评论</span>
      </div>
      <div class="dbRight">
        <p v-show="msgExist" class="dbRight-p2">
          <span>新消息</span>
          <img src="../../images/cr-023.png"/>
        </p>
      </div>
    </div>-->

    <div class="signOut">
      <button @click="logout">退出登录</button>
    </div>

    <div class="re-index">
      <router-link to="themeList">
        <img src="../../images/reIndex.png">
      </router-link>
    </div>
  </div>
</template>

<script>
  import { Toast,Indicator,MessageBox  } from 'mint-ui';
  import {getStore, setStore} from 'src/config/mUtils'
  import {userIndex,userSign,logout} from '../../service/getData'
  import {userAgent, isUserAgentIsFL, isUserAgentIsWX, isUserAgentIsZT, urlHost} from '../../service/userAgent'
  import {wxShare} from '../../service/wxShare'
  export default {
    name: 'account',
    data () {
      return {
        newsUrl: null,
        accountData: {},
        userInfo: {},
        gb: {},
        userIcon: null,
        dbExist: false,
        msgExist: false,
        myyydbUrl: null,
        deviceId : null,
        Hdqd : true,
      }
    },
    components: {
      Toast
    },
    mounted(){
        var localDate = Date.parse(new Date());
        var deviceId =  getStore("_bbid");
        var _self = this;
        Indicator.open({ spinnerType: 'fading-circle' });
        userIndex(deviceId,localDate).then(json=>{
          //console.log(json);
          if (json.code == '0000') {
              _self.accountData = json.data;
              _self.myyydbUrl = _self.accountData.myyydbUrl;
              _self.userInfo = _self.accountData.userInfo;
              _self.gb = _self.accountData.gb;
              _self.newsUrl = "http://hd.zt.raiyi.com/v9/private/" + _self.deviceId + "/weibo/comment/msgList?showStartTime=111&shwoEndTime=222&pageIndex=0&pageSize=10";
              var iconR = _self.userInfo.icon;
              var dbordering = parseInt(_self.accountData.dbordering);
              if (dbordering > 0) {
                  //此处先改成false
                  _self.dbExist = false;
              }
              if (_self.accountData.weibo === 1) {
                  _self.msgExist = true;
              }
              if (iconR == null || iconR === 'undefined') {
                  _self.userIcon = '../common/images/cr-022.png';
              } else {
                  _self.userIcon = iconR;
                  setStore('userIcon', iconR);
              }

              //存入用户昵称
              setStore('userNickName', _self.userInfo.nickName);

              setTimeout(() => Indicator.close(), 0);
          }
          else {
              Toast({
                  message: json.msg,
                  duration: 2000
              })

              localStorage.removeItem("_uuid");
              localStorage.removeItem("casId");
              localStorage.removeItem("userIcon");
              localStorage.removeItem("userNickName");
              localStorage.removeItem("_browserId");
              localStorage.removeItem("_bbid");
              localStorage.removeItem("themeSimple");

              this.$router.replace("/login");
          }
        });
        setTimeout(() => Indicator.close(), 1000);
    },
    created() {
      this.init();
      let isShare = true;
      let title = "我在圈子里看到了一件不得了的事情，快来围观！";
      let content = "圈子活动火爆来袭~";
      // let imageUrl = "http://filestore.zt.raiyi.com/fs/userIcon/79800.png";
      let imageUrl = "http://filestore.zt.raiyi.com/fs/icon/95828.png";
      let shareUrl = "http://hd.zt.raiyi.com/weibo/index?sc=FCWX";
      if (isUserAgentIsWX) {
          doWXShareInfo(title, content, imageUrl, shareUrl, isShare);
      }

      this.accountScrollLoad()
    },
    computed: {
      length () {
        return this.items.length
      }
    },
    methods:{
      init() {
        this.deviceId = getStore("_bbid");
      },
      dbRecordsGo(){
        location.href=this.myyydbUrl;
      },
      toCouponList(){
          this.$router.push('/couponList');
      },
      toPersonThemeList(){
          this.$router.push('/personThemeList/0/1/0/0/0');
      },
      toWinningRecord(){
          this.$router.push('/winningRecord');
      },
      newsGo(){
        this.$router.push("/themeList");
      },
      signMe(){
        userSign(this.deviceId,'other_browser').then(json=>{
          // console.log(json);
          if(json.code == '5005'){
            Toast({
              message: json.msg.substring(3),
              duration: 3000
            });
            this.Hdqd=true;
            return
          }
          if(json.code == '0000'){
              this.gb.total = this.gb.total+1;
            Toast({
              message: '签到成功',
              duration: 3000
            });
            this.Hdqd=false;
          }
          //location.reload();
        });
      },
      logout(){
        MessageBox.confirm('确定要退出登录吗?').then(action => {
          //console.log(action);
          if(action == 'confirm'){
            logout(this.deviceId).then(res=>{
              //console.log(res);
              localStorage.removeItem("_uuid");
              localStorage.removeItem("casId");
              localStorage.removeItem("userIcon");
              localStorage.removeItem("userNickName");
              localStorage.removeItem("_browserId");
              localStorage.removeItem("_bbid");
              localStorage.removeItem("themeSimple");
              this.$router.push("/");
            });
          }
        });
      },
      closeTip(){
        this.showAlert = false;
      },
      accountScrollLoad(){
        window.onscroll = function (){}
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--<style scoped>
  @import '../common/css/reset.css';
  @import '../common/css/account.css';
</style>-->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  .head {
    width: 100%;
    height: 9rem;
    position: relative;
    background: -webkit-linear-gradient(left, #2cb6ff , #2f90ff);
    overflow: hidden;
  }
  .Hd-sign-in{
    text-align: right;
    padding: 0.8rem 0.8rem 0.1rem 0.8rem;
  }
  .Hd-sign-in a{
    display: inline-block;
  }
  .Hd-sign-in a img{
    width:1.6rem;
    display: inline-block;
    vertical-align: middle;
  }
  .Hd-sign-in span{
    display: inline-block;
    vertical-align: middle;
    color:#fff;
    font-size:0.9rem;
  }
  .msg{
    height: 4rem;

  }
  .msg img{
    width: 1.5rem;
    float: right;
    padding: 2rem 2rem 0 0 ;
  }

  .personDesc {
    width: 100%;
    padding-top: 2.5rem;
  }

  .a_headImg {
    margin-left: 1rem;
    width: 4.3rem;
    height: 4.3rem;
    border-radius: 6px;
    float: left;
    overflow: hidden;
  }
  .a_headImg img{
    width: 100%;
  }
  .personDetail {
    float: left;
    padding-left: 1.5rem;
    width: 60%;
    text-align: left;
  }
  .personDetail p{
    color: #ffffff;
  }
  .personDetail-p1{
    font-size:1rem;
    padding-bottom: 0.2rem;
  }
  .personDetail-p2{
    font-size:0.9rem;
    padding-bottom: 0.4rem;
  }
  .personDetail-p3{
    background-color: #1675c1;
    border-radius: 1rem;
    font-size: 0.9rem;
    width:6rem;
    text-align:center;
    position: relative;
    line-height: 1.5rem;
  }
  .person-red-circle{
    display:none;
    width: 0.3rem;
    height: 0.3rem;
    background: #ff2244;
    border-radius: 50%;
    position: relative;
    top: -0.5rem;
    right: -0.2rem;
  }
  .person-apple-num{
    font-size:0.9rem;
    color:#fff;
  }
  .person-apple-money{
    font-size:0.8rem;
    color:#fff;
  }

  .dbjl {
    margin-top: 0.5rem;
    padding:0.8rem 1rem;
    border-bottom:1px solid #f2f2f2;
    overflow: hidden;
    background:#fff;
  }

  .dbLeft {
    float: left;
    font-size:0.8rem;
  }
  .dbLeft img {
    height: 1rem;
    vertical-align: middle;
    margin-right:0.4rem;
    display:inline-block;
  }
  .dbLeft span{
    display: inline-block;
    vertical-align: middle;
  }

  .dbRight {
    float: right;
    font-size:0.9rem;
  }

  .dbRight-p2 span{color:#ff0000;vertical-align: middle;padding-right:1rem;}
  .dbRight-p2 img{vertical-align: middle;width:0.5rem;}

  .signOut {
    text-align: center;
    margin: 2rem 0;
  }
  .signOut button{
    width: 90%;
    height: 2.6rem;
    background-color: #40AFFE;
    border: none;
    border-radius: 0.2rem;
    color: #ffffff;
    font-size: 0.9rem;
  }

  .wave {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: -0.5rem;
  }
  .wave img {
    width: 100%;
  ;

  }
  .signBtn {
    width: 3rem;
    height: 2rem;
    background-color: #ffffff;
    border: 1px solid ;
    font-size: 1rem;
  }
  /*头部的返回按钮*/
  .Hreset-cen{
    height:2.8rem;
  }
  .Hreset-fixed{position:fixed;
    top:0;
    left:0;
    width:100%;
    z-index:999;
  }
  .Hreset-fixed-h2{
    text-align: center;
    position: relative;
    background: -webkit-linear-gradient(left, #2cb6ff , #2f90ff);
    font-size: 1rem;
    color: #fff;
    height:2.8rem;
    line-height: 2.8rem;
  }
  .Hreset-fixed-back{
    position: absolute;
    top:0;
    left:0.8rem;
  }
  .Hreset-fixed-back img{
    display: inline-block;
    vertical-align: middle;
    width: 0.5rem
  }
  .Hreset-fixed-back span{
    display: inline-block;
    vertical-align: middle;
    font-size: 0.9rem;
    color:#fff;
  }


  .re-index{
    position: fixed;
    bottom: 5%;
    right: 2%;
    z-index: 9;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    overflow: hidden;
  }

  .re-index img{
    width: 100%;
  }
  .gif-flag{
    object-fit: initial !important;
  }

</style>
