var config = {
    config: {
        mixins: {
            'Magento_Checkout/js/view/payment/default': {
                'MOne_Checkout/js/view/payment/default-mixin': true
            },
            'Magento_Checkout/js/view/billing-address': {
                'MOne_Checkout/js/view/billing-address/info-mixin': true
            }
        }
    }
};
