module.exports = {
    error: 'Validation error',
    is_required: field => `${field} is required`,
    not_valid: field => `${field} is not valid`,
    password: {
        not_match: 'Passwords do not match',
        not_valid: field => `${field} must contain 1 uppercase, 1 lowercase, 1 number, 1 special character (_.?+&) and min 8 characters`
    }
};