"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.unitTests.yandex.listLanguagesConstructResponse");

require("../../../../../v1/translation/handlers");

adaptiveContentService.tests.translation.unitTests.yandex.listLanguagesConstructResponse = function (testMessage, expectedReturnVal, serviceResponse) {
    var returnVal = adaptiveContentService.handlers.translation.yandex.listLanguages.constructResponse(serviceResponse);

    jqunit.assertDeepEq(testMessage, expectedReturnVal, returnVal);
};

// mock data
var mockListLangData = require("../../mockData/yandex/listLanguages");

var testServiceResponse = {
    body: {
        langs: mockListLangData.languageObj
    }
};

var expectedReturnVal = [
    {
        languageName: mockListLangData.languageObj.en,
        languageCode: "en"
    },
    {
        languageName: mockListLangData.languageObj.de,
        languageCode: "de"
    }
];

var testMessage = "Unit Test : For list supported languages constructResponse function : Successful";

jqunit.test(
    "Unit Test : For list supported languages constructResponse function (Translation Service)",
    function () {
        adaptiveContentService.tests.translation.unitTests.yandex.listLanguagesConstructResponse(testMessage, expectedReturnVal, testServiceResponse);
    }
);
