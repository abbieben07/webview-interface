import { WebView } from "@nativescript/core"
import { WebViewInterfaceCommon } from "./webview-interface.common";

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
        //(this.webView.nativeView as WKWebView).configuration.userContentController.addScriptMessageHandlerName(JavascriptInterface.init(new WeakRef(this)), "iOS")
    }

    runJSFunc(fname: string, arg: Object, callback: (data: Object[] | Object) => void) {
        const params = JSON.stringify(arg);
        if (callback) {
            // @ts-ignore
            this.once(fname, ({ data }) => callback(data));
        }
        const caller = `Bridge.call('${fname}', '${params}');`;
        (this.webView.nativeViewProtected as WKWebView).evaluateJavaScriptCompletionHandler(caller, null)
    }
}

@NativeClass()
@ObjCClass([WKScriptMessageHandler])
class JavascriptInterface extends NSObject implements WKScriptMessageHandler {
    private webViewInterface: WeakRef<WebViewInterface>;

    public static init(webViewInterface: WeakRef<WebViewInterface>): JavascriptInterface {
        const delegate = super.new() as JavascriptInterface;
        delegate.webViewInterface = webViewInterface;
        return delegate;
    }

    userContentControllerDidReceiveScriptMessage(content: WKUserContentController, message: WKScriptMessage): void {
        const { name, data } = message.body;
        const webViewInterface = this.webViewInterface.get();
        webViewInterface.emit(name, data);
    }
}