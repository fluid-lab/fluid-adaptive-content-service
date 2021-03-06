"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");
require("dotenv").config();

require("../index");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.translation.google.langDetection");

fluid.logObjectRenderChars = kettle.resolvers.env("CHAR_LIM");

kettle.loadTestingSupport();

// mock data
var mockLangDetectionData = require("../../index").mockData.google.langDetection;

/* testing grade for google lang detection - to override 'characterLimit' configuration
 * and 'requiredData' function
 * for the purpose of testing
 */
fluid.defaults("adaptiveContentService.test.handlers.translation.google.langDetection", {
    gradeNames: "adaptiveContentService.handlers.translation.google.langDetection",
    characterLimit: 40,
    authenticationOptions: {
        "api_key": mockLangDetectionData.apiKey.correct
    },
    invokers: {
        requiredData: "adaptiveContentService.test.handlers.translation.google.langDetection.requiredData"
    }
});

// function providing the required mock data (over-riding the actual function)
adaptiveContentService.test.handlers.translation.google.langDetection.requiredData = function (text) {
    return adaptiveContentService.tests.utils.googleLangDetectionRequiredData(text, mockLangDetectionData);
};

adaptiveContentService.tests.translation.google.langDetection = [{
    name: "Integration Test : POST request for the Language detection endpoint of Google Service",
    expect: 7,
    config: {
        configName: "translationServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/translation/config/"
    },
    components: {
        noError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        },
        emptyTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        },
        absentTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        },
        authError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect/",
                method: "post"
            }
        },
        cannotDetectLang: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        },
        longTextField: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        },
        requestError: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/translation/google/detect",
                method: "post"
            }
        }
    },
    sequence: [{
        func: "{noError}.send",
        args: { text: mockLangDetectionData.text.noError }
    },
    {
        event: "{noError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with no errors (Google Service)", 200, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{emptyTextField}.send",
        args: { text: mockLangDetectionData.text.empty }
    },
    {
        event: "{emptyTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with empty text field (Google Service)", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{absentTextField}.send",
        args: { text: mockLangDetectionData.text.absent }
    },
    {
        event: "{absentTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with absent text field (Google Service)", 400, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{authError}.send",
        args: { text: mockLangDetectionData.text.authErrorTrigger }
    },
    {
        event: "{authError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with wrong service key (Google Service)", 403, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{cannotDetectLang}.send",
        args: { text: mockLangDetectionData.text.numerical }
    },
    {
        event: "{cannotDetectLang}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for 'unable to detect lang' response (Google Service)", 404, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{longTextField}.send",
        args: { text: mockLangDetectionData.text.tooLong }
    },
    {
        event: "{longTextField}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for request with too long text field (Google Service)", 413, "{arguments}.1.nativeResponse.statusCode"]
    },
    {
        func: "{requestError}.send",
        args: { text: mockLangDetectionData.text.requestErrorTrigger }
    },
    {
        event: "{requestError}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Translation Tests : language detection test for error with making request (Google Service)", 500, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.translation.google.langDetection);
