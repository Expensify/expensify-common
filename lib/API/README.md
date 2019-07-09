# Expensify API

This directory houses our shared API logic and will be used by Web-Expensify, Web-Secure, and Mobile-Expensify.

## ReportHistoryCache
This file enables us to leverage localStorage in the browser and yapl on mobile to maintain a persisent cache of each report's history. It should be only be used while under the `realtimeReportComments` beta and will gracefully fallback to using an in-memory cache if `localStorage` or the `yapl` file system runs into any issues. This system will speed up the network requests, save users tons of data, and reduce the total number of network requests.

### How It Works
    - We initialize the cache by passing it a platform in the constructor so we know whether we are on mobile or web.
    - From here we check if we have store data in a JSON blob on a user device (either via `localStorage` or yapl).
    - If we can't find an existing store we'll attempt to create one.
    - We can check for the most current history by calling the public method `getHistoryByReportID`
        - If we do not yet have history for a give report this method will trigger a full load of the history from this report via `fetchAllHistoryByReportID`.
        - If we do have existing history, then we'll check the last item we have and call `API.Report_GetHistoryFromSequenceNumber` which will return only the items we need and merge them into the memory cache and persistent cache.
        - This method can also be called with a `cacheFirst` param. This will always attempt to return the current in-memory cache and only make a network request if needed.
        - If this cache policy is used the items may not be up to date. We'll mainly use this to
    - Any time we get new history from the server we call `persistToDeviceCache` so that we can access the history via the device cache upon re-initializing
