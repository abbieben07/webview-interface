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
        const config = this.webView.nativeViewProtected.configuration;
        config.dataDetectorTypes = -1;
        if (Device.sdkVersion >= '14.0') {
            config.defaultWebpagePreferences.allowsContentJavaScript = true;
        }
        else {
            config.preferences.javaScriptEnabled = true;
        }
        config.userContentController.addScriptMessageHandlerName(JavascriptInterface.init(new WeakRef(this)), "iOS");
    }
    runJSFunc(fname, arg, callback) {
        const params = JSON.stringify(arg);
        if (callback) {
            this.once(fname, ({ data }) => callback(data));
        }
        const caller = `Bridge.call('${fname}', '${params}');`;
        this.webView.nativeViewProtected.evaluateJavaScriptCompletionHandler('happy()', (data, error) => console.log("Return", data, "Error", error));
    }
}
//@ObjCClass([WKScriptMessageHandler])
var JavascriptInterface = /** @class */ (function (_super) {
    __extends(JavascriptInterface, _super);
    function JavascriptInterface() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JavascriptInterface.init = function (webViewInterface) {
        var delegate = _super.new.call(this);
        delegate.webViewInterface = webViewInterface;
        return delegate;
    };
    JavascriptInterface.prototype.userContentControllerDidReceiveScriptMessage = function (content, message) {
        var _a = message.body, name = _a.name, data = _a.data;
        var webViewInterface = this.webViewInterface.get();
        webViewInterface.emit(name, data);
    };
    JavascriptInterface.ObjCProtocols = [WKScriptMessageHandler];
    return JavascriptInterface;
}(NSObject));
//# sourceMappingURL=webview-interface.ios.js.map