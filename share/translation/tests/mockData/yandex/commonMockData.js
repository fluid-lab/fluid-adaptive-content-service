"use strict";

var commonMockTranslationData = require("../common/translation"),
    kettle = require("kettle");

module.exports = {
    // general data
    text: commonMockTranslationData.text,
    sourceLang: commonMockTranslationData.sourceLang,
    targetLang: commonMockTranslationData.targetLang,
    apiKey: {
        correct: "correctYandexApiKey",
        invalid: "randomstring",
        blocked: "blockedkey" //not actually blocked; used for mock response only
    },
    // for contract tests
    correctApiKey: kettle.resolvers.env("YANDEX_API_KEY"),
    // responses
    responses: {
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
        },
        requestError: {
            "code": 500,
            "message": "Internal Server Error - Error with making request to the external service"
        }
    }
};
