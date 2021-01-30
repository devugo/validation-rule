// VALIDATION HELPER FUNCTIONS

// Validator function
exports.validate = (body) => {

    //  VALIDATE DATA STRUCTURE

    // Validate required fields
    let validateRequiredFields = requiredFields(body);
    if (validateRequiredFields.code !== 200){
        return validateRequiredFields;
    }

    //  Validate data type fields
    let validateDataTypeFields = dataTypeFields(body);
    if(validateDataTypeFields.code !== 200){
        return validateDataTypeFields
    }

    //  Validate payload validity
    let validatePayloadValidity = payloadType(body);
    if(validatePayloadValidity.code !== 200){
        return validatePayloadValidity
    }
}

// validation conditions
const conditions = [
    'eq',
    'neq',
    'gt',
    'gte',
    'contains'
]

/**
 * Check if the required fields are present i.e rule and data
 * 
 * @param {Request body data} body 
 */
const requiredFields = (body) => {
    if(!body.rule){
        return dataStructureMessage(400, 'rule is required.');
    }
    if(!body.data){
        return dataStructureMessage(400, 'data is required.');
    }

    return dataStructureMessage(200);
}

/**
 * Validate fields data type to ensure what was sent is what's expected for both the rule and data fields
 * 
 * @param {Request body} body 
 */
const dataTypeFields = (body) => {
    if(typeof(body.rule) !== 'object'){
        return dataStructureMessage(400, 'rule should be an object');
    }
    if(typeof(body.data) !== 'object' && typeof(body.data) !== 'string'){
        return dataStructureMessage(400, 'data should be an object or an array or a string');
    }

    return dataStructureMessage(200);
}

/**
 * Validate invalid JSON payload
 * 
 * @param {Request body} body 
 */
const payloadType = (body) => {
    if(!body.rule.field || !body.rule.condition || !body.rule.condition_value || conditions.indexOf(body.rule.condition) === -1 || body.rule.field.split('.').length > 3){
        return dataStructureMessage(400, 'Invalid JSON payload passed.');
    }

    return dataStructureMessage(200);
}

/**
 * Data structure checks message
 * 
 * @param {status code} code
 * @param {*} message 
 */
const dataStructureMessage = (code, message = null) => {
    return {
        details: {
            message: code === 200 ? 'All data type structure validated' : message,
            status: code === 200 ? "success" : "error",
            data: null
        },
        code: code
    }
}