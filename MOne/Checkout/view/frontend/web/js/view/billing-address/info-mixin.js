define([
    'jquery',
    'underscore'
], function ($, _) {
    'use strict';
    return function (billingAddress) {
        return billingAddress.extend({
            defaults: {
                template: 'MOne_Checkout/billing-address'
            }
        });
    };
});
