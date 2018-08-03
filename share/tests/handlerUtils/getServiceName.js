"use strict";

var fluid = require("infusion"),
    jqunit = require("node-jqunit");

var adaptiveContentService = fluid.registerNamespace("adaptiveContentService");
fluid.registerNamespace("adaptiveContentService.tests.dictionary.wiktionary.unitTests.getServiceName");

require("../../handlerUtils");

var testUrl = "/version/dictionary/serviceName/language/endpointName/word";

adaptiveContentService.tests.dictionary.wiktionary.unitTests.getServiceName = function () {
    var returnVal = adaptiveContentService.handlerUtils.getServiceName(testUrl);

    jqunit.assertEquals("Unit Test : For getServiceName function : Successful", "serviceName", returnVal);
};

jqunit.test(
    "Unit Test : For getServiceName function (Dictionary Service)",
    function () {
        adaptiveContentService.tests.dictionary.wiktionary.unitTests.getServiceName();
    }
);
