<template>
    <div style="background-color: #f2f2f2">

        <div class="wr-list-wrapper">

            <div class="wr-list-item" v-if="wrList!=null" v-for="wrItem in wrList">
                <div class="wr-list-item-content left">
                    <p class="wr-list-item-content-title">{{wrItem.prizeName}}</p>
                    <p class="wr-list-item-content-date">领取时间：{{countTime(wrItem.createTime)}}</p>
                </div>
                <div class="wr-list-item-btn right">
                    <p v-if="wrItem.status=='0'">领取成功</p>
                    <p v-else="">充值成功</p>
                </div>
            </div>

            <div class="wr-list-no" v-if="wrList==null">
                <p>暂时没有领取记录</p>
            </div>

        </div>

    </div>
</template>

<script>
    import {getStore, setStore} from 'src/config/mUtils'
    import {Toast, Indicator} from 'mint-ui'

    import {wrList} from '../../service/getData'

    var scUrl = 'other_browser'

    export default{
        data(){
            return {
                deviceId: null,
                wrList: null
            }
        },
        created(){
            var urlPara = GetQueryString('sc');
            if (urlPara !== null) {
                scUrl = urlPara
            }

            this.deviceId = getStore("_bbid")

            this.getWrList()
        },
        methods: {
            getWrList(){
                Indicator.open({spinnerType: 'fading-circle'});
                wrList(this.deviceId, scUrl).then(res => {
                    //console.log(res)
                    if (res.code === '0000') {
                        if (res.data.length > 0) {
                            this.wrList = res.data
                        }
                    }
                    else {
                        Toast({
                            message: res.msg,
                            duration: 2000
                        })
                    }
                    Indicator.close()
                }).catch(function (e) {
                    Indicator.close()
                    Toast({
                        message: '数据异常，请稍候再试',
                        duration: 2000
                    })
                })
            },
            countTime(item){
                let lastShowTime = '';

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

                lastShowTime = year + '-' + month + '-' + day + ' ' + hour + ':' + min

                return lastShowTime
            }
        }
    }
</script>

<style scoped>
    .wr-list-item {
        position: relative;
        background-color: #fff;
        padding: 1rem;
        overflow: hidden;
        line-height: 1;
    }

    .wr-list-item:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: #e5e5e4;
    }

    .wr-list-item-content {
        width: 80%;
        overflow: hidden;
    }

    .wr-list-item-content-title {
        font-size: 0.9rem;
        color: #2e2f2f;
        line-height: 1.2rem;
    }

    .wr-list-item-content-date {
        font-size: 0.6rem;
        color: #a0a0a0;
        margin-top: 0.7rem;
    }

    .wr-list-item-btn {
        width: 18%;
        font-size: 0.6rem;
        color: #fff;
        background-color: #00b7ee;
        text-align: center;
        padding: 0.5rem 0.2rem;
        border-radius: 0.2rem;
        margin: 0.28rem 0;
    }

    .wr-list-no {
        font-size: 0.8rem;
        color: #ccc;
        text-align: center;
        line-height: 2rem;
    }
</style>