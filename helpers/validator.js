// VALIDATION HELPER FUNCTIONS

// validation conditions
exports.conditions = [
    'eq',
    'neq',
    'gt',
    'gte',
    'contains'
]


// Validator function
exports.validate = (body) => {
    //  VALIDATE DATA STRUCTURE
    
    // Validate required fields
    let validateRequiredFields = requiredFields(body);
    if (validateRequiredFields.code !== 200){
        return validateRequiredFields;
    }
}

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