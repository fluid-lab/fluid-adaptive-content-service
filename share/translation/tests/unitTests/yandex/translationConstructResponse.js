"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.yandex.translationConstructResponse");

require("../index");

adaptiveContentService.tests.translation.unitTests.yandex.translationConstructResponse = function (testMessage, expectedReturnVal, serviceResponse, sourceText) {
    var returnVal = adaptiveContentService.handlers.translation.yandex.translationConstructResponse(serviceResponse, sourceText);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

// mock data
var mockTranslationData = require("../../index").mockData.yandex.translation;

var testServiceResponse = {
    body: mockTranslationData.responses.noError
};

var expectedReturnVal = {
    sourceLang: mockTranslationData.sourceLang.correct,
    targetLang: mockTranslationData.targetLang.correct,
    sourceText: mockTranslationData.text.noError,
    translatedText: testServiceResponse.body.text
};

var testMessage = "Unit Test : For translation translationConstructResponse function (Yandex) : Successful";

jqunit.test(
    "Unit Test : For translation translationConstructResponse function (Yandex Service)",
    function () {
        adaptiveContentService.tests.translation.unitTests.yandex.translationConstructResponse(testMessage, expectedReturnVal, testServiceResponse, mockTranslationData.text.noError);
    }
);
