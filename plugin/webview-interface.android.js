import { Device, WebView } from '@nativescript/core';
import { WebViewInterfaceCommon } from './webview-interface.common';
export class WebViewInterface extends WebViewInterfaceCommon {
    constructor(webView) {
        super(webView);
        this.initWebView();
    }
    initWebView() {
        if (this.webView.isLoaded) {
            this.setupWebView();
        }
        else {
            this.webView.once(WebView.loadedEvent, () => this.setupWebView());
        }
    }
    setupWebView() {
        this.webView.nativeViewProtected.getSettings().setJavaScriptEnabled(true);
        this.webView.nativeViewProtected.getSettings().setAllowFileAccess(true);
        this.webView.nativeViewProtected.getSettings().setAllowContentAccess(true);
        const JSInterface = new JavascriptInterface(new WeakRef(this));
        this.webView.nativeViewProtected.addJavascriptInterface(JSInterface, 'Android');
    }
    runJSFunc(fname, arg, callback) {
        const params = JSON.stringify(arg);
        if (callback) {
            this.once(fname, ({ data }) => callback(data));
        }
        const caller = `Bridge.call('${fname}', '${params}');`;
        console.log(caller);
        if (Device.sdkVersion >= '19') {
            this.webView.nativeView.evaluateJavascript(caller, null);
        }
        else {
            this.webView.nativeView.loadUrl(`javascript: ${caller}`);
        }
    }
}
var JavascriptInterface = /** @class */ (function (_super) {
    __extends(JavascriptInterface, _super);
    function JavascriptInterface(webViewInterface) {
        var _this = _super.call(this) || this;
        _this.webViewInterface = webViewInterface;
        return global.__native(_this);
    }
    JavascriptInterface.prototype._emit = function (eventName, jsonData) {
        var webViewInterface = this.webViewInterface.get();
        var data = webViewInterface.parseJSON(jsonData);
        webViewInterface.emit(eventName, data);
    };
    return JavascriptInterface;
}(com.novacio.WebviewInterface));
//# sourceMappingURL=webview-interface.android.js.map