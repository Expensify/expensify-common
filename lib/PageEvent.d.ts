declare function PageEvent(
    eventName: string,
    callback: Function,
): {
    subscribe(scope: any): void;
    unsubscribe(): void;
};

declare class PageEvent {
    constructor(eventName: string, callback: Function);
}

export default PageEvent;
