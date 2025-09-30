
import validator from 'validator';

export const isValidUrl = (url: string):boolean =>{
    return validator.isURL(url, {
        protocols: ['http', 'https'],
        require_tld: true,
        require_protocol: true
    })
}