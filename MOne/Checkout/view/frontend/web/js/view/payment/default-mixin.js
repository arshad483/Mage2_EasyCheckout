define([
    'jquery',
    'underscore'
], function ($, _) {
    'use strict';
    return function (defaultPaymentMethod) {
        return defaultPaymentMethod.extend({
            /** Returns image icon for payment method */
            getIconPaymentMethod: function() {
                return window.checkoutConfig.payment.icons[this.item.method] ? window.checkoutConfig.payment.icons[this.item.method] : window.checkoutConfig.payment.icons.default;
            }
        });
    };
});
