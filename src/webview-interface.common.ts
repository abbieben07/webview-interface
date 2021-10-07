import { WebView } from "@nativescript/core";
import { WebViewInterface } from "./webview-interface";

export class WebViewInterfaceCommon implements WebViewInterface {
    constructor(public webView: WebView) {

    }

    start(): Promise<any> {
        return new Promise(resolve => {
            if (this.webView.isLoaded) {
                resolve(null);
            } else {
                this.webView.once(WebView.loadFinishedEvent, () => resolve(null));
            }
        })
    }

    parseJSON(data: string): Array<Object> | Object {
        let result;
        try {
            result = JSON.parse(data) as any;
        } catch (e) {
            console.error(e);
        }
        return result;
    }

    emit(eventName: string, data: any) {
        this.webView.notify({ eventName, object: this.webView, data });
    }

    on(eventName: string, callback: () => void) {
        this.webView.on(eventName, callback)
    }

    off(eventName: string, callback: () => void) {
        this.webView.off(eventName, callback)
    }

    once(eventName: string, callback: () => void) {
        this.webView.once(eventName, callback)
    }

    callFunction(fname: string, callback: () => void) {

    }
}