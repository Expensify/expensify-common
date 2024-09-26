type Extras = {
    reportIDToName?: Record<string, string>;
    accountIDToName?: Record<string, string>;
    mediaAttributeCachingFn?: (mediaSource: string, attrs: string) => void;
    mediaAttributeCache?: Record<string, string>;
};

export default Extras;
