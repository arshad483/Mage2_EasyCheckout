/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/*global define*/
define(
    [
        'jquery',
        'underscore',
        'Magento_Checkout/js/view/shipping',
        'ko',
        'Magento_Customer/js/model/customer',
        'Magento_Checkout/js/model/quote',
        'mage/translate'
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
                template: 'MOne_Checkout/shipping'
            },
            visible: ko.observable(customer.isLoggedIn() && !quote.isVirtual()),

            navigate: function () {
                this.visible(true);
            }
        });
    }
);