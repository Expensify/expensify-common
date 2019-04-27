import _ from 'underscore';
import $ from 'jquery';



const Animation = {
    // Flash an element to a flareColor and then return it to its original background color.
    flare: ($element, options) => {
        const defaults = {
            flareColor: '#ffffbb',
            flareUpDuration: 1000,
            flareDownDuration: 2000,
            flareDownColor: $element.css('backgroundColor')
        };

        options = $.extend({}, defaults, options);
        $element.animate({
            backgroundColor: options.flareColor
        }, options.flareUpDuration, function () {
            // Call back function for after it finishes animating to flareColor
            $(this).animate({
                backgroundColor: options.flareDownColor
            }, options.flareDownDuration);
        });
    },

    /**
     * Animate the page scrolling to a specific location
     * @param {Number}  location
     * @param {Number}  duration
     * @param {Function} [callback]
     */
    scrollPage: (location, duration, callback) => {
        if (duration === 0) {
            $('html, body').scrollTop(location || 0);
        } else {
            $('html, body').stop().animate({scrollTop: location || 0}, duration || 450, 'swing', callback);
        }
    },
}

const Growl = {
    /**
     * Display a growl
     *
     * @param {Array|String} messageOrTemplate Either a template path or the final string message
     * @param {Object} [data] Template data
     * @param {Object} [options] Additional options to pass to the growl
     */
    growl: (messageOrTemplate, data, options) => {
        let message = '';
        if (_.isArray(messageOrTemplate)) {
            message = Templates.get(messageOrTemplate, data);
        } else if (_.isString(messageOrTemplate)) {
            message = messageOrTemplate;
        }

        if (!options) {
            options = {};
        }

        options.closeDuration = 0;
        options.openDuration = 0;

        $.jGrowl(message, options);
    },

    /**
     * Display a success growl
     *
     * @param {Array|String} messageOrTemplate Either a template path or the final string message
     * @param {Object} [data] Template data
     * @param {Number} [time=2000] Time in ms to display the growl
     * @param {Object} [options] Additional options to pass to the growl
     */
    success: (messageOrTemplate, data, time, options) => {
        if (!options) {
            options = {};
        }
        options.life = _.isNumber(time) ? time : 2000;

        UIUtils.Growl.growl(messageOrTemplate, data, options);
    },

    /**
     * Manually trigger an active growl to close
     */
    close:  () => {
        $('#jGrowl').jGrowl('close');
    },

    /**
     * Display an error growl
     * @deprecated We are deprecating error growls, so please use PubSub to throw up a user-friendly dialog
     *
     * @param {Array|String} messageOrTemplate Either a template path or the final string message
     * @param {Object} [data] Template data
     * @param {Number} [time=10000] Time in ms to display the growl
     * @param {Object} [options] Additional options to pass to the growl
     */
    error: (messageOrTemplate, data, time, options) => {
        Log.client('We are deprecating error growls, so please use PubSub to throw up a user-friendly dialog.');
        if (!options) {
            options = {};
        }
        options.life = _.isNumber(time) ? time : 10000;
        options.theme = 'error';
        UIUtils.Growl.growl(messageOrTemplate, data, options);
    },

    /**
     * Display a warning growl
     *
     * @param {Array|String} messageOrTemplate Either a template path or the final string message
     * @param {Object} [data] Template data
     * @param {Number} [time=2000] Time in ms to display the growl
     */
    warn: (messageOrTemplate, data, time) => {
        UIUtils.Growl.growl(messageOrTemplate, data, {
            life: _.isNumber(time) ? time : 2000,
            theme: 'warn'
        });
    },

    /**
     * Display a success or error growl depending on the success/failure of the promise.
     *
     * @param {Deferred} promise The promise that determines which growl to show.
     * @param {Array}   templatePathSuccess Path to the template to use when success
     * @param {Array}   templatePathError Path to the template to use when fail
     * @param {Object}  [data] Template data
     * @param {Number}  [time=2000] Time in ms to display the growl
     * @param {Object}  [options] Additional options to pass to the growl
     */
    promise: (promise, templatePathSuccess, templatePathError, data, time, options) => {
        const self = this;
        promise.done(function () {
            self.success(templatePathSuccess, data, time, options);
        }).fail(function () {
            self.error(templatePathError, data, time, options);
        });
    },

    /**
     * Display a concierge growl
     *
     * @param {Array|String} messageOrTemplate Either a template path or the final string message
     * @param {Object} [data] Template data
     * @param {Number} [time=2000] Time in ms to display the growl
     * @param {Object} [options] Additional options to pass to the growl
     */
    concierge: (messageOrTemplate, data, time, options) => {
        if (!options) {
            options = {};
        }
        options.life = _.isNumber(time) ? time : 2000;
        options.theme = 'concierge';
        options.beforeOpen = function () {
            // Hide the intercom thing because the concierge icon will go over it
            $('body').addClass('concierge-growl-active');
        };
        options.afterOpen = function () {
            $('#jGrowl .concierge .js_contact-us').click(options.close);
        };
        options.close = function () {
            setTimeout(function () {
                // Show the intercom container after all concierge growls are gone (need to give time for animations)
                $('body').removeClass('concierge-growl-active');
            }, 500);
        };

        UIUtils.Growl.growl(messageOrTemplate, data, options);
    },
}

const Loading = {
    /**
     * Container of the text being display when loading
     *
     * @type HTMLElement
     * @private
     */
    _textContainer: document.getElementById('loadingText'),

    /**
     * Background image
     *
     * @type HTMLElement
     * @private
     */
    _loadingBackground: document.getElementById('loadingBackground'),

    /**
     * The gifffss
     *
     * @type HTMLElement
     * @private
     */
    _loadingImage: document.getElementById('loadingImage'),

    _$loadingTitle: $('#loadingTitle'),
    _$loadingList: $('#loadingList'),
    _$loadinWraper: $('.loadingMessagesWrapper'),
    _isVisble: false,

    /**
     * Cancel all keyboard events while our loader is showing
     * @param  {Event} e
     * @return {Boolean}
     */
    _swallowKeyboardEvents: function (e) {
        // Let users type any cmd modified keys
        if (e.metaKey) {
            return true;
        }
        e.preventDefault();
        return false;
    },

    /**
     * Display the global spinner
     * @param {Object} [args]
     * @param {Boolean} args.noDelay
     */
    show: (args) => {
        let noDelay = !_.isEmpty(args) ? args.noDelay : null;
        this._toggle(true, noDelay);
        $(document).on('keydown', this._swallowKeyboardEvents);
    },

    /**
     * Hide the global spinner
     */
    hide: () => {
        this._toggle(false);
        this._$loadingList.empty();
        this._$loadinWraper.addClass(UI.HIDDEN);
        $(document).off('keydown', this._swallowKeyboardEvents);
    },

    /**
     * Change the text being display
     *
     * @param {string} html
     */
    updateText: (html) => {
        if (!this._textContainer) {
            return;
        }

        this._textContainer.innerHTML = html;
    },

    addStep: (title, message) => {
        if (!this._isVisble) {
            return;
        }

        this._$loadinWraper.removeClass(UI.HIDDEN);
        this._$loadingTitle.text(title);
        this._$loadingList
            .find('.spinner')
            .removeClass('spinner spinner-small')
            .addClass('expensicons expensicons-checkmark success');
        this._$loadingList.append('<li><div class="indicator spinner spinner-small"></div> ' + message + '</li>');
    },

    /**
     * Hide or show the global loading state
     *
     * @param {Boolean} showOrHide
     * @param {Boolean} [noDelay]
     * @private
     */
    _toggle:  (showOrHide, noDelay) => {
        const newDisplayValue = showOrHide ? 'block' : 'none';
        this._isVisble = showOrHide;
        if (!_.isNull(this._loadingBackground) && !_.isNull(this._loadingImage)) {
            if (this._loadingBackground.style.display !== newDisplayValue) {
                this._loadingBackground.style.display = newDisplayValue;

                // Always remove this class when it's hidden
                if (newDisplayValue === 'none') {
                    $(this._loadingBackground).removeClass('no-delay');
                }

                if (newDisplayValue === 'block' && noDelay) {
                    $(this._loadingBackground).addClass('no-delay');
                }
            }

            if (this._loadingImage.style.display !== newDisplayValue) {
                this.updateText('');
                this._loadingImage.style.display = newDisplayValue;
            }
        }
    },

    /**
     * Displays the full screen loader at the start of a promise and hides it after it's done
     *
     * @param {Deferred} promise
     * @param {Boolean} [noDelay]
     *
     * @return {Deferred}
     */
    promise: (promise, noDelay) => {
        PubSub.publish(EVENT.LOADING.START, {noDelay: !!noDelay});
        return promise.always(function () {
            PubSub.publish(EVENT.LOADING.STOP);
        });
    }
}

const Progress = (function () {
    let _initialized = false;
    let _increments = 0;
    let _count = 0;
    let _title = '';
    let _text = '';

    return {
        /**
         * Shows a dialog containing a progressbar, designed for handling bulk uploads
         * @param {String} title The title to be displayed like "Uploading Receipts"
         * @param {Number} increments The expected number of times that updateProgess
         * will be called, each call to update will move the bar 100/increments percent
         * @param {String} text Optional extra text to display in the dialog window
         * @return {Boolean} Whether or not the progressbar was able to be displayed
         */
        init: function (title, increments, text) {
            if (!_initialized) {
                _initialized = true;
                _increments = increments;
                _count = 0;
                _text = '';
                if (title) {
                    _title = title;
                }
                if (text) {
                    _text = text;
                }
                $('#dialog_progressbar .dialog_wrapper').progressbar({
                    value: 1
                });
                $('#dialog_progressbar_title').text(_title + ' 0%');
                $('#dialog_progressbar p').text(_text);
                openDialog('progressbar', null);
                return true;
            }
            return false;
        },

        /**
         * Open or update the progress bar with a given percentage
         *
         * @param {String}  title       The main title of the progress bar popup
         * @param {Number}  percentage  The percentage to set/update the bar to
         * @param {String}  text        The text to display under the progress bar
         */
        setPercentage: function (title, percentage, text) {
            if (!_initialized) {
                _initialized = true;
                openDialog('progressbar', null);
            }

            _title = title;
            _text = text || '';
            $('#dialog_progressbar .dialog_wrapper').progressbar({
                value: percentage
            });
            $('#dialog_progressbar_title').text(_title + ' ' + percentage + '%');
            $('#dialog_progressbar p').text(_text);
        },

        /**
         * Moves the progressbar forward, 100/increments percent.
         * @param {String} title Optional update to the title
         * @param {String} text Optional extra text to display in the dialog window
         */
        update: function (title, text) {
            let percentage;

            if (_initialized) {
                if (title) {
                    _title = title;
                }
                if (text) {
                    _text = text;
                }
                if (_count < _increments) {
                    _count++;
                }
                percentage = Math.floor(100 * _count / _increments);
                $('#dialog_progressbar_title').text(_title + ' ' + percentage + '%');
                $('#dialog_progressbar p').text(_text);
                $('#dialog_progressbar .dialog_wrapper').progressbar({
                    value: percentage
                });
            }
        },

        /**
         * Hides the progressbar
         */
        finish: function () {
            if (_initialized) {
                closeDialog();
                _initialized = false;
            }
        }
    };
})();

const Customization = {
    _customizations: {},

    /**
     * Initializer, should be loaded with data from the server
     *
     * @param {Object} customizations A dictonary of key/value settings
     */
    init: function (customizations) {
        this._customizations = customizations;
    },

    /**
     * Get the value for a customization
     *
     * @param {String} customizationKey
     * @returns {Mixed}
     */
    get: function (customizationKey) {
        return this._customizations[customizationKey];
    }
}

const Date = {
    /**
     * Format a date into a human readable string like "Jul 2, 2014"
     *
     * @param {String} dateString
     * @returns {String}
     */
    readableFormat: function (dateString) {
        return moment(dateString).format(CONST.DATE.MOMENT_US_DATE);
    }
}

const QRCode = {
    /**
     * Draws HTML string of eReceipts.
     *
     * Essentially a copy of the function in lib_receipts.js (the original) which
     * should be deprecated once this library is in place.
     *
     * @param {SExpense3} expense
     * @param {Mixed} identifyingClass
     * @return {String} Returns eReceipt HTML.
     */
    getcontainer: function (expense, identifyingClass) {
        let cardType = CardUtils.getTypeFromPAN(expense.getCardNumber());
        let bank = expense.getBank();
        let bankName = null;
        let bankURL = null;
        if (cardType === 'Unknown') {
            cardType = 'Account';
        }

        if (bank !== null && window.g_bankData && window.g_bankData[bank]) {
            bankName = window.g_bankData[bank].name;
            bankURL = window.g_bankData[bank].domain;
        }

        return Templates.get(['Expenses', 'eReceipt'], {
            identifyingClass: identifyingClass,
            merchant: Str.shortenText(Str.recapitalize(expense.getMerchant()), 34),
            posted: expense.getPosted(),
            originalCreated: expense.getOriginalCreated(),
            amount: expense.getAmount(true),
            originalAmount: expense.getOriginalAmount(true),
            cardType: cardType,
            cardNumber: expense.getCardNumber(),
            bankName: bankName,
            bankURL: bankURL,
            externalID: expense.getExternalID(),
            transactionID: expense.getID(),
            mcc: expense.getMCC(),
            qrCodeData: 'https://' + window.location.host + '/verifyReceipt?' +
                'action=verifyreceipt' +
                '&transactionID=' + encodeURIComponent(expense.getID()) +
                '&created=' + encodeURIComponent(expense.getCreated()) +
                '&amount=' + encodeURIComponent(expense.getAmount(false))
        });
    },
    generate: function ($elements) {
        let processingQueue = $({});
        $elements.each(function () {
            let e = $(this);
            e.empty();
            processingQueue.queue(function (next) {
                let size = e.attr('width');
                e.qrcode({
                    text: decodeURIComponent(e.data('qr')),
                    render: Browser.supportsCanvas() ? 'canvas' : 'table',
                    width: size,
                    height: size,
                    // Low error control https://github.com/jeromeetienne/jquery-qrcode/blob/master/src/qrcode.js#L494
                    correctLevel: 1
                });
                _.defer(next);
            });
        });
    }
}

/**
 * Auto complete merchant name using constructor.io
 *
 * @param {jQuery} $elements
 */
const ConstructorAutoComplete = function ($elements) {
    $elements.constructorAutocomplete({
        key: 3,
        triggerSubmitOnSelect: false,
        triggerSearchOnElementClick: '.js_save',
        injectRecentSearchesInSection: 'standard'
    });
};

const Intercom = (function () {
    let unreadCount = 0;
    let isPolling = false;

    return {
        /**
         * Intercom custom attribute names for users
         */
        USR_ATTR_CUST_REFERRAL_SOURCE: 'Referral Source',
        USR_ATTR_CUST_PHONE_NUMBER: 'Phone Number',
        USR_ATTR_CUST_UTM_CONTENT: 'UTM Content',
        USR_ATTR_CUST_UTM_TERM: 'UTM Term',
        USR_ATTR_CUST_PROMOCODE: 'Promo Code',
        USR_ATTR_CUST_PROMODISCOUNT: 'Promo Code Discount',

        /**
         * Intercom event names
         */
        EVT_STARTED_TRIAL: 'started-trial',
        EVT_CREATED_CORPORATE_POLICY: 'created-corporate-policy',
        EVT_CREATED_TEAM_POLICY: 'created-team-policy',

        EVT_APPROVED_REPORT: 'approved-report',
        EVT_FORWARDED_REPORT: 'forwarded-report',
        EVT_STARTED_GUIDED_REVIEW: 'started-guided-review',
        EVT_FINISHED_GUIDED_REVIEW: 'finished-guided-review',

        EVT_SYNC_QBO: 'synced-QBO',
        EVT_SYNC_XERO: 'synced-Xero',
        EVT_SYNC_INTACCT: 'synced-Intacct',
        EVT_SYNC_FINANCIALFORCE: 'synced-FinancialForce',
        EVT_SYNC_NETSUITE: 'synced-NetSuite',
        EVT_SYNC_QBD: 'synced-QBD',
        EVT_SYNC_ZENEFITS: 'synced-Zenefits',
        EVT_SYNC_ZENEFITSV2: 'synced-Zenefits-v2',
        EVT_SYNC_BILLCOM_ADDON: 'synced-BillComAddon',
        EVT_SYNC_GUSTO: 'synced-Gusto',

        /**
         * Initialize the Intercom messenger if necessary
         */
        init: function () {
            let ic = window.Intercom;
            let i = function () {
                i.c(arguments);
            };
            let options = {};
            let referer;
            let UTM;
            let phoneNumber;
            let promoCode;
            let promoDiscount;
            let script;
            let x;

            if (!window.intercomSettings || User.isSupportLoggedIn()) {
                return;
            }

            if (typeof ic === 'function') {
                ic('reattach_activator');
                ic('update', window.intercomSettings);
            } else {
                i.q = [];
                i.c = function (args) {
                    i.q.push(args);
                };
                window.Intercom = i;
                ic = i;

                script = document.createElement('script');
                x = document.getElementsByTagName('script')[0];
                script.type = 'text/javascript';
                script.async = true;
                script.src = 'https://widget.intercom.io/widget/' + window.intercomSettings.app_id;
                x.parentNode.insertBefore(script, x);
            }

            // group users on the Intercom side by email,
            // except for people on public domains
            if (User.isLoggedIn()) {
                referer = NVP.get(NVP.PRIVATE_REFERER);
                phoneNumber = NVP.get('expensify_leadPhoneNumber');
                promoCode = NVP.get(NVP.PROMO_CODE);
                promoDiscount = User.getPromoDiscount();
                UTM = {
                    content: NVP.get('expensify_leadUtmContent'),
                    term: NVP.get('expensify_leadUtmTerm'),
                };

                options.email = DelegatedAccessUtils.isLoggedInAsDelegate()
                    ? DelegatedAccessUtils.getDelegateEmail()
                    : User.getEmail();
                options.created_at = moment(User.getCreated()).unix();

                if (!User.isOnPublicDomain()) {
                    options.company = {
                        id: User.getDomainEmail(),
                        name: User.getDomainEmail()
                    };
                }

                if (referer) {
                    options[UIUtils.Intercom.USR_ATTR_CUST_REFERRAL_SOURCE] = referer;
                }
                if (phoneNumber) {
                    options[UIUtils.Intercom.USR_ATTR_CUST_PHONE_NUMBER] = phoneNumber;
                }
                if (UTM && UTM.term) {
                    options[UIUtils.Intercom.USR_ATTR_CUST_UTM_TERM] = UTM.term;
                }
                if (UTM && UTM.content) {
                    options[UIUtils.Intercom.USR_ATTR_CUST_UTM_CONTENT] = UTM.content;
                }
                options[UIUtils.Intercom.USR_ATTR_CUST_PROMOCODE] = promoCode;
                options[UIUtils.Intercom.USR_ATTR_CUST_PROMODISCOUNT] = promoDiscount;
            }

            // Intercom
            options.widget = {
                activator: 'hide-by-default'
            };

            ic('boot', options);
            this.update();

            // Update Intercom whenever the page changes or a new menu tab is selected
            PubSub.subscribe(EVENT.APP.PAGE_CHANGED, this.update);
            PubSub.subscribe(EVENT.APP.TAB_CHANGED, this.update);

            window.Intercom('onUnreadCountChange', this.refreshCount);
        },

        /**
         * Reset the Intercom plugin.
         *
         * Use this to make sure to display or hide the button based on the state of the user
         */
        reset: function () {
            delete window.Intercom;
            UIUtils.Intercom.init();
        },

        /**
         * Refresh the unread messages counter
         *
         * @param {Number} count
         */
        refreshCount: function (count) {
            unreadCount = count;
        },

        /**
         * Track an event and send the information to Intercom.
         * Also update our side e.g. to check for now possible available auto messages.
         *
         * @param {String} eventName (should be one of UIUtils.Intercom.EVT_*)
         * @param {Object} [metadata] optional object containing metadata to go with the event
         */
        trackEvent: function (eventName, metadata) {
            metadata = metadata || {};
            if (!window.Intercom) {
                return;
            }

            window.Intercom('trackEvent', eventName, metadata);
            // Start polling for updates if we're not already
            if (!UIUtils.Intercom.isPolling) {
                UIUtils.Intercom.isPolling = true;
                const autoRefreshIntercomWidget = window.setInterval(function () {
                    UIUtils.Intercom.update();
                }, 1000);
                window.setTimeout(function () {
                    UIUtils.Intercom.isPolling = false;
                    window.clearInterval(autoRefreshIntercomWidget);
                }, 4000);
            }
        },

        /**
         * Wrapper around window.Intercom('update');
         */
        update: function () {
            window.Intercom('update', {last_request_at: parseInt((new window.Date()).getTime() / 1000, 10)});
        },

        /**
         * Get the number of unread messages from intercom
         *
         * @return {Number}
         */
        getUnreadCount: function () {
            return unreadCount;
        },

        /**
         * Function to expand Intercom widget
         */
        show: function () {
            window.Intercom('show');
        }
    };
})();


export default {

    // When using typewatch, the callback will fire after this
    // delay (ms)
    DEFAULT_TYPEWATCH_DELAY: 150,

    fancyBox: function (imgURL, options) {
        options = options || {};
        options.href = imgURL;
        $.fancybox(options);
    },

    /**
     * Wrapper for $.fancybox.open
     *
     * @param {String} imgURL
     * @param {String} [type]
     * @param {Object} [options]
     */
    fancyBoxOpen: function (imgURL, type, options) {
        options = options || {};
        $.fancybox.open([
            {
                type: type || 'iframe',
                href: imgURL
            }
        ], options);
    },

    /**
     * Wraps the given string in a <span> that depreciates it
     *
     * @param {String} text The text to depreciate
     * @returns {String} The depreciated text
     */
    depreciate: function (text) {
        return '<span class="depreciated">' + text + '</span>';
    },

    /**
     * Return the HTML needed to inject an icon
     * @param {number} iconCode, Use UI.ICON to get the code
     * @returns {string}
     */
    getIcon: function (iconCode) {
        return '<span class=\'expensicons expensicons-' + iconCode + '\'></span>';
    },

    /**
     * Wraps the given string in a <strong>
     *
     * @param {String} text The text to reinforce
     * @returns {String} The reinforced text
     */
    reinforce: function (text) {
        return '<strong>' + text + '</strong>';
    },

    /**
     * Adds a <span> that depreciates everything after and
     * including the @ sign in an email address.
     *
     * @param {String} email The email address
     * @returns {String} Email address with depreciated domain
     */
    depreciateDomain: function (email) {
        const emailParts = email.split('@');
        return emailParts[0] + UIUtils.depreciate('@' + emailParts[1]);
    },

    /**
     * Adds a <span> that depreciates everything except the last
     * 4-6 digits of a card number. It will show 6 digits if it can, and 4 if there
     * are not enough digits.
     *
     * @param {String} cardNumber The card number
     * @returns {String} card number with depreciated digits
     */
    depreciateMaskedCardDigits: function (cardNumber) {
        // Remove all whitespace and non-numeric characters
        const cleanCardNumber = Str.stripNonNumeric(cardNumber);
        let maskedPan;

        if (CONST.REG_EXP.MASKED_CARD.test(cardNumber)) {
            return CardUtils.groupCardNumberByBlocks(cardNumber, '-');
        } else if (CardUtils.isCardNumberValid(cleanCardNumber)) {
            maskedPan = Str.maskPAN(cardNumber);
            return CardUtils.groupCardNumberByBlocks(maskedPan, '-');
        }

        return cardNumber;
    },

    /**
     * Wraps the given token strings in <span>s that highlight each string as a
     * "token" and joins them together. The elements of the tokens array are
     * paired to the elements of the classes array by their index. The paired
     * classes are added to the class attribute of the <span> for its
     * corresponding token.
     *
     * @param {String[]} tokens The strings you wanna tokenize.
     * @param {String[]} classes The optional extra classes you want to add to your tokenized elements.
     *
     * @returns {String} the strings, tokenized
     */
    tokenize: function (tokens, classes) {
        let wrappedStrings = _.map(tokens, function (token, index) {
            let tokenClass = _.get(classes, index, '');
            return '<span class="token ' + tokenClass + '">' + token + '</span>';
        });
        return wrappedStrings.join(' ');
    },

    /**
     * Sets an $.on() so hitting the specified key on an element calls a function
     *
     * NOTE: jQuery's live() is now deprecated and should be replaced by on(), but on() breaks
     * keyboard navigation on the site. Investigate on this and use on() if possible.
     *
     * @param {Number}   key  Keycode of the key to bind. Use codes from $.ui.keyCode
     *                       such as $.ui.keyCode.ENTER (don't pass null)
     * @param {string}   selector jQuery selector to limit the event to
     * @param {Function} actionFunction  What function to call
     */
    bindKey: function (key, selector, actionFunction) {
        $(document).on('keydown', selector, function (event) {
            if (event.keyCode === key && _.isFunction(actionFunction)) {
                actionFunction(event);
            }
        });
    },

    /**
     * Show a loading spinner for this element. Add an overlay and a spinner on top.
     * @param {jQueryElement} element jQuery The element to show.
     * @param {Boolean} [dark] Display a dark overlay or not?
     */
    showLoading: function (element, dark) {
        let overlay = $('<div class="elementOverlay"></div>');
        let spinner = $(UI.spinnerSmallDIV).addClass(UI.spinnerClass);
        if (dark) {
            overlay.addClass('dark');
        }
        element.prepend(overlay);
        element.prepend(spinner);
    },

    /**
     * Hide the loading for this element.
     * @param {jQueryElement} element
     */
    hideLoading: function (element) {
        element.find('.elementOverlay').first().remove();
        element.find('.' + UI.spinnerClass).first().remove();
    },

    /**
     * Use this function to delay-fire callbacks. Pass a delay argument
     * if you want to override the default value.
     *
     * Example:
     * $(selector).keyup( function(){
     *     typewatch( function() {
     *         // executed only 500 ms after the last keyup event.
     *     }, 500 );
     * });
     *
     * @param {Function} callback The function to call after the delay
     * @param {Number} [delay] The optional overridden delay in ms
     * @returns {String} card number with depreciated digits
     */
    typewatch: (function () {
        let timerID = 0;
        return function (callback, delay) {
            delay = delay || UIUtils.DEFAULT_TYPEWATCH_DELAY;
            clearTimeout(timerID);
            timerID = setTimeout(callback, delay);
        };
    })(),

    /**
     * Does this event represent a keypress that would change an input field?
     * (i.e. not a tab, arrow press and the like).
     *
     * @param {jQuery.Event} event The event to inspect
     *
     * @returns {Boolean} True if it's a character keypress, false otherwise.
     */
    isCharacterKeyPress: function (event) {
        // Keycodes that don't generate/modify the val() of an input. Add more
        // if you find more.
        let muteKeys = [
            // Meta, Cmd
            91,
            // Alt
            18,
            // Shift
            16,
            // Ctrl
            17,
            // Caps Lock
            20,
            $.ui.keyCode.TAB,
            $.ui.keyCode.UP,
            $.ui.keyCode.RIGHT,
            $.ui.keyCode.DOWN,
            $.ui.keyCode.LEFT,
            $.ui.keyCode.HOME,
            $.ui.keyCode.END,
            $.ui.keyCode.ESCAPE,
            $.ui.keyCode.PAGE_UP,
            $.ui.keyCode.PAGE_DOWN
        ];
        return !_.contains(muteKeys, event.keyCode);
    },

    /**
     * Trigger click event on checkbox
     *
     * Triggering the 'click' event will make the event handler see the checkbox
     * property 'checked' in its old state. So we reset the property after
     * triggering the event
     * This is a jQuery bug fixed in version 1.9
     * http://jquery.com/upgrade-guide/1.9/#checkbox-radio-state-in-a-trigger-ed-click-event
     *
     * @param {jQueryElement} $elem
     */
    triggerClickOnCheckbox: function ($elem) {
        const checked = $elem.is(':checked');
        $elem.trigger('click').prop('checked', checked);
    },

    /**
     * Gets an (expensify-style) amount from a text field, unitless
     *
     * @param {jQuery} $textField Any jQuery element that responds to .val
     * @returns {Number}
     */
    getAmountFromTextField: function ($textField) {
        return Str.fromUSDToNumber($textField.val());
    },

    /**
     * Transforms a string array into a basic <ul>
     *
     * @param {String[]} stringList A list of strings
     * @returns {String} A <ul> element as a string
     */
    getUnorderedStringList: function (stringList) {
        return '<ul><li>' + stringList.join('</li><li>') + '</li></ul>';
    },

    /**
     * Creates and returns an option element
     * Be careful, when trying to prepend it on IE, the new option doesn't get selected,
     * so you must add .val(value) after you prepend
     *
     * @param   {String}  value the option's value
     * @param   {String}  text the option's text
     * @param   {Boolean} [isSelected] whether the element is selected. Defaults to false
     * @param   {String}  [klass] the option's class. Defaults to ''
     * @returns {DOMElement} the option element
     */
    getOptionElement: function (value, text, isSelected, klass) {
        let option = document.createElement('option');
        let optionText = document.createTextNode(text);
        let selected = isSelected || false;
        let className = klass || '';

        option.value = value;
        option.selected = selected;
        option.className = className;
        option.appendChild(optionText);
        return option;
    },

    /**
     * Creates a link to a help page on help.expensify.com
     *
     * @param {String} helpPath The path where you want to go (ex. 'xero')
     * @param {String} label A label
     *
     * @returns {String} An <a> element as a string
     */
    getHelpLink: function (helpPath, label) {
        return Templates.get(['Global', 'helpLink'], {
            helpPath: helpPath,
            label: label
        });
    },

    /**
     * Computes the offset of a popup to be shown under a button in the sticky subheader
     *
     * @param {jQuery} $button jQuery wrapped button element
     * @returns {Object} offset with properties top and left representing how far
     *                   from the top and from the left of the page the popup will be
     *                   shown, respectively.
     */
    getStickySubheaderPopupOffset: function ($button) {
        let buttonHeight = Number(Str.cutAfter($($button).css('padding-top'), 'px')) + Number(Str.cutAfter($($button).css('padding-bottom'), 'px')) + Number(Str.cutAfter($($button).css('border-top'), 'px')) + Number(Str.cutAfter($($button).css('border-bottom'), 'px')) + $button.height();
        let top = $('#bannerAnnouncement').height() + buttonHeight;

        return {
            top: top + Number(Str.cutAfter($('.page-header').css('padding-top'), 'px')),
            left: $button.offset().left,
        };
    },

    /**
     * Launches a page in a new tab
     *
     * @param {String} url The URL you want to open
     * @param {Object} [queryParams] A map from param names to param values used to build a query string
     */
    openTab: function (url, queryParams) {
        let queryString = '';
        if (_.isObject(queryParams) && !_.isEmpty(queryParams)) {
            queryString = '?' + _.map(queryParams, function (paramVal, paramName) {
                return String(paramName) + '=' + encodeURIComponent(String(paramVal));
            }).join('&');
        }

        window.open(url + queryString, '_blank');
    },

    /**
     * Compute the offset where to open a popup that is meant to be sticky.
     * The call to SPopup.send can't be moved in here because SPopup uses 'caller'
     * to re-bind.
     *
     * @param {DOMElement} anchorElement The anchor element for the popup (typically, a button)
     * @returns {Object} An offset object with the computed coordinates
     */
    computeStickyPopupOffset: function (anchorElement) {
        let offset = $(anchorElement).offset();
        offset.top -= $(window).scrollTop() - $(anchorElement).outerHeight();
        offset.left -= $(window).scrollLeft();
        return offset;
    },

    /**
     * Is the whole webapp running in an iframe?
     *
     * @returns {Boolean} True if we're in an iframe
     */
    isRunningInIframe: function () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    },

    /**
     * Will restore the previous scroll position on the page when the height of the DOM is changed
     * (like after inserting a template).
     *
     * @param {Function} callback
     * @return {*} Whatever the callback function returns
     */
    keepScroll: function (callback) {
        let scrollTop = window.scrollY;
        let result = Func.invoke(callback);
        $(window).scrollTop(scrollTop);
        return result;
    },

    /**
     * Given an input element, it focus it and positions the cursor at the end of the text.
     * @param {Object} input Element from JQuery
     */
    positionCursorAtEnd: function (input) {
        let value = input.val();
        input.focus();
        input.val('');
        input.val(value);
    },

    /**
     * Get integration logo based on the origin
     * @param {string} origin (QBO, Xero, Intacct, NetSuite ...)
     * @param {string} type (Category, Tag, Report Field ...)
     * @return {string} html
     *
     * @deprecated should probably just use UIUtils.getIntegrationLogoURL
     */
    getIntegrationLogo: function (origin, type) {
        if (Str.startsWith(origin, 'xero')) {
            return Templates.get(['Settings', 'PolicyEditor', 'Connections', 'xeroIcon'], {type: type});
        }

        if (Str.startsWith(origin, 'netsuite')) {
            return Templates.get(['Settings', 'PolicyEditor', 'Connections', 'netSuiteIcon'], {type: type});
        }

        if (Str.startsWith(origin, 'qb')) {
            return Templates.get(['Settings', 'PolicyEditor', 'Connections', 'qbIcon'], {type: type});
        }

        if (Str.startsWith(origin, 'intacct')) {
            return Templates.get(['Settings', 'PolicyEditor', 'Connections', 'intacctIcon'], {type: type});
        }

        if (Str.startsWith(origin, 'concur')) {
            return Templates.get(['Settings', 'concurIcon'], {type: type});
        }

        if (Str.startsWith(origin, 'financialforce')) {
            return Templates.get(['Settings', 'PolicyEditor', 'Connections', 'financialForceIcon'], {type: type});
        }
        return '&nbsp;';
    },

    /**
     * Get the url for an integration Logo
     *
     * @param {string} connectionName The name of the integration (the CONNECTION_NAME constant value, not the user-friendly name)
     * @param {bool} isAlert If we need the alert icon
     * @returns {string} URL string
     */
    getIntegrationLogoURL: function (connectionName, isAlert) {
        // Combine our integrations for easier searching
        const integrations = Object.assign(CONST.DIRECT_INTEGRATIONS, CONST.INDIRECT_INTEGRATIONS);
        const integrationData = integrations[connectionName];

        return _.get(integrationData, isAlert ? 'alert_image' : 'image') || g_cloudFrontImg + 'exportIcons/exportIcon-IS.png';
    },

    /**
     * Wrapper for a general PubSub EVENT.ERROR
     * @param {string|array} messageOrTemplate
     * @param {Object} [data] any parameters needed for the message template
     */
    error: function (messageOrTemplate, data) {
        let message = '';
        if (_.isArray(messageOrTemplate)) {
            message = Templates.get(messageOrTemplate, data);
        } else if (_.isString(messageOrTemplate)) {
            message = messageOrTemplate;
        }

        if (DialogManager.getTopDialogName() === 'Error') {
            // Instead of throwing out error growls, we are simply opening a error dialog.
            // If there is a dialog already bring thrown, we do not have to do it here.
            // You can remove UIUtils.error from where ever its being called.
            Log.client('Dialog is already being thrown. Remove where this UIUtils.error is being called.');
        } else {
            PubSub.publish(EVENT.ERROR, {
                tplt: 'generic_with_message',
                data: {
                    message: message,
                    htmlMessage: null,
                }
            });
        }
    },

    /**
     * 
     * @param {object} jQueryObject 
     * @param {string} labelText 
     * @return {object} jQueryObject
     */
    addTooltip: function (jQueryObject, labelText) {
        return jQueryObject
            .attr('data-original-title', labelText)
            .tooltip();
    },
    Animation,
    Growl,
    Loading,
    Progress,
    Customization,
    Date,
    QRCode,
    ConstructorAutoComplete,
    Intercom,
}
