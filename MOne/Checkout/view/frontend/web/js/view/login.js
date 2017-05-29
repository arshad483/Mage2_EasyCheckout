define(
    [
        'jquery',
        'underscore',
        'Magento_Ui/js/form/form',
        'ko',
        'Magento_Checkout/js/model/step-navigator',
        'Magento_Customer/js/model/customer',
        'Magento_Customer/js/action/check-email-availability',
        'Magento_Customer/js/action/login',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/checkout-data',
        'Magento_Checkout/js/model/full-screen-loader',
        'mage/translate',
        'mage/validation'
    ],
    function (
        $,
        _,
        Component,
        ko,
        stepNavigator,
        customer,
        checkEmailAvailability,
        loginAction,
        quote,
        checkoutData,
        fullScreenLoader,
        $t
    ) {
        'use strict';
        /**
         *
         *
         */
        return Component.extend({
            defaults: {
                template: 'MOne_Checkout/login',
                email: checkoutData.getInputFieldEmailValue(),
                emailFocused: false,
                isLoading: false,
                checkoutUrl: window.checkoutConfig.checkoutUrl,
                listens: {
                    emailFocused: 'validateEmail'
                }
            },

            isVisible: ko.observable(!customer.isLoggedIn()),
            isCustomerLoggedIn: customer.isLoggedIn,
            isEmailExisted: ko.observable(false),
            checkDelay: 200,
            checkRequest: null,
            isEmailCheckComplete: null,
            forgotPasswordUrl: window.checkoutConfig.forgotPasswordUrl,
            emailCheckTimeout: 0,

            /**
             *
             * @returns {*}
             */
            initialize: function () {
                this._super();
                if (!this.isCustomerLoggedIn()) {
                    this.checkEmailAvailability();
                    stepNavigator.registerStep(
                        'login',
                        'login',
                        $t('Login'),
                        this.isVisible,
                        _.bind(this.navigate, this),
                        5
                    );
                }

                return this;
            },

            /**
             * Initializes observable properties of instance
             *
             * @returns {Object} Chainable.
             */
            initObservable: function () {
                this._super()
                    .observe(['email', 'emailFocused', 'isLoading', 'isEmailExisted']);

                return this;
            },

            navigate: function () {
                this.visible(true);
            },

            /**
             * @returns void
             */
            setCustomerInformation: function () {
                var self = this;

                if (self.isEmailExisted()) {
                    var loginFormSelector = 'form[data-role=email-with-possible-login]';
                    self.login(loginFormSelector);
                    return;
                }

                this.checkEmailExisted();
                $.when(this.isEmailCheckComplete).always(function () {
                    if (!self.validateCustomerInformation()) return;
                    if (!self.isEmailExisted()) {
                        stepNavigator.next();
                    } else {

                    }
                });
            },

            /**
             * @return {Boolean}
             */
            validateCustomerInformation: function () {
                if (customer.isLoggedIn()) return true;

                var loginFormSelector = 'form[data-role=email-with-possible-login]';
                $(loginFormSelector).validation();

                var emailValidationResult = Boolean($(loginFormSelector + ' input[name=username]').valid());
                if (!emailValidationResult) return false;

                if (!this.isEmailExisted()) return true;

                return Boolean($(loginFormSelector).validation() && $(loginFormSelector).validation('isValid'));
            },

            /**
             * Callback on changing email property
             */
            checkEmailExisted: function () {
                var self = this;

                if (self.validateEmail()) {
                    quote.guestEmail = self.email();
                    checkoutData.setValidatedEmailValue(self.email());
                }

                if (self.validateEmail()) {
                    self.checkEmailAvailability();
                }

                checkoutData.setInputFieldEmailValue(self.email());
            },

            /**
             * Check email existing.
             */
            checkEmailAvailability: function () {
                var self = this;
                this.validateRequest();
                this.isEmailCheckComplete = $.Deferred();
                this.isLoading(true);
                this.checkRequest = checkEmailAvailability(this.isEmailCheckComplete, this.email());

                $.when(this.isEmailCheckComplete).done(function () {
                    self.isEmailExisted(false);
                }).fail(function () {
                    self.isEmailExisted(true);
                }).always(function () {
                    self.isLoading(false);
                });
            },

            /**
             * If request has been sent -> abort it.
             * ReadyStates for request aborting:
             * 1 - The request has been set up
             * 2 - The request has been sent
             * 3 - The request is in process
             */
            validateRequest: function () {
                if (this.checkRequest != null && $.inArray(this.checkRequest.readyState, [1, 2, 3])) {
                    this.checkRequest.abort();
                    this.checkRequest = null;
                }
            },

            /**
             * Local email validation.
             *
             * @param {Boolean} focused - input focus.
             * @returns {Boolean} - validation result.
             */
            validateEmail: function (focused) {
                var loginFormSelector = 'form[data-role=email-with-possible-login]',
                    usernameSelector = loginFormSelector + ' input[name=username]',
                    loginForm = $(loginFormSelector),
                    validator;

                loginForm.validation();

                if (focused === false && !!this.email()) {
                    return !!$(usernameSelector).valid();
                }

                validator = loginForm.validate();

                return validator.check(usernameSelector);
            },

            /**
             * Log in form submitting callback.
             *
             * @param {HTMLElement||string} loginForm - form element.
             */
            login: function (loginForm) {
                var self = this,
                    loginData = {},
                    formDataArray = $(loginForm).serializeArray();

                formDataArray.forEach(function (entry) {
                    loginData[entry.name] = entry.value;
                });

                if (this.isEmailExisted() && $(loginForm).validation() && $(loginForm).validation('isValid')) {
                    fullScreenLoader.startLoader();
                    loginAction(loginData, self.checkoutUrl).always(function() {
                        fullScreenLoader.stopLoader();
                        setTimeout(function () {
                            self.isEmailExisted(true);
                        }, self.checkDelay);
                    });
                }
            }

        });
    }
);