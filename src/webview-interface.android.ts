import { Device, WebView } from '@nativescript/core';
import { WebViewInterfaceCommon } from './webview-interface.common';

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
        (this.webView.nativeViewProtected as android.webkit.WebView).getSettings().setJavaScriptEnabled(true);
        (this.webView.nativeViewProtected as android.webkit.WebView).getSettings().setAllowFileAccess(true);
        (this.webView.nativeViewProtected as android.webkit.WebView).getSettings().setAllowContentAccess(true);
        const JSInterface = new JavascriptInterface(new WeakRef(this));
        (this.webView.nativeViewProtected as android.webkit.WebView).addJavascriptInterface(JSInterface, 'Android');
    }

    runJSFunc(fname: string, arg: Object, callback: (data: Object[] | Object) => void) {
        const params = JSON.stringify(arg);
        if (callback) {
            // @ts-ignore
            this.once(fname, ({ data }) => callback(data));
        }
        const caller = `Bridge.call('${fname}', '${params}');`;
        console.log(caller);
        if (Device.sdkVersion >= '19') {
            (this.webView.nativeView as android.webkit.WebView).evaluateJavascript(caller, null);
        } else {
            (this.webView.nativeView as android.webkit.WebView).loadUrl(`javascript: ${caller}`);
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
