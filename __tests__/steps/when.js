
const we_invoke_confirmUserSignup = async (username, name, email) => {
    const handler = require('../../functions/confirm-user-signup').handler

    const context = {}
    const event = {
        "version": "1",
        
    }

    await handler(event, context)
}

module.exports = {
    we_invoke_confirmUserSignup
}

