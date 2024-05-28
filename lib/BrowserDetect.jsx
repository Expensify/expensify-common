import {isNavigatorAvailable, isWindowAvailable} from './utils';

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
    if (!isWindowAvailable() || !isNavigatorAvailable()) {
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

function getMobileDevice() {
    if (!isNavigatorAvailable()) {
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

    for (let i = 0; i < data.length; i++) {
        const {devices, identity} = data[i];
        for (let j = 0; j < devices.length; j++) {
            if (dataString.indexOf(devices[j]) !== -1) {
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
