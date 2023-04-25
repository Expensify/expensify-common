import TLD_REGEX from './tlds';

const URL_WEBSITE_REGEX = `(https?:\\/\\/)?((?:www\\.)?[a-z0-9](?:[-a-z0-9]*[a-z0-9])?\\.)+(?:${TLD_REGEX})(?:\\:\\d{2,4}|\\b|(?=_))`;
const addEscapedChar = reg => `(?:${reg}|&(?:amp|quot|#x27);)`;
const URL_PATH_REGEX = `(?:${addEscapedChar('[.,=(+$!*]')}?\\/${addEscapedChar('[-\\w$@.+!*:(),=%~]')}*${addEscapedChar('[-\\w~@:%)]')}|\\/)*`;
const URL_PARAM_REGEX = `(?:\\?${addEscapedChar('[-\\w$@.+!*()\\/,=%{}:;\\[\\]\\|_]')}*)?`;
const URL_FRAGMENT_REGEX = `(?:#${addEscapedChar('[-\\w$@.+!*()[\\],=%;\\/:~]')}*)?`;
const URL_REGEX = `(${URL_WEBSITE_REGEX}${URL_PATH_REGEX}(?:${URL_PARAM_REGEX}|${URL_FRAGMENT_REGEX})*)`;

const URL_REGEX_WITH_REQUIRED_PROTOCOL = URL_REGEX.replace(`${URL_PROTOCOL_REGEX}?`, URL_PROTOCOL_REGEX);

export {
    URL_WEBSITE_REGEX,
    URL_PATH_REGEX,
    URL_PARAM_REGEX,
    URL_FRAGMENT_REGEX,
    URL_REGEX,
    URL_REGEX_WITH_REQUIRED_PROTOCOL,
    URL_PROTOCOL_REGEX,
};
