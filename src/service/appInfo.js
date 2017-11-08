import {userAgent, isUserAgentIsFL, isUserAgentIsWX, isUserAgentIsZT} from './userAgent'
import {appShare,doFLShareInfo} from './appShare'

if (!isUserAgentIsFL && !isUserAgentIsZT) {
    return;
}

if (window.FLJsBridge) {
    window.FLJsBridge.getAppInfo('appInfoCallBack');
}
if (!document.getElementById('_deviceId').value) {
    window.setTimeout(function () {
        if (window.FLJsBridge) {
            window.FLJsBridge.getAppInfo('appInfoCallBack');
        } else {
            document.addEventListener('FLJsBridge', function (event) {
                window.FLJsBridge.getAppInfo('appInfoCallBack');
            }, false);
        }
    }, 200);
}

window.appInfoCallBack = function(result) {
    var appData = eval('(' + result + ')');
    if (appData) {
        document.getElementById('_appCode').value = appData.appcode;
        document.getElementById('_channel').value = appData.channel;
        document.getElementById('_appVersion').value = appData.appversion;
        document.getElementById('_deviceId').value = appData.deviceid;

        // 先判断appcode为 datamall,dm_bestTone,flowcircle
        if (appData.appcode === "datamall" || appData.appcode === "flowcircle") {
            if (window.FLJsBridge) {
                window.FLJsBridge.setHeadButton(2, '分享', 'shareIndex', 1);
            } else {
                document.addEventListener('FLJsBridge', function (event) {
                    window.FLJsBridge.setHeadButton(2, '分享', 'shareIndex', 1);
                }, false);
            }
        }
    }
}

let isShare = true;
let title = "圈子";
let content = "圈子内容";
let imageUrl = "http://filestore.zt.raiyi.com/fs/userIcon/79800.png";
let shareUrl = "http://hd.zt.raiyi.com/yydb/index?share";

window.shareIndex = function () {
    doFLShareInfo(title, content, '', imageUrl, shareUrl);
}

window.contactService = function() {
    var appcode = document.getElementById('_appCode').value;
    if (appcode == "dm_bestTone") {
        location.href = 'besttonemobile://zt.com/do?key=feedback'
    } else {
        location.href = 'datamall://zt.com/do?key=feedback';
    }
}