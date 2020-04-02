const BROWSERS = {
    EDGE: 'Edge',
    CHROME: 'Chrome',
    SAFARI: 'Safari',
    OPERA: 'Opera',
    EXPLORER: 'Explorer',
    MOZILLA: 'Mozilla'
};

function searchString() {
    const data = [{
        string: navigator.userAgent,
        subString: 'Edge',
        identity: BROWSERS.EDGE
    }, {
        string: navigator.userAgent,
        subString: 'Chrome',
        identity: BROWSERS.CHROME
    }, {
        string: navigator.vendor,
        subString: 'Apple',
        identity: BROWSERS.SAFARI,
    }, {
        prop: window.opera,
        identity: BROWSERS.OPERA,
    }, {
        string: navigator.userAgent,
        subString: 'Edge',
        identity: BROWSERS.EDGE
    }, {
        string: navigator.userAgent,
        subString: 'MSIE',
        identity: BROWSERS.EXPLORER
    }, {
        string: navigator.userAgent,
        subString: '.NET',
        identity: BROWSERS.EXPLORER
    }, {
        string: navigator.userAgent,
        subString: 'Gecko',
        identity: BROWSERS.MOZILLA
    }];
    let dataString;
    let dataProp;

    for (let i = 0; i < data.length; i++) {
        dataString = data[i].string;
        dataProp = data[i].prop;
        if (dataString) {
            if (dataString.indexOf(data[i].subString) !== -1) {
                return data[i].identity;
            }
        } else if (dataProp) {
            return data[i].identity;
        }
    }
    return '';
}

export default {
    BROWSERS: {
        ...BROWSERS
    },
    browser: searchString()
};
