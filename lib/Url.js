import TLD_REGEX from './tlds';
import {MAX_URL_HOSTNAME_LABEL_LENGTH, MAX_URL_HOSTNAME_LENGTH} from './CONST';

const ALLOWED_PORTS = '([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])';
const URL_PROTOCOL_REGEX = '((ht|f)tps?:\\/\\/)';
const MAX_URL_HOSTNAME_LABEL_BODY_LENGTH = MAX_URL_HOSTNAME_LABEL_LENGTH - 2;
const URL_HOSTNAME_LABEL_REGEX = `[a-z0-9](?=(?<label>[-a-z0-9]{0,${MAX_URL_HOSTNAME_LABEL_BODY_LENGTH}}[a-z0-9])?)\\k<label>`;
const LOOSE_URL_HOSTNAME_LABEL_REGEX = `(?!-)[-a-z0-9]{1,${MAX_URL_HOSTNAME_LABEL_LENGTH}}(?<!-)`;
// Reject oversized hostnames without counting the port, path, query, fragment, or trailing punctuation.
const URL_HOSTNAME_MAX_LENGTH_ASSERTION = `(?![-a-z0-9.]{${MAX_URL_HOSTNAME_LENGTH}}[-a-z0-9.]*[a-z0-9](?:\\b|(?=_)))`;
const URL_WEBSITE_REGEX = `${URL_PROTOCOL_REGEX}?(?<![a-z0-9.])${URL_HOSTNAME_MAX_LENGTH_ASSERTION}((?:www\\.)?${URL_HOSTNAME_LABEL_REGEX}\\.)+(?:${TLD_REGEX})\
(?:\\:${ALLOWED_PORTS}|\\b|(?=_))(?!@(?:[a-z\\d-]+\\.)+[a-z]{2,})`;
const addEscapedChar = (reg) => `(?:${reg}|&(?:amp|#x27);)`;
const URL_PATH_REGEX = `(?:${addEscapedChar('[.,=(+$!*]')}?\\/${addEscapedChar('[-\\w$@.+!*:(),=%~]')}*${addEscapedChar('[-\\w~@:%)]')}|\\/)*`;
const URL_PARAM_REGEX = `(?:\\?${addEscapedChar('[-\\w$@.+!*()\\/,=%{}:;\\[\\]\\|_|~]')}+)?`;
const URL_FRAGMENT_REGEX = `(?:#${addEscapedChar('[-\\w$@.+!*()[\\],=%;\\/:~]')}*)?`;
const URL_REGEX = `((${URL_WEBSITE_REGEX})${URL_PATH_REGEX}(?:${URL_PARAM_REGEX}|${URL_FRAGMENT_REGEX})*)`;

const URL_REGEX_WITH_REQUIRED_PROTOCOL = URL_REGEX.replace(`${URL_PROTOCOL_REGEX}?`, URL_PROTOCOL_REGEX);

const LOOSE_URL_WEBSITE_REGEX = `${URL_PROTOCOL_REGEX}${URL_HOSTNAME_MAX_LENGTH_ASSERTION}(${LOOSE_URL_HOSTNAME_LABEL_REGEX}(?:\\.${LOOSE_URL_HOSTNAME_LABEL_REGEX})*)(?:\\:${ALLOWED_PORTS}|\\b|(?=_))`;
const LOOSE_URL_REGEX = `((${LOOSE_URL_WEBSITE_REGEX})${URL_PATH_REGEX}(?:${URL_PARAM_REGEX}|${URL_FRAGMENT_REGEX})*)`;

const MARKDOWN_URL_REGEX = `(${LOOSE_URL_REGEX}|${URL_REGEX})`;

export {
    URL_WEBSITE_REGEX,
    URL_PATH_REGEX,
    URL_PARAM_REGEX,
    URL_FRAGMENT_REGEX,
    URL_REGEX,
    URL_REGEX_WITH_REQUIRED_PROTOCOL,
    URL_PROTOCOL_REGEX,
    LOOSE_URL_REGEX,
    LOOSE_URL_WEBSITE_REGEX,
    MARKDOWN_URL_REGEX,
};
