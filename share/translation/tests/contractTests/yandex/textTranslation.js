"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    jqunit = require("node-jqunit");
require("dotenv").config();//npm package to get variables from '.env' file

var makeRequest = require("request");//npm package used to make requests to third-party services used

require("../../../../testUtils");

kettle.loadTestingSupport();

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    ACS = fluid.registerNamespace("ACS");
fluid.registerNamespace("adaptiveContentService.tests.translation.yandex.contractTests.translateText");

//grade getting us data from the yandex service
fluid.defaults("adaptiveContentService.tests.translation.yandex.contractTests.translateText", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.translation.yandex.contractTests.translateText.getData",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        }
    }
});

adaptiveContentService.tests.translation.yandex.contractTests.translateText.getData = function (sourceLang, targetLang, text, serviceKey, that) {
    makeRequest.post(
        {
            url: "https://translate.yandex.net/api/v1.5/tr.json/translate?key=" + serviceKey + "&lang=" + sourceLang + "-" + targetLang,
            form: {
                text: text
            }
        },
        function (error, response, body) {
            //error making request to external service
            if (error) {
                ACS.log("Contract Test (Yandex - Translation) - Error occured while making request to the external service - " + error);
                jqunit.fail("Contract Test : For text translation failed due to error making request to the external service (Yandex Service)");
            }
            else {
                var jsonBody;

                //check for the presence of response body
                try {
                    jsonBody = JSON.parse(body);
                    that.events.onDataReceive.fire(jsonBody);
                }
                catch (err) {
                    ACS.log("Contract Test (Yandex - Translation) - Error occured while parsing the response body; body should be JSON pareseable -  " + err);
                    ACS.log("Contract Test (Yandex - Translation) - Response body - \n" + body);
                    jqunit.fail("Contract Test : For text translation failed due to error parsing with parsing response body into JSON");
                }
            }
        }
    );
};

// test handler function
adaptiveContentService.tests.translation.yandex.contractTests.translateText.handler = function (data, schema, successMessage, failureMessage) {
    var Ajv = require("ajv");
    // require('ajv-merge-patch')(ajv);
    var ajv = new Ajv({ allErrors: true });

    var validate = ajv.compile(schema),
        valid = validate(data);

    if (valid) {
        jqunit.assert("\n\n" + successMessage + "\n");
    }
    else {
        var errors = validate.errors;
        adaptiveContentService.tests.utils.logAjvErrors(errors);
        jqunit.fail("\n\n" + failureMessage + "\n");
    }
};

//Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.translation.yandex.contractTests.translateText.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.translation.yandex.contractTests.translateText"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.translation.yandex.contractTests.translateText.tester"
        }
    }
});

var textTranslationSchemas = require("./schemas/textTranslationSchemas"); //main schemas which will be compiled

var successMessage = {
    noError: "Contract Test : For text translation with 'no error' response successful (Yandex Service)",
    unsupportedTranslationDirection: "Contract Test : For text translation for unsupported translation direction successful (Yandex Service)",
    wrongKey: "Contract Test : For text translation with wrong service api key successful (Yandex Service)"
};

var failureMessage = {
    noError: "Contract Test : For text translation with 'no error' response failed (Yandex Service)",
    unsupportedTranslationDirection: "Contract Test : For text translation for unsupported translation direction failed (Yandex Service)",
    wrongKey: "Contract Test : For text translation with wrong service api key failed (Yandex Service)"
};

//mock data
var mockTranslationData = require("../../mockData/yandex/translation");

//Test driver
fluid.defaults("adaptiveContentService.tests.translation.yandex.contractTests.translateText.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For text translation (Yandex Service)",
        tests: [
            {
                expect: 3,
                name: "Contract Tests : For text translation (Yandex Service)",
                sequence: [
                    //for 'no error' response
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockTranslationData.sourceLang.correct, mockTranslationData.targetLang.correct, mockTranslationData.text.noError, mockTranslationData.apiKey.correct]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.translation.yandex.contractTests.translateText.handler",
                        args: ["{arguments}.0", textTranslationSchemas.noError,  successMessage.noError, failureMessage.noError]
                    },
                    //for unsupported translation direction
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockTranslationData.sourceLang.wrong, mockTranslationData.
                          targetLang.correct, mockTranslationData.text.noError, mockTranslationData.apiKey.correct]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.translation.yandex.contractTests.translateText.handler",
                        args: ["{arguments}.0", textTranslationSchemas.error,  successMessage.unsupportedTranslationDirection, failureMessage.unsupportedTranslationDirection]
                    },
                    //for wrong service key
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockTranslationData.sourceLang.correct, mockTranslationData.targetLang.correct, mockTranslationData.text.noError, mockTranslationData.apiKey.invalid]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.translation.yandex.contractTests.translateText.handler",
                        args: ["{arguments}.0", textTranslationSchemas.error,  successMessage.wrongKey, failureMessage.wrongKey]
                    }
                ]
            }
        ]
    }]
});

var serviceKey = adaptiveContentService.tests.utils.getYandexServiceKey(),
    testTree = adaptiveContentService.tests.translation.yandex.contractTests.translateText.testTree;

adaptiveContentService.tests.utils.checkYandexKeys(serviceKey, testTree, "Text Translation (Yandex) Contract test");
