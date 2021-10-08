import { Device, WebView } from "@nativescript/core";
import { WebViewInterfaceCommon } from "./webview-interface.common";
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
        const JSInterface = new JavascriptInterface(new WeakRef(this));
        this.webView.nativeViewProtected.addJavascriptInterface(JSInterface, "Android");
    }
    runJSFunc(fname, arg, callback) {
        const data = JSON.stringify(arg);
        console.log(`javascript: ${fname}()`, Device.sdkVersion);
        if (Device.sdkVersion >= '19') {
            this.webView.nativeView.evaluateJavascript(`${fname}('${data}');`, null);
        }
        else {
            this.webView.nativeView.loadUrl(`javascript: ${fname}(${data});`);
        }
    }
}
let JavascriptInterface = class JavascriptInterface extends com.novacio.WebviewInterface {
    constructor(webViewInterface) {
        super();
        this.webViewInterface = webViewInterface;
        return global.__native(this);
    }
    _emit(eventName, jsonData) {
        const webViewInterface = this.webViewInterface.get();
        const data = webViewInterface.parseJSON(jsonData);
        webViewInterface.emit(eventName, data);
    }
};
JavascriptInterface = __decorate([
    NativeClass()
], JavascriptInterface);
//# sourceMappingURL=webview-interface.android.js.map