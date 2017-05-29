/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/*jshint browser:true jquery:true*/
/*global alert*/
define(
    [
        'jquery',
        "underscore",
        'Magento_Checkout/js/view/payment',
        'ko',
        'Magento_Customer/js/model/customer',
        'Magento_Checkout/js/model/quote'
    ],
    function (
        $,
        _,
        Component,
        ko,
        customer,
        quote
    ) {
        'use strict';

        return Component.extend({
            defaults: {
                template: 'MOne_Checkout/payment'
            },
            isVisible: ko.observable(customer.isLoggedIn() && quote.isVirtual())
        });
    }
);
