<?php

namespace MOne\Checkout\Plugin\Magento\Checkout\Block\Checkout;

class LayoutProcessor
{
    /**
     * @var \Magento\Checkout\Helper\Data
     */
    private $_checkoutHelperData;

    public function __construct(\Magento\Checkout\Helper\Data $checkoutHelperData)
    {
        $this->_checkoutHelperData = $checkoutHelperData;
    }


    public function afterProcess(\Magento\Checkout\Block\Checkout\LayoutProcessor $subject, $jsLayout)
    {
        unset($jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']['children']['shippingAddress']['children']['customer-email']);
        if (isset($jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']
            ['children']['shippingAddress']['children']['shipping-address-fieldset']['children']
        )) {
            $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']
            ['children']['shippingAddress']['children']['shipping-address-fieldset']['children'] = $this->processShippingInfo(
                $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']
                ['children']['shippingAddress']['children']['shipping-address-fieldset']['children']
            );
        }

        if (isset($jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']['payment']['children'])) {
            $jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']
            ['payment']['children'] = $this->processBillingInfo(
                $jsLayout['components']['checkout']['children']['steps']['children']['billing-step']['children']
                ['payment']['children']
            );
        }

        return $jsLayout;
    }

    /**
     * @param array $shippingLayout
     *
     * @return array
     */
    protected function processShippingInfo($shippingLayout)
    {
        $shippingConfigLayout = array(
            'firstname' => [
                'sortOrder' => '20'
            ],
            'lastname' => [
                'sortOrder' => '40'
            ],
            'telephone' => [
                'sortOrder' => '50'
            ],
            'company' => [
                'sortOrder' => '60',
                'visible' => false
            ],
            'fax' => [
                'sortOrder' => '65',
                'visible' => false
            ],
            'region' => [
                'sortOrder' => '99'
            ]
        );
        $result = array_replace_recursive($shippingLayout, $shippingConfigLayout);
        return $result;
    }


    /**
     * Appends billing address form component to payment layout
     *
     * @param array $paymentLayout
     *
     * @return array
     */
    protected function processBillingInfo($paymentLayout)
    {
        if (!isset($paymentLayout['payments-list']['children'])) {
            return $paymentLayout;
        }

        $billingConfigLayout = array(
            'children' => [
                'form-fields' => [
                    'children' => [
                        'firstname' => [
                            'sortOrder' => '20'
                        ],
                        'lastname' => [
                            'sortOrder' => '40'
                        ],
                        'telephone' => [
                            'sortOrder' => '50'
                        ],
                        'company' => [
                            'sortOrder' => '60',
                            'visible' => false
                        ],
                        'fax' => [
                            'sortOrder' => '65',
                            'visible' => false
                        ],
                        'region' => [
                            'sortOrder' => '99'
                        ]
                    ]
                ]
            ]
        );

        // if billing address should be displayed on Payment method or page
        if ($this->_checkoutHelperData->isDisplayBillingOnPaymentMethodAvailable()) {
            foreach ($paymentLayout['payments-list']['children'] as $paymentCode => $paymentInfo) {
                if ($paymentCode != 'before-place-order') {
                    $paymentLayout['payments-list']['children'][$paymentCode] = array_replace_recursive($paymentInfo, $billingConfigLayout);
                }
            };
        } else {
            $paymentLayout['afterMethods']['children']['billing-address-form'] = array_replace_recursive($paymentLayout['afterMethods']['children']['billing-address-form'], $billingConfigLayout);
        }

        return $paymentLayout;
    }

}