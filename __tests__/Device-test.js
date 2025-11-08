import {getOSAndName} from '../lib/Device';

let mockUA;
jest.mock('ua-parser-js', () => {
    const actual = jest.requireActual('ua-parser-js');
    return {
        ...actual,
        UAParser: function mockUAParser() {
            return new actual.UAParser(mockUA);
        },
    };
});

const UA_IOS_18_1 = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1';
const UA_IOS_18_2 = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1';

const UA_IOS_26_1 = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1';
const UA_IOS_26_2 = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Mobile/15E148 Safari/604.1';
const UA_IOS_26_3 = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Mobile/15E148 Safari/604.1';
const UA_IOS_26_4 = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_10 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1.2 Mobile/15E148 Safari/604.1';
const UA_IOS_26_5 = 'Mozilla/5.0 (iPhone; CPU iPhone OS 19_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6.2 Mobile/15E148 Safari/604.1';

describe('getOSAndName', () => {
    it('should return iOS version 18', () => {
        mockUA = UA_IOS_18_1;
        expect(getOSAndName().osVersion).toEqual('18.6');

        mockUA = UA_IOS_18_2;
        expect(getOSAndName().osVersion).toEqual('18.5');
    });

    it('should return iOS version 26', () => {
        mockUA = UA_IOS_26_1;
        expect(getOSAndName().osVersion).toEqual('26');

        mockUA = UA_IOS_26_2;
        expect(getOSAndName().osVersion).toEqual('26');

        mockUA = UA_IOS_26_3;
        expect(getOSAndName().osVersion).toEqual('26');

        mockUA = UA_IOS_26_4;
        expect(getOSAndName().osVersion).toEqual('26');

        mockUA = UA_IOS_26_5;
        expect(getOSAndName().osVersion).toEqual('26');
    });
});
