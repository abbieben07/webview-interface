
export declare class WebViewInterface {
    declare parseJSON(data: string): any

    declare emit(eventName: string, data: any): void

    declare on(eventName: string, callback: () => void): void

    declare off(eventName: string, callback: () => void): void

    declare once(eventName: string, callback: () => void): void
}