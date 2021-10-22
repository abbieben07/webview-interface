// @ts-ignore
declare const Android, iOS;

class Bridge {

    static parseJSON(data: string): Object[] | Object {
        let result;
        try {
            result = JSON.parse(data) as any;
        } catch (e) {
            console.error(e);
        }
        return result;
    }

    static stringJSON(data: Object[] | Object): string {
        let result;
        try {
            result = JSON.stringify(data) as any;
        } catch (e) {
            console.error(e);
        }
        return result;
    }

    public static call(name: string, data: string, callback?: Function) {
        console.log(data);
        const fn: Function = window[name];
        const params = this.parseJSON(data);
        if (typeof fn === "function") fn(params);
    }

    public static callback(name: string, data: Object | Object[]) {
        const params = this.stringJSON(data);
        if (Android) {
            Android.emit(name, params)
        } else if (iOS) {
            iOS.postMessage({ name, data })
        } else {
            console.error("Cannot find Bridge object")
        }
    }
}