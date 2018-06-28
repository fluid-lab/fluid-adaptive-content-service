"use strict";

var fluid = require("infusion");
var kettle = require("kettle");
require("dotenv").config();

require("../../../../../index.js");
require("../../testUtils");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.wiktionary.extendedFrequency");

fluid.logObjectRenderChars = "@expand:kettle.resolvers.env(CHAR_LIM)";

kettle.loadTestingSupport();

adaptiveContentService.tests.dictionary.wiktionary.extendedFrequency = [{
    name: "GET request for the Frequency (extended) dictionary endpoint of the Wiktionary Service",
    expect: 1,
    config: {
        configName: "dictionaryServerConfig",
        configPath: "%fluid-adaptive-content-service/v1/dictionary/config/"
    },
    components: {
        serviceNotProvidedTest: {
            type: "kettle.test.request.http",
            options: {
                path: "/v1/dictionary/wiktionary/en/frequency/word/noun",
                method: "get"
            }
        }
    },
    sequence: [{
        func: "{serviceNotProvidedTest}.send"
    },
    {
        event: "{serviceNotProvidedTest}.events.onComplete",
        listener: "adaptiveContentService.tests.utils.assertStatusCode",
        args: ["Dictionary Tests : Frequency (extended) test for Wiktionary Service successful", 400, "{arguments}.1.nativeResponse.statusCode"]
    }
    ]
}];

kettle.test.bootstrapServer(adaptiveContentService.tests.dictionary.wiktionary.extendedFrequency);
