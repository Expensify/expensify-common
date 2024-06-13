import * as Constants from './CONST';

const isVideoFile = (fileName: string) => {
    const lowerCaseFileName = fileName.toLowerCase();
    return Constants.CONST.VIDEO_EXTENSIONS.some((ext) => lowerCaseFileName.endsWith(ext));
};

export {
    // eslint-disable-next-line import/prefer-default-export
    isVideoFile,
};
