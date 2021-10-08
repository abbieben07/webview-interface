import { WebView } from "@nativescript/core";
export class WebViewInterfaceCommon {
    constructor(webView) {
        this.webView = webView;
    }
    start() {
        return new Promise(resolve => {
            if (this.webView.isLoaded) {
                resolve(null);
            }
            else {
                this.webView.once(WebView.loadFinishedEvent, () => resolve(null));
            }
        });
    }
    parseJSON(data) {
        let result;
        try {
            result = JSON.parse(data);
        }
        catch (e) {
            console.error(e);
        }
        return result;
    }
    emit(eventName, data) {
        this.webView.notify({ eventName, object: this.webView, data });
    }
    on(eventName, callback) {
        this.webView.on(eventName, callback);
    }
    off(eventName, callback) {
        this.webView.off(eventName, callback);
    }
    once(eventName, callback) {
        this.webView.once(eventName, callback);
    }
    callFunction(fname, callback) {
    }
}
//# sourceMappingURL=webview-interface.common.js.map