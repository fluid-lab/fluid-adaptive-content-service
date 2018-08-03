"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");
require("dotenv").config();//npm package to get variables from '.env' file

var makeRequest = require("request");//npm package used to make requests to third-party services used

require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    ACS = fluid.registerNamespace("ACS");
fluid.registerNamespace("adaptiveContentService.tests.translation.yandex.contractTests.langDetection");

//grade getting us data from the yandex service
fluid.defaults("adaptiveContentService.tests.translation.yandex.contractTests.langDetection", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.translation.yandex.contractTests.langDetection.getData",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        }
    }
});

adaptiveContentService.tests.translation.yandex.contractTests.langDetection.getData = function (text, serviceKey, that) {

    makeRequest.post(
        {
            url: "https://translate.yandex.net/api/v1.5/tr.json/detect?key=" + serviceKey,
            form: {
                text: text
            }
        },
        function (error, response, body) {
            //error making request to external service
            if (error) {
                ACS.log("Contract Test (Yandex - Language Detection) - Error occured while making request to the external service - " + error);
                jqunit.fail("Contract Test : For language detection failed due to error making request to the external service (Yandex Service)");
            }
            else {
                var jsonBody;

                //check for the presence of response body
                try {
                    jsonBody = JSON.parse(body);
                    that.events.onDataReceive.fire(jsonBody);
                }
                catch (err) {
                    ACS.log("Contract Test (Yandex - Language Detection) - Error occured while parsing the response body; body should be JSON pareseable -  " + err);
                    ACS.log("Contract Test (Yandex - Language Detection) - Response body - \n" + body);
                    jqunit.fail("Contract Test : For language detection failed due to error parsing response body into JSON");
                }
            }
        }
    );
};

//Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.translation.yandex.contractTests.langDetection.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.translation.yandex.contractTests.langDetection"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.translation.yandex.contractTests.langDetection.tester"
        }
    }
});

var langDetectionSchemas = require("./schemas/langDetectionSchemas"); //main schemas which will be compiled

//mock data
var mockLangDetectionData = require("../../mockData/yandex/langDetection");

var successMessage = {
    noError: "Contract Test : For language detection with 'no error' response successful (Yandex Service)",
    cannotDetect: "Contract Test : For language detection with 'unable to detect lang' response successful (Yandex Service)",
    wrongKey: "Contract Test : For language detection with wrong service api key successful (Yandex Service)"
};

var failureMessage = {
    noError: "Contract Test : For language detection with 'no error' response failed (Yandex Service)",
    cannotDetect: "Contract Test : For language detection with 'unable to detect lang' response failed (Yandex Service)",
    wrongKey: "Contract Test : For language detection with wrong service api key failed (Yandex Service)"
};

//Test driver
fluid.defaults("adaptiveContentService.tests.translation.yandex.contractTests.langDetection.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For language detection (Yandex Service)",
        tests: [
            {
                expect: 3,
                name: "Contract Tests : For language detection (Yandex Service)",
                sequence: [
                    //for 'no error' response
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockLangDetectionData.text.noError, mockLangDetectionData.apiKey.correct]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", langDetectionSchemas.noError, null, successMessage.noError, failureMessage.noError]
                    },
                    //for 'unable to detect lang' response
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockLangDetectionData.text.numerical, mockLangDetectionData.apiKey.correct]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", langDetectionSchemas.cannotDetect, null, successMessage.cannotDetect, failureMessage.cannotDetect]
                    },
                    //for wrong service key
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockLangDetectionData.text.noError, mockLangDetectionData.apiKey.invalid]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", langDetectionSchemas.error, null, successMessage.wrongKey, failureMessage.wrongKey]
                    }
                ]
            }
        ]
    }]
});

var serviceKey = adaptiveContentService.tests.utils.getYandexServiceKey(),
    testTree = adaptiveContentService.tests.translation.yandex.contractTests.langDetection.testTree;

adaptiveContentService.tests.utils.checkYandexKeys(serviceKey, testTree, "Language Detection (Yandex) Contract test");
