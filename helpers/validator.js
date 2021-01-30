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

    //  Vcalidate field rule existence
    let validateFieldRuleExistance = FieldRuleExist(body);
    if(validateFieldRuleExistance.code !== 200){
        return validateFieldRuleExistance;
    }

    //  Return final valdation outcome
    return validateProper(body)
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
        return dataStructureMessage(400, 'rule should be an object.');
    }
    if(typeof(body.data) !== 'object' && typeof(body.data) !== 'string'){
        return dataStructureMessage(400, 'data should be an object or an array or a string.');
    }

    return dataStructureMessage(200);
}

/**
 * Validate validity of JSON payload
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

/**
 * Check if field in rule exists in data object
 * 
 * @param {Request body} body 
 */
const FieldRuleExist = (body) => {
    // get rule field
    let ruleField = body.rule.field; 

    // Gtt reduced data field value
    let fieldValue = reduceDataField(body);
    // console.log(fieldValue);

    if(!fieldValue){
        return dataStructureMessage(400, `field ${ruleField} is missing from data.`);
    }

    return dataStructureMessage(200);
}

/**
 * Reduce data field to get the value
 * 
 * @param {Request body data} body 
 */
const reduceDataField = (body) => {
    // get rule field
    let ruleField = body.rule.field; 
    //  Convert rule field to array, using '.' as the reducer
    let ruleFieldArr = ruleField.split('.');

    let fieldValue = body.data;
    // Loop through rule field array and check for the existence of the field in data
    for(var i = 0; i < ruleFieldArr.length; i++){
        fieldValue = fieldValue[ruleFieldArr[i]];
        if(fieldValue == null){
            break;
        }
    }

    return fieldValue;
}

// Final validation for the conditions
const validateProper = (body) => {
    let passed = false;
    
    // Get condition
    let condition = conditions.indexOf(body.rule.condition);
    let field = body.rule.field;
    let conditionValue = body.rule.condition_value;
    let fieldValue = reduceDataField(body);;

    switch (condition) {
        // eq
        case 0: 
            passed = passEqualTo(conditionValue, fieldValue);
            break;
        // neq
        case 1: 
            passed = passNotEqualTo(conditionValue, fieldValue);
            break;
        // gt
        case 2: 
            passed = passGreaterThan(conditionValue, fieldValue)
            break;
        // gte
        case 3: 
            passed = passGreaterThanAndEqualTo(conditionValue, fieldValue);
            break;
        // contains
        case 4: 
            passed = passContains(conditionValue, fieldValue);
            break;
    }

   //   Return validator response 
    return validatorResponse(passed ? 200 : 400, field, fieldValue, body.rule.condition, conditionValue);
}

// contains function
const passContains = (conditionValue, fieldValue) => {
    // if(fieldValue.indexOf(conditionValue) === -1){
    //     return false;
    // }
    // return true;

    return fieldValue.indexOf(conditionValue) !== -1;
}

// eq function
const passEqualTo = (conditionValue, fieldValue) => {
    return fieldValue === conditionValue;
}

// neq function
const passNotEqualTo = (conditionValue, fieldValue) => {
    return fieldValue !== conditionValue;
}

// gt function
const passGreaterThan = (conditionValue, fieldValue) => {
    return fieldValue > conditionValue;
}

// gte function
const passGreaterThanAndEqualTo = (conditionValue, fieldValue) => {
    return fieldValue >= conditionValue;
}


/**
 * Validator response object base don status code passed
 * 
 * @param {status code} code 
 * @param {field name} field 
 * @param {field value on data} fieldValue 
 * @param {condition validation was carried on} condition 
 * @param {condition value } conditionValue 
 */
const validatorResponse = (code, field, fieldValue, condition, conditionValue) => {
    return {
        details: {
            "message": code === 200 ? `field ${field} successfully validated.` : `field ${field} failed validation.`,
            "status": code === 200 ? "success" : "error",
            "data": {
                "validation": {
                    "error": code === 200 ? false : true,
                    "field": field,
                    "field_value": fieldValue,
                    "condition": condition,
                    "condition_value": conditionValue
                }
            }
        },
        code: code
    }
}