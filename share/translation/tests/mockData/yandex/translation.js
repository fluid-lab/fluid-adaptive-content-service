"use strict";

module.exports = {
    // general data
    text: {
        noError: "This is the text to be translated",
        empty: "",
        absent: undefined,
        limitExceeded: "This test will trigger limit exceeded endpoint"
    },
    sourceLang: {
        correct: "en",
        wrong: "eng",
        invalid: "english"
    },
    targetLang: {
        correct: "de",
        wrong: "ger",
        invalid: "german"
    },
    apiKey: {
        correct: process.env.YANDEX_APP_KEY,
        invalid: "randomstring",
        blocked: "blockedkey"
    },
    // responses
    noError: {
        "code": 200,
        "lang": this.sourceLang + "-" + this.targetLang,
        "text": [ "Dies ist der text, der übersetzt werden" ]
    },
    keyInvalid: {
        "code": 401,
        "message": "API key is invalid"
    },
    keyBlocked: {
        "code": 402,
        "message": "API key is blocked"
    },
    limitExceeded: {
        "code": 404,
        "message": "Exceeded the daily limit on the amount of translated text"
    },
    unsupportedTranslation: {
        "code": 501,
        "message": "The specified translation direction is not supported"
    },
    invalidLangCode: {
        "code": 502,
        "message": "Invalid 'lang' parameter"
    }
};
