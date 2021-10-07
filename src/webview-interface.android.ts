
import { Device, WebView } from "@nativescript/core";
import { WebViewInterfaceCommon } from "./webview-interface.common";

// @ts-ignore
declare var com: any;

export class WebViewInterface extends WebViewInterfaceCommon {
    constructor(webView: WebView) {
        super(webView);
        this.initWebView();
    }

    initWebView() {
        if (this.webView.isLoaded) {
            this.setupWebView();
        } else {
            this.webView.once(WebView.loadedEvent, () => this.setupWebView());
        }
    }

    public setupWebView() {
        (this.webView.nativeViewProtected as android.webkit.WebView).getSettings().setJavaScriptEnabled(true)
        const JSInterface = new JavascriptInterface(new WeakRef(this));
        (this.webView.nativeViewProtected as android.webkit.WebView).addJavascriptInterface(JSInterface, "Android");
    }

    runJSFunc(fname: string, arg: Object, callback: (data: string) => void) {
        const data = JSON.stringify(arg);
        console.log(`javascript: ${fname}()`, Device.sdkVersion);
        if (Device.sdkVersion >= '19') {
            (this.webView.nativeView as android.webkit.WebView).evaluateJavascript(`${fname}('${data}');`, null)
        } else {
            (this.webView.nativeView as android.webkit.WebView).loadUrl(`javascript: ${fname}(${data});`)
        }
    }
}

@NativeClass()
class JavascriptInterface extends com.novacio.WebviewInterface {

    constructor(private webViewInterface: WeakRef<WebViewInterface>) {
        super();
        return global.__native(this);
    }

    public _emit(eventName: string, jsonData: string) {
        const webViewInterface = this.webViewInterface.get();
        const data = webViewInterface.parseJSON(jsonData);
        webViewInterface.emit(eventName, data);
    }
} 