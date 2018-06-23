"use strict";

var fluid = require("infusion");
var adaptiveContentServices = fluid.registerNamespace("adaptiveContentServices");

require("kettle");

var wd = require("word-definition");

//Specific grade for Wiktionary
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary", {
    gradeNames: "adaptiveContentServices.handlers.dictionary",
    invokers: {
        checkDictionaryErrorImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.checkDictionaryError",
        dictionaryHandlerImpl: "fluid.notImplemented",
        requiredDataImpl: "fluid.notImplemented"
    }
});

//function  to catch the errors for wiktionary service (common to all endpoints provided by wiktionary grade)
adaptiveContentServices.handlers.dictionary.wiktionary.checkDictionaryError = function (serviceResponse) {

    //Check if there is an error
    if (serviceResponse.err) {

        //Word not found
        if (serviceResponse.err === "not found") {
            return {
                statusCode: 404,
                errorMessage: "Word not found"
            };
        }

        //Language unsupported by the third-party service
        else if (serviceResponse.err === "unsupported language") {
            return {
                statusCode: 404,
                errorMessage: "Unsupported Language: Only English (en), French (fr) and German (de) are supported right now"
            };
        }

        //Default return object when error hasn"t been handled yet
        else {
            return {
                statusCode: 500,
                errorMessage: "The error hasn\"t been handled yet"
            };
        }
    }

    //Return false if no error found
    else {
        return;
    }
};

//Wiktionary definition grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.definition", {
    gradeNames: "adaptiveContentServices.handlers.dictionary.wiktionary",
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.definition.getDefinition",
            args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.definition.requiredData"
    }
});

//Wiktionary definition handler
adaptiveContentServices.handlers.dictionary.wiktionary.definition.getDefinition = function (request, version, word, lang, that) {
    try {
        //Check for long URI
        if (!that.uriErrHandler(request, version, word, "Wiktionary")) {
            var serviceResponse, errorContent;

            that.requiredDataImpl(lang, word)
            .then(
                function (result) {
                    serviceResponse = result;

                    errorContent = that.checkDictionaryErrorImpl(serviceResponse);

                    var message;

                    //Error Responses
                    if (errorContent) {
                        message = errorContent.errorMessage;
                        var statusCode = errorContent.statusCode;

                        that.sendErrorResponse(request, version, "Wiktionary", statusCode, message);
                    }
                    //No error : Word found
                    else {
                        message = "Word Found";
                        var jsonResponse = {
                            word: serviceResponse.word,
                            entries: [
                                {
                                    category: serviceResponse.category,
                                    definitions: [serviceResponse.definition]
                                }
                            ]
                        };

                        that.sendSuccessResponse(request, version, "Wiktionary", 200, "Word Found", jsonResponse);
                    }
                }
            );
        }
    }
    //Error with the API code
    catch (error) {
        var message = "Internal Server Error: " + error;

        that.sendErrorResponse(request, version, "Wiktionary", 500, message);
    }
};

//function to get definition from the wiktionary service
adaptiveContentServices.handlers.dictionary.wiktionary.definition.requiredData = function (lang, word) {
    var promise = fluid.promise();
    wd.getDef(word, lang, null, function (data) {
        promise.resolve(data);
    });
    return promise;
};

//Wiktionary "Service not provided" grade
fluid.defaults("adaptiveContentServices.handlers.dictionary.wiktionary.serviceNotProvided", {
    gradeNames: ["adaptiveContentServices.handlers.dictionary.wiktionary"],
    invokers: {
        dictionaryHandlerImpl: {
            funcName: "adaptiveContentServices.handlers.dictionary.wiktionary.serviceNotProvided.handlerImpl",
            args: ["{arguments}.0", "{arguments}.1", "{that}"]
        },
        requiredDataImpl: "adaptiveContentServices.handlers.dictionary.wiktionary.serviceNotProvided.requiredData"
    }
});

adaptiveContentServices.handlers.dictionary.wiktionary.serviceNotProvided.handlerImpl = function (request, version, that) {
    var endpointNameRegex = /\/\w+\/\w+\/\w+\/\w+\/(\w+)\/.+/g; //to extract name of the endpoint from the url
    var match = endpointNameRegex.exec(request.req.originalUrl);

    var message = "This Service doesn't provide " + match[1];

    that.sendErrorResponse(request, version, "Wiktionary", 400, message);
};

adaptiveContentServices.handlers.dictionary.wiktionary.serviceNotProvided.requiredData = function () {
    /*
     * Service doesn't provide synonyms
     * So no data required
     */
};