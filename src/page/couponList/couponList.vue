<template>
    <div style="background-color: #f2f2f2;min-height: 100%">

        <div class="cl-nav-wrapper clear">
            <div class="cl-nav-item left" :class="{'cl-nav-item-active':tabSelect}" @click="tabSelect=true">
                <p>可使用({{couponNum}})</p>
            </div>
            <div class="cl-nav-item left" :class="{'cl-nav-item-active':!tabSelect}" @click="tabSelect=false">
                <p>已失效({{invalidCouponNum}})</p>
            </div>
        </div>

        <!-- <div class="cl-rule" v-if="couponList!=null" v-show="false">
            <a :href="tabSelect?couponList.useDesc:couponList.invalidDesc"><p>优惠券使用说明</p></a>
        </div> -->

        <div class="cl-list-wrapper" v-if="couponList!=null">
            <div class="cl-list-item" v-for="couponItem in couponList.list"
                 v-if="(couponItem.status==1&&tabSelect)||(couponItem.status!=1&&!tabSelect)" @click="openAlert(couponItem)">
                <img src="../../images/coupon_item_bg.png" v-if="couponItem.status==1&&tabSelect">
                <img src="../../images/coupon_item_bg_invalid.png" v-if="couponItem.status!=1&&!tabSelect">
                <div class="cl-list-item-content">
                    <div class="cl-list-item-left left">
                        <div class="cl-list-item-txt-wrapper">
                            <p class="cl-list-item-couponCount" v-if="couponItem.couponCount>1">{{couponItem.couponCount}}张</p>
                            <p class="cl-list-item-remark">{{couponItem.remark}}</p>
                            <p class="cl-list-item-label">{{couponItem.label}}</p>
                            <p class="cl-list-item-date">
                                使用期限
                                {{formatDate(couponItem.createDate)}}-{{formatDate(couponItem.invalidDate)}}
                            </p>
                            <div class="cl-list-item-des-wrapper clear">
                                <p class="left">{{couponItem.description}}</p>
                                <p class="right">{{couponItem.statusName}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="cl-list-item-right right">
                        <div class="cl-list-item-btn">
                            <img src="../../images/zt_default_coupon_icon.png" v-if="couponItem.couponType!=3&&couponItem.status==1&&tabSelect">
                            <img src="../../images/zt_default_coupon_icon_useless.png" v-if="couponItem.couponType!=3&&couponItem.status!=1&&!tabSelect">
                            <p class="cl-list-item-exchange" v-if="couponItem.couponType==3">兑换</p>
                            <p class="cl-list-item-expired" v-if="couponItem.status==1&&tabSelect&&countDate(couponItem.invalidDate)">即将过期</p>
                        </div>
                    </div>
                    <div class="clear"></div>
                </div>
            </div>
        </div>

        <div class="award-pop" @touchmove.prevent v-show="couponAlertShow" @click="closeAlert"></div>
        <div class="wx-alert-div" v-show="couponAlertShow">
            <div class="wx-alert-title">
                <span>提示</span>
                <img class="wx-alert-title-img" src="../../images/cr-015.png" @click="wxtitledel">
            </div>
            <div class="line-hr"></div>
            <div class="wx-alert-main">
                <p>确认兑换？</p>
            </div>
            <div class="wx-alert-btn">
                <a href="javascript:void(0);" @click="couponExchangeFun">确认</a>
            </div>
        </div>

    </div>
</template>

<script type="text/ecmascript-6">
    import {Toast,Indicator} from 'mint-ui';
    import {getStore, setStore} from 'src/config/mUtils'
    import {loadCouponList,couponExchange} from '../../service/getData'
    import {userAgent, isUserAgentIsFL, isUserAgentIsWX, isUserAgentIsZT, urlHost} from '../../service/userAgent'
    import {wxShare} from '../../service/wxShare'
    var appCode = 'flowcircle';

    export default{
        data(){
            return {
                tabSelect: true,
                deviceId: null,
                couponList: null,
                couponListItem: null,
                invalidCouponNum: 0,
                couponNum: 0,
                sameNum: 0,
                couponAlertShow: false,
                yydbUrl:''
            }
        },
        created(){
            this.deviceId = getStore("_bbid");

            var userId = getStore('_uuid');
            if (userId == null || userId == ''){
                this.$router.push('/login');
            }
            else {
                this.getCouponList();
            }

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
        methods: {
            getCouponList(){
                this.couponNum = 0;
                this.invalidCouponNum = 0;
                loadCouponList(this.deviceId, appCode).then(res => {
                    // console.log(res);
                    if (res.code=='0000') {
                        this.couponList = res.data;
                        this.yydbUrl = res.data.yydbUrl;
                        var distancetime = 0;
                        for (var i = 0; i < this.couponList.list.length; i++) {
                            distancetime = new Date(this.couponList.list[i].invalidDate).getTime() - new Date().getTime();
                            if (this.couponList.list[i].status == 1 && distancetime > 0) {
                                this.couponNum += this.couponList.list[i].couponCount==null?1:this.couponList.list[i].couponCount;
                            }
                            else if (this.couponList.list[i].status != 1 || distancetime <= 0) {
                                this.invalidCouponNum += this.couponList.list[i].couponCount==null?1:this.couponList.list[i].couponCount;
                            }
                        }
                    }
                });
            },
            formatDate(time){
                var date = new Date(time);
                return date.getFullYear() + '.' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
            },
            countDate(invalidTime){
                var distancetime = new Date(invalidTime).getTime() - new Date().getTime();
                if (distancetime>0){
                    if(Math.floor(distancetime/86400000)<=7){
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            },
            couponExchangeFun(){
                let item = this.couponListItem;
                if (item.status==1 && item.couponType==3) {
                    Indicator.open({ spinnerType: 'fading-circle' });
                    couponExchange(this.deviceId, appCode, item.couponUserId).then(json => {
                        if (json.code=='0000'){
                            this.couponAlertShow = false;
                            this.getCouponList();
                            //setTimeout(() => Indicator.close(), 500);
                            Indicator.close();
                            setTimeout(() => Toast({
                                message: json.msg,
                                duration: 2000
                            }), 500);
                        }else{
                            setTimeout(() => Indicator.close(), 500);
                        }
                    });
                }
                else if (item.status==1 && item.couponType!=3){
                    window.location.href=this.yydbUrl;//'http://hd.zt.raiyi.com/yydb/index?access=ot';
                }
            },
            openAlert(item){
                if(item.status==1){
                    if (item.couponType == 3) {
                        this.couponListItem = null;
                        this.couponListItem = item;
                        this.couponAlertShow = true;
                    }else{
                        window.location.href=this.yydbUrl;//'http://hd.zt.raiyi.com/yydb/index?access=ot';
                    }
                }
            },
            closeAlert(){
                this.couponAlertShow = false;
            },
            wxtitledel(){
                this.couponAlertShow = false;
            },
        }
    }
</script>

<style scoped>
    .cl-nav-wrapper {
        background-color: #fff;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 999;
    }

    .cl-nav-item {
        width: 50%;
        text-align: center;
        line-height: 2.6rem;
        font-size: 0.8rem;
        color: #666;
    }

    .cl-nav-item-active {
        color: #5DBBDF;
        position: relative;
    }

    .cl-nav-item-active:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 6rem;
        height: 0.15rem;
        background-color: #5DBBDF;
    }

    .cl-rule {
        padding-top: 2.6rem;
    }

    .cl-rule p {
        color: #5DBBDF;
        font-size: 0.8rem;
        background-color: #fff;
        width: 90%;
        margin: 0.5rem auto;
        border-radius: 0.2rem;
        line-height: 2.4rem;
        text-align: center;
    }

    .cl-list-wrapper {
        width: 90%;
        margin: 0 auto;
        padding-top: 2.6rem;
    }

    .cl-list-wrapper img {
        width: 100%;
    }

    .cl-list-item {
        position: relative;
        margin: 0.5rem 0;
    }

    .cl-list-item-content {

        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 95%;
    }

    .cl-list-item-left {
        width: 72%;
    }

    .cl-list-item-txt-wrapper {
        width: 80%;
        margin: 0.6rem auto;
        color: #8c8c8c;
        font-size: 0.6rem;
        position: relative;
    }

    .cl-list-item-couponCount{
        position: absolute;
        top: -0.2rem;
        right: 0;
        color: #FF5343;
        border: 1px solid #FF5343;
        font-size: 0.7rem;
        line-height: 1;
        padding: 0.2rem 0.5rem;
    }

    .cl-list-item-remark {
        color: #FF5343;
    }

    .cl-list-item-label {
        font-size: 1rem;
        color: #000;
    }

    .cl-list-item-right {
        width: 28%;
        position: relative;
    }

    .cl-list-item-btn{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 60%;
    }

    .cl-list-item-btn>img{
        margin-top: 1.2rem;
    }

    .cl-list-item-exchange{
        color: #fff;
        font-size: 1.3rem;
        text-align: center;
        margin-top: 1.4rem;
    }

    .cl-list-item-expired{
        color: #fff;
        text-align: center;
        font-size: 0.7rem;
    }


    /*弹窗 begin*/
    .award-pop {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 999;
        background: rgba(1, 1, 1, .5);
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        max-width: 720px;
    }

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
        z-index: 1000;
    }

    .wx-alert-close img{
        width: 100%;
    }

    .wx-alert-title{
        font-size: 1rem;
        color: #1b1b1b;
        text-align: center;
        margin: 0.6rem 0;
        position: relative;
    }
    
    .wx-alert-title-img{
        position: absolute;
        top:-0.5rem;
        right:0;
        width:1rem;
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
</style>