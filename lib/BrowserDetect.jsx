import * as Utils from './utils';

const BROWSERS = {
    EDGE: 'Edge',
    CHROME: 'Chrome',
    SAFARI: 'Safari',
    OPERA: 'Opera',
    EXPLORER: 'Explorer',
    MOZILLA: 'Mozilla',
};

const MOBILE_PLATFORMS = {
    iOS: 'iOS',
    android: 'android',
};

function searchString() {
    if (!Utils.isWindowAvailable() || !Utils.isNavigatorAvailable()) {
        return '';
    }

    const data = [
        {
            string: navigator.userAgent,
            subString: 'Edge',
            identity: BROWSERS.EDGE,
        },
        {
            string: navigator.userAgent,
            subString: 'Chrome',
            identity: BROWSERS.CHROME,
        },
        {
            string: navigator.vendor,
            subString: 'Apple',
            identity: BROWSERS.SAFARI,
        },
        {
            prop: window.opera,
            identity: BROWSERS.OPERA,
        },
        {
            string: navigator.userAgent,
            subString: 'Edge',
            identity: BROWSERS.EDGE,
        },
        {
            string: navigator.userAgent,
            subString: 'MSIE',
            identity: BROWSERS.EXPLORER,
        },
        {
            string: navigator.userAgent,
            subString: '.NET',
            identity: BROWSERS.EXPLORER,
        },
        {
            string: navigator.userAgent,
            subString: 'Gecko',
            identity: BROWSERS.MOZILLA,
        },
    ];
    let dataString;
    let dataProp;

    for (const item of data) {
        dataString = item.string;
        dataProp = item.prop;
        if (dataString) {
            if (dataString.indexOf(item.subString) !== -1) {
                return item.identity;
            }
        } else if (dataProp) {
            return item.identity;
        }
    }
    return '';
}

function getMobileDevice() {
    if (!Utils.isNavigatorAvailable() || !navigator.userAgent) {
        return '';
    }

    const data = [
        {
            devices: ['iPhone', 'iPad', 'iPod'],
            identity: MOBILE_PLATFORMS.iOS,
        },
        {
            devices: ['Android'],
            identity: MOBILE_PLATFORMS.android,
        },
    ];
    const dataString = navigator.userAgent;

    for (const {devices, identity} of data) {
        for (const device of devices) {
            if (dataString.indexOf(device) !== -1) {
                return identity;
            }
        }
    }
    return '';
}

export default {
    BROWSERS,
    MOBILE_PLATFORMS,
    browser: searchString(),
    mobileDevice: getMobileDevice(),
};
