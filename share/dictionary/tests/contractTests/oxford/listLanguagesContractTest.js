"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");
require("dotenv").config();//npm package to get variables from '.env' file

var makeRequest = require("request");//npm package used to make requests to third-party services used

require("../../../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService"),
    ACS = fluid.registerNamespace("ACS");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.oxford.contractTests.listLanguages");

//grade getting us data from the oxford service
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.listLanguages", {
    gradeNames: ["fluid.component"],
    events: {
        onDataReceive: null
    },
    invokers: {
        requestForData: {
            funcName: "adaptiveContentService.tests.dictionary.oxford.contractTests.listLanguages.getData",
            args: ["{arguments}.0", "{that}"]
        }
    }
});

adaptiveContentService.tests.dictionary.oxford.contractTests.listLanguages.getData = function (apiKeys, that) {
    makeRequest(
        {
            url: "https://od-api.oxforddictionaries.com/api/v1/languages",
            headers: apiKeys
        },
        function (error, response, body) {
            //error making request to external service
            if (error) {
                ACS.log("Contract Test (Oxford - List Languages) : Error occured while making request to the external service - " + error);
                jqunit.fail("Contract Test : For 'list languages' failed due to error making request to the external service (Oxford Service)");
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
                    ACS.log("Contract Test (Oxford - List Languages) : Response from the external service SHOULD have 'body' property");
                    jqunit.fail("Contract Test : For 'list languages' failed (Oxford Service)");
                }
            }
        }
    );
};

//Testing environment - holds test component and calls the test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.listLanguages.testTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        testComponent: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.listLanguages"
        },
        //test driver
        tester: {
            type: "adaptiveContentService.tests.dictionary.oxford.contractTests.listLanguages.tester"
        }
    }
});

// mock data
var mockListLanguagesData = require("../../mockData/oxford/listLanguages");

var listLanguagesSchemas = require("./schemas/listLanguagesSchemas"), //main schemas which will be compiled
    commonSchemas = require("./schemas/commonSchemas"); //commonly used schemas

//array of all the schemas that are needed (other than the main schema)
var allNeededSchemas = {
    noError: [commonSchemas.oxfordResponseProperty],
    authError: [commonSchemas.oxfordResponseProperty]
};

var successMessage = {
    noError: "Contract Test : For list languages with 'no error' response successful (Oxford Service)",
    authError: "Contract Test : For list languages with wrong api keys successful (Oxford Service)"
};

var failureMessage = {
    noError: "Contract Test : For list languages with 'no error' response failed (Oxford Service)",
    authError: "Contract Test : For list languages with wrong api keys failed (Oxford Service)"
};

//Test driver
fluid.defaults("adaptiveContentService.tests.dictionary.oxford.contractTests.listLanguages.tester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Contract Tests : For list languages (Oxford Service)",
        tests: [
            {
                expect: 2,
                name: "Contract Tests : For list languages (Oxford Service)",
                sequence: [
                    //for no error
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockListLanguagesData.apiKeys.correct]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", listLanguagesSchemas.noError, allNeededSchemas.noError, successMessage.noError, failureMessage.noError]
                    },
                    // for authentication fail
                    {
                        func: "{testComponent}.requestForData",
                        args: [mockListLanguagesData.apiKeys.wrong]
                    },
                    {
                        event: "{testComponent}.events.onDataReceive",
                        listener: "adaptiveContentService.tests.utils.contractTestHandler",
                        args: ["{arguments}.0", listLanguagesSchemas.authError, allNeededSchemas.authError, successMessage.authError, failureMessage.authError]
                    }
                ]
            }
        ]
    }]
});

var testTree = adaptiveContentService.tests.dictionary.oxford.contractTests.listLanguages.testTree;

adaptiveContentService.tests.utils.checkOxfordKeys(mockListLanguagesData.apiKeys.correct, testTree, "List Languages (Oxford) Contract test");
