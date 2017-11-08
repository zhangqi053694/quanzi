var title_appShare;
var content_appShare;
var image_appShare;
var imageUrl_appShare;
var shareUrl_appShare;

export function doFLShareInfo(titleDef, contentDef, imageDef, imageUrlDef, shareUrlDef) {
	title_appShare = titleDef;
	content_appShare = contentDef.replace(/<br>/g, "");
	image_appShare = "";
	imageUrl_appShare = imageUrlDef;
	shareUrl_appShare = encodeURI(shareUrlDef);

	doShareAppActivity();
}

// 客户端分享
function doShareAppActivity() {
	var _appCode = document.getElementById('_appCode').value;
	var imageNotice = "";

	if (window.FLJsBridge) {
		if (_appCode === "flowcircle") {
			window.FLJsBridge.showShareClick(content_appShare, shareUrl_appShare, image_appShare, imageUrl_appShare, 'doShareActivityCallback');
		} else {
			if (document.getElementById('_appVersion').value) {
				if (document.getElementById('_appVersion').value === '2.0') {
					window.FLJsBridge.shareContent(title_appShare, content_appShare, shareUrl_appShare, image_appShare, imageUrl_appShare, 'doShareActivityCallback');
				} else if (document.getElementById('_appVersion').value === '2.1') {
					window.FLJsBridge.shareContent(title_appShare, content_appShare, shareUrl_appShare, image_appShare, imageUrl_appShare, 'doShareActivityCallback', imageNotice, "");
				} else {
					window.FLJsBridge.shareContent(title_appShare, content_appShare, shareUrl_appShare, image_appShare, imageUrl_appShare, 'doShareActivityCallback', imageNotice, "", true);
				}
			} else {
				window.FLJsBridge.shareContent(title_appShare, content_appShare, shareUrl_appShare, image_appShare, imageUrl_appShare, 'doShareActivityCallback');
			}
		}
	} else {
		document.addEventListener('FLJsBridge', function(event) {
			if (_appCode === "flowcircle") {
				window.FLJsBridge.showShareClick(content_appShare, shareUrl_appShare, image_appShare, imageUrl_appShare, 'doShareActivityCallback');
			} else {
				window.FLJsBridge.shareContent(title_appShare, content_appShare, shareUrl_appShare, image_appShare, imageUrl_appShare, 'doShareActivityCallback', imageNotice, '', true);
			}
		}, false);
	}
}

window.doShareActivityCallback = function(result) {
	var status = eval('(' + result + ')').status;
	if (status === 1) {

	}
}