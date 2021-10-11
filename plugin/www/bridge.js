class Bridge {
    static parseJSON(data) {
        let result;
        try {
            result = JSON.parse(data);
        }
        catch (e) {
            console.error(e);
        }
        return result;
    }
    static stringJSON(data) {
        let result;
        try {
            result = JSON.stringify(data);
        }
        catch (e) {
            console.error(e);
        }
        return result;
    }
    static call(name, data, callback) {
        console.log(data);
        const fn = window[name];
        const params = this.parseJSON(data);
        if (typeof fn === "function")
            fn(params);
    }
    static callback(name, data) {
        const params = this.stringJSON(data);
        if (Android) {
            Android.emit(name, params);
        }
        else if (iOS) {
            iOS.emit(name, params);
        }
        else {
            console.error("Cannot find Bridge object");
        }
    }
}
//# sourceMappingURL=bridge.js.map