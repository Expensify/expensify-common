import {UAParser} from 'ua-parser-js';

type DeviceInfo = {
    os: string | undefined;
    osVersion: string | undefined;
    deviceName: string | undefined;
    deviceVersion: string | undefined;
};

function getOSAndName(): DeviceInfo {
    const parser = new UAParser();
    const {browser, os} = parser.getResult();

    let osVersion = os.version;
    // Detection logic inspired by UAParser guide on iOS 26:
    // https://docs.uaparser.dev/guides/how-to-detect-ios-26-using-javascript.html
    const [osMajor, osMinor] = (os.version ?? '').split('.');
    const osMajorInt = parseInt(osMajor, 10);
    const osMinorInt = parseInt(osMinor, 10);
    if (browser.name === 'Mobile Safari' && browser.major === '26' && os.name === 'iOS' && (osMajorInt > 18 || (osMajorInt === 18 && osMinorInt >= 6))) {
        osVersion = '26';
    }

    return {
        os: os.name,
        osVersion,
        deviceName: browser.name,
        deviceVersion: browser.version,
    };
}

export {
    // eslint-disable-next-line import/prefer-default-export
    getOSAndName,
};
