"use strict";

var fluid = require("infusion"),
    makeRequest = require("request"); // npm package used to make requests to third-party services used

require("dotenv").config(); // npm package to get variables from '.env' file
require("../index");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.yandex.contractTests.listLanguages");

// grade getting us data from the yandex service
fluid.defaults("adaptiveContentService.tests.translation.yandex.contractTests.listLanguages", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.translation.yandex.contractTests.listLanguages.getData",
            args: ["{arguments}.0", "{that}"]
        }
    }
});

adaptiveContentService.tests.translation.yandex.contractTests.listLanguages.getData = function (serviceKey, that) {

    makeRequest.post(
        {
            url: "https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=" + serviceKey + "&ui=en"
        },
        function (error, response, body) {
            adaptiveContentService.tests.utils.yandexContractTestRequestHandler(error, body, "Yandex - List Supported Languages", that);
        }
    );
};

// Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.translation.yandex.contractTests.listLanguages.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.translation.yandex.contractTests.listLanguages"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.translation.yandex.contractTests.listLanguages.tester"
        }
    }
});

var listLanguagesSchemas = require("./schemas/listLanguagesSchemas"); //main schemas which will be compiled

var successMessage = {
    noError: "Contract Test : For listing supported languages with 'no error' response successful (Yandex Service)",
    wrongKey: "Contract Test : For listing supported languages with wrong service api key successful (Yandex Service)"
};

var failureMessage = {
    noError: "Contract Test : For listing supported languages with 'no error' response failed (Yandex Service)",
    wrongKey: "Contract Test : For listing supported languages with wrong service api key failed (Yandex Service)"
};

//mock data
var mockListLanguages = require("../../mockData/yandex/listLanguages");

//Test driver
fluid.defaults("adaptiveContentService.tests.translation.yandex.contractTests.listLanguages.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For listing supported languages (Yandex Service)",
        tests: [
            {
                expect: 2,
                name: "Contract Tests : For listing supported languages (Yandex Service)",
                sequence: [
                    //for 'no error' response
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockListLanguages.correctApiKey]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", listLanguagesSchemas.noError, null, successMessage.noError, failureMessage.noError]
                    },
                    //for wrong service key
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockListLanguages.apiKey.invalid]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", listLanguagesSchemas.error, null, successMessage.wrongKey, failureMessage.wrongKey]
                    }
                ]
            }
        ]
    }]
});

var serviceKey = adaptiveContentService.tests.utils.getYandexServiceKey(),
    testTree = adaptiveContentService.tests.translation.yandex.contractTests.listLanguages.testTree;

adaptiveContentService.tests.utils.checkYandexKeys(serviceKey, testTree, "List Supported Languages (Yandex) Contract test");
