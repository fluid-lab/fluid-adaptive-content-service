"use strict";

var commonSchemas = require("./commonSchemas");

module.exports = {
    noError: {
        "type": "object",
        "required": ["code", "text"],
        "properties": {
            "code": { "type": "number" },
            "text": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        }
    },
    error: commonSchemas.error
};