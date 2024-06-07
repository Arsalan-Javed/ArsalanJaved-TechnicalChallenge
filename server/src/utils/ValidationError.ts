export const validationErrorMessage = (name: string, type:string='string'): {required_error: string, invalid_type_error: string} => {
    return {
        required_error: `${name} is required`,
        invalid_type_error: `${name} must be a ${type}`,
    }
}
