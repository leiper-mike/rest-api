


/**
 * Uses regular expression to determine if a string contains ONLY numbers
 * @param {string} input 
 * @returns {boolean}
 */
export function isInt(input: string) :boolean{
    if(input?.match(/^\d+$/))
        return true;
    return false;
}