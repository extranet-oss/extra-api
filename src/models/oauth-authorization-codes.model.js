module.exports = {
  "definitions" : {
    "uuid": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$"
    },
  },
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "id": {
      "type": "string",
      "maxLength": 512
    },
    "client_id": {
      "$ref": "#/definitions/uuid",
      "required": true
    },
    "redirect_uri": {
      "type": "string",
      "required": true
    },
    "user_id": {
      "$ref": "#/definitions/uuid",
      "required": true
    },
    "scopes": {
      "type": "array",
      "required": true,
      "uniqueItems": true,
      "minItems": 1,
      "items": {
        "type": "string",
      }
    }
  }
};
