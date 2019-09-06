import Network from './Network';
import API from './API';

const network = Network('/api.php');

/**
 * Instantiates the Expensify modular API.
 */
export default API(network, {
    /**
     * Adds csrfToken to the request data
     *
     * @param {Object} data
     * @returns {Object}
     */
    enhanceParameters: data => ({
        ...data,

        // Since the location of the csrfToken can differ based on location we must check globals.
        csrfToken: window.csrfToken || window.g_csrfToken
    }),
});
