import _ from 'lodash';
import * as Constants from './CONST';

const isVideoFile = (fileName: string) => {
    const lowerCaseFileName = fileName.toLowerCase();
    return _.some(Constants.CONST.VIDEO_EXTENSIONS, (ext) => lowerCaseFileName.endsWith(ext));
};

export {
    // eslint-disable-next-line import/prefer-default-export
    isVideoFile,
};
