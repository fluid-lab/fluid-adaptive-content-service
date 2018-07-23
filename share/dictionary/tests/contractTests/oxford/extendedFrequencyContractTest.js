"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");
require("dotenv").config();//npm package to get variables from '.env' file

var makeRequest = require("request");//npm package used to make requests to third-party services used

require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    ACS = fluid.registerNamespace("ACS");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency");

//grade getting us data from the oxford service
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.getData",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        }
    }
});

adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.getData = function (word, lang, lexicalCategory, apiKeys, that) {
    makeRequest(
        {
            url: "https://od-api.oxforddictionaries.com/api/v1/stats/frequency/word/" + lang + "/?lemma=" + word + "&lexicalCategory=" + lexicalCategory,
            headers: apiKeys
        },
        function (error, response, body) {
            //error making request to external service
            if (error) {
                ACS.log("Contract Test (Oxford - Extended Frequency) : Error occured while making request to the external service - " + error);
                jqunit.fail("Contract Test : For extended frequency failed due to error making request to the external service (Oxford Service)");
            }
            else {
                var jsonBody;

                //check for the presence of response body
                if (body) {
                    try {
                        jsonBody = JSON.parse(body);
                    }
                    catch (err) {
                        jsonBody = body;
                    }

                    var data = {
                        response: response,
                        body: body,
                        jsonBody: jsonBody
                    };

                    that.events.onDataReceive.fire(data);
                }
                else {
                    ACS.log("Contract Test (Oxford - Extended Frequency) : Response from the external service SHOULD have 'body' property");
                    jqunit.fail("Contract Test : For extended frequency failed (Oxford Service)");
                }
            }
        }
    );
};

//Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.tester"
        }
    }
});

// mock data
var mockExtendedFrequencyData = require("../../mockData/oxford/extendedFrequency");

var extendedFrequencySchemas = require("./schemas/extendedFrequencySchemas"), //main schemas which will be compiled
    frequencySchemas = require("./schemas/frequencySchemas"), //frequency schema
    commonSchemas = require("./schemas/commonSchemas"); //commonly used schemas


//array of all the schemas that are needed (other than the main schema)
var allNeededSchemas = {
    correctWord: [commonSchemas.oxfordResponseProperty, frequencySchemas.correctWord],
    wrongLang: [commonSchemas.oxfordResponseProperty]
};

var successMessage = {
    correctWord: "Contract Test : For extended frequency with correct word and language successful (Oxford Service)",
    wrongLang: "Contract Test : For extended frequency with wrong language successful (Oxford Service)"
};

var failureMessage = {
    correctWord: "Contract Test : For extended frequency with correct word and language failed (Oxford Service)",
    wrongLang: "Contract Test : For extended frequency with wrong language failed (Oxford Service)"
};

//Test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For extended frequency (Oxford Service)",
        tests: [
            {
                expect: 2,
                name: "Contract Tests : For extended frequency (Oxford Service)",
                sequence: [
                    //for correct word
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockExtendedFrequencyData.word.correct, mockExtendedFrequencyData.lang.correct, mockExtendedFrequencyData.lexicalCategory, mockExtendedFrequencyData.apiKeys.correct]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", extendedFrequencySchemas.correctWord, allNeededSchemas.correctWord, successMessage.correctWord, failureMessage.correctWord]
                    },
                    //for wrong language
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockExtendedFrequencyData.word.correct, mockExtendedFrequencyData.lang.wrong, mockExtendedFrequencyData.lexicalCategory, mockExtendedFrequencyData.apiKeys.correct]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", extendedFrequencySchemas.wrongLang, allNeededSchemas.wrongLang, successMessage.wrongLang, failureMessage.wrongLang]
                    }
                ]
            }
        ]
    }]
});

/*
 * No wrong word test here
 * because the frequency is returned 0 for them
 */

var testTree = adaptiveContentService.tests.dictionary.oxford.contractTests.extendedFrequency.testTree;

adaptiveContentService.tests.utils.checkOxfordKeys(mockExtendedFrequencyData.apiKeys.correct, testTree, "Frequency (Oxford) Contract test (Extended)");
