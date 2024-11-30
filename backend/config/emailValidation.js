const dns = require('dns')

const validateEmailDomain = (email) => {
    return new Promise((resolve) => {
        const domain = email.split('@')[1];

        // Perform DNS MX record lookup
        dns.resolveMx(domain, (err, addresses) => {
            if (err || !addresses || addresses.length === 0) {
                return resolve(false)
            }
            return resolve(true)
        })
    })
}

module.exports = validateEmailDomain