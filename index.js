const ExpensiMark = require("./lib/ExpensiMark.js");

// const EMAIL_PART =
//     "([\\w\\-\\+\\'#]+(?:\\.[\\w\\-\\'\\+]+)*@(?:[\\w\\-]+\\.)+[a-z]{2,})";
// const PHONE_PART = "\\+?[1-9]\\d{1,14}";
// const regex = new RegExp(
//     `(@here|[a-zA-Z0-9.!$%&+=?^\`{|}-]?)(@${EMAIL_PART}|@${PHONE_PART})(?!((?:(?!<a).)+)?<\\/a>|[^<]*(<\\/pre>|<\\/code>))`,
//     "gim"
// );

// const replacement = (match, g1, g2) => {
//     console.log({ match, g1, g2 });
//     // if (!Str.isValidMention(match)) {
//     //     return match;
//     // }
//     return `${g1}<mention-user>${g2}</mention-user>`;
// };
const parser = new ExpensiMark();
console.log(parser.replace(`sdflkj! @251-1236-09879878989.kl`));
