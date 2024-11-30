import configData from '../config.json'

const Url = {
    'development': configData.SERVER_URL_DEVELOPMENT,
    'production': configData.SERVER_URL_PRODUCTION
}

/**
 * Get the URL API address based on the environment.
 * @param {'development' | 'production'} url - The environment type.
 * @returns {string | null} The URL for the given environment.
 */
export const getAPIurl = (url) => {
    switch (url)
    {
        case 'development':
            return Url.development
        case 'production':
            return Url.production
        default:
            return null
    }
}