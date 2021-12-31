package com.novacio;

import android.webkit.JavascriptInterface;

public class WebviewInterface {
    public WebviewInterface(){ }

    @JavascriptInterface
    public void emit(String name, String data){
        this._emit(name, data);
    }

    public void _emit(String name, String data){ }
}
