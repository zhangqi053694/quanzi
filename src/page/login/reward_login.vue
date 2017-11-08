<template>
    <div class="loginContainer">
        <!--<head-top :head-title="loginWay? '登录':'密码登录'" goBack="true">
           &lt;!&ndash; <div slot="changeLogin" class="change_login" @click="changeLoginWay">{{loginWay? "密码登录":"短信登录"}}</div>&ndash;&gt;
        </head-top>-->
        <header class="login_head">
          <figure class="login_head_img">
            <img src="../../images/cr-036.png"/>
          </figure>
        </header>
        <form class="loginForm" v-if="loginWay">
            <section class="input_container phone_number">
                <img class="phone_number-img" src="../../images/cr-034.png">
                <input type="tel" placeholder="手机号" name="phone" maxlength="11" v-model="phoneNumber">
            </section>
            <section class="input_container phone_number">
                <img class="phone_number-img" src="../../images/cr-035.png">
                <input type="tel" placeholder="请输入验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
                <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
                <button class="sended" @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button>
            </section>
        </form>
        <div class="login_container" @click="mobileLogin">登录</div>
        <router-link to="/forget" class="to_forget" v-if="!loginWay">忘记密码？</router-link>
    </div>
</template>

<script src="../common/js/fetch.js"></script>
<script>
    import { Toast } from 'mint-ui';
    import {mapState, mapMutations} from 'vuex'
    import {getVerifyCode,mobileLogin} from '../../service/getData'
    import {getStore, setStore} from 'src/config/mUtils'
    import {userAgent, isUserAgentIsFL, isUserAgentIsWX, isUserAgentIsZT, urlHost} from '../../service/userAgent'
    import {wxShare} from '../../service/wxShare'
    export default {
        data(){
            return {
                loginWay: true, //登录方式，默认短信登录
                showPassword: false, // 是否显示密码
                phoneNumber: null, //电话号码
                mobileCode: null, //短信验证码
                verifyId: null, //短信验证码
                validate_token: null, //获取短信时返回的验证值，登录时需要
                computedTime: 0, //倒数记时
                userInfo: null, //获取到的用户信息
                userAccount: null, //用户名
                passWord: null, //密码
                captchaCodeImg: null, //验证码地址
                codeNumber: null, //验证码
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
                deviceId:null
            }
        },
        created(){
          this.deviceId = getStore('_bbid');
          let isShare = true;
          let title = "我在圈子里看到了一件不得了的事情，快来围观！";
          let content = "圈子活动火爆来袭~";
          // let imageUrl = "http://filestore.zt.raiyi.com/fs/userIcon/79800.png";
          let imageUrl = "http://filestore.zt.raiyi.com/fs/icon/95828.png";
          let shareUrl = "http://hd.zt.raiyi.com/weibo/index?sc=FCWX";
          if (isUserAgentIsWX) {
              doWXShareInfo(title, content, imageUrl, shareUrl, isShare);
          }
        },
        computed: {
            //判断手机号码
            rightPhoneNumber: function (){
                return /^1\d{10}$/gi.test(this.phoneNumber)
            }
        },
        methods: {
            //是否显示密码
            changePassWordType(){
                this.showPassword = !this.showPassword;
            },
            //获取验证吗，线上环境使用固定的图片，生产环境使用真实的验证码
            /*async getCaptchaCode(){
                if (process.env.NODE_ENV !== 'development'){
                    this.captchaCodeImg = 'http://test.fe.ptdev.cn/elm/yzm.jpg';
                }else{
                    let res = await getcaptchas();
                    this.captchaCodeImg = 'https://mainsite-restapi.ele.me/v1/captchas/' + res.code;
                }
            },*/
            //获取短信验证码
            getVerifyCode(){
              if (this.rightPhoneNumber) {
                getVerifyCode(this.phoneNumber,'other_browser').then(json=>{
                  // console.log(json);
                  if (json.success) {
                    this.verifyId = json.data
                    this.computedTime = 30;
                    this.timer = setInterval(() => {
                      this.computedTime --;
                      if (this.computedTime <= 0) {
                        clearInterval(this.timer)
                      }
                    }, 1000)
                  }else {
                    Toast({
                      message: json.msg.substring(3),
                      duration: 2000
                    });
                    return
                  }
                });
              }else{
                Toast({
                      message: '请输入正确的手机号',
                      duration: 2000
                    });
              }
            },
            //发送登录信息
            mobileLogin(){
                if (!this.rightPhoneNumber) {
                    Toast( '手机号码不正确');
                    return
                }else if(!(/^\d{4}$/gi.test(this.mobileCode))){
                    Toast('短信验证码不正确');
                    return
                }
                //手机号登录
                mobileLogin(this.deviceId,this.phoneNumber,this.mobileCode,'other_browser',this.verifyId).then(json=>{
                  // console.log(json);
                  if(json.success){
                    localStorage.setItem("_uuid",json.data.uuid);
                    localStorage.setItem("userIcon",json.data.userInfo.icon);
                    localStorage.setItem("casId",json.data.userInfo.casId);
                    Toast({
                      message: '登录成功',
                      duration: 2000
                    });
                    this.timer = setInterval(() => {
                        //this.$router.push({path:'/account'});
                        this.$router.go(-1);
                        clearInterval(this.timer)
                    }, 1000)
                  }else{
                    Toast({
                      message: json.msg.substring(3),
                      duration: 1000
                    });
                    return
                  }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    html,body{
      background-color: #ffffff;
      height:100%;
    }

    .loginContainer{
        p, span, input{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
      background-color: #ffffff;
      height:100%;
    }
    .change_login{
        position: absolute;
        @include ct;
        right: 0.75rem;
        @include sc(.7rem, #fff);
    }

    .loginForm{
        background-color: #fff;
        margin-top: 3rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            input{
                font-size:0.9rem;
                padding:0.4rem 3% 0.4rem 15%;
                width:100%;
                color: #8492af;
            }
            button{
                position: absolute;
                top: 0.4rem;
                right: 0.8rem;
                color: #37a8eb;
                background: none !important;
                border: 1px solid #37a8eb;
                padding: 0.4rem 0.8rem;
                border-radius: 10rem;
                font-size: 0.9rem;
            }
            .sended{
                position: absolute;
                top: 0.4rem;
                right: 0.8rem;
                color: #9eb0ba;
                background: none !important;
                border: 1px solid #9eb0ba;
                padding: 0.4rem 0.8rem;
                border-radius: 10rem;
                font-size: 0.9rem;
            }

        }
        .phone_number{
            padding: .5rem 5%;
            position:relative;
            margin-bottom:0.5rem;
        }
        .phone_number:after{
            content:'';
            position:absolute;
            width: 90%;
            height: 1px;
            background: #f1f1f1;
            left: 6%;
            bottom: 0;
        }
        .phone_number-img{
            position:absolute;
            top: 0.8rem;
            left: 1.5rem;
            width: 1.1rem;
        }
        .captcha_code_container{
            height: 2.2rem;
            .img_change_img{
                display: flex;
                align-items: center;
                img{
                    @include wh(3.5rem, 1.5rem);
                    margin-right: .2rem;
                }
                .change_img{
                    display: flex;
                    flex-direction: 'column';
                    flex-wrap: wrap;
                    width: 2rem;
                    justify-content: center;
                    p{
                        @include sc(.55rem, #666);
                    }
                    p:nth-of-type(2){
                        color: #3b95e9;
                        margin-top: .2rem;
                    }
                }
            }
        }
    }
    .login_tips{
        @include sc(.5rem, #999);
        padding: .4rem .6rem;
        line-height: .7rem;
        a{
            color: #3b95e9;
        }
    }
    .login_container{
            font-size: 0.9rem;
            color: #fff;
            background-color: #37a8eb;
            padding: .7rem 0;
            text-align: center;
            width: 60%;
            margin: 2rem auto 1rem;
            border-radius:10rem;
    }
    .button_switch{
        background-color: #ccc;
        display: flex;
        align-items: center;
        justify-content: space-between;
        @include wh(2rem, .7rem);
        padding: 0 .2rem;
        border: 1px;
        border-radius: 0.5rem;
        position: relative;
        transition: all .3s;
        .circel_button{
            transition: all .3s;
            position: absolute;
            z-index: 1;
            @include wh(1.2rem, 1.2rem);
            left: -.1rem;
            box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0,0,0,.1);
            background-color: #f1f1f1;
            border-radius: 50%;

        }
        .trans_to_right{
            transform: translateX(1.3rem);
        }
        span{
            @include sc(.45rem, #fff);
            transform: translateY(.05rem);
            line-height: .6rem;
        }
        span:nth-of-type(2){
            transform: translateY(-.08rem);
        }
    }
    .change_to_text{
        background-color: #4cd964;
    }
    .to_forget{
        float: right;
        @include sc(.6rem, #3b95e9);
        margin-right: .3rem;
    }

    .login_head{
      padding-top: 3rem;
    }
    .login_head_img {
      width: 50%;
      margin: 0 auto;
      img{
        width:100%;
        display:block;
      }
    }
</style>
