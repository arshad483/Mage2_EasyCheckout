<?php

namespace MOne\Checkout\Plugin\Magento\Checkout\Block;

use Magento\Checkout\Helper\Data as CheckoutHelper;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\View\Asset\Repository;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\UrlInterface;
use Magento\Payment\Model\Config as PaymentConfig;

class Onepage
{
    /**
     * @var CheckoutHelper
     */
    private $_checkoutHelperData;

    /**
     * @var Repository
     */
    private $_assetRepo;

    /**
     * @var RequestInterface
     */
    private $_request;

    /**
     * @var UrlInterface
     */
    private $_urlBuilder;

    /**
     * @var PaymentConfig
     */
    private $_paymentConfig;

    /**
     * Plugin Block Onepage constructor.
     * @param CheckoutHelper $checkoutHelperData
     * @param Repository $assetRepo
     * @param RequestInterface $request
     * @param UrlInterface $urlBuilder
     * @param PaymentConfig $paymentConfig
     */
    public function __construct(
        CheckoutHelper $checkoutHelperData,
        Repository $assetRepo,
        RequestInterface $request,
        UrlInterface $urlBuilder,
        PaymentConfig $paymentConfig
    ){
        $this->_checkoutHelperData = $checkoutHelperData;
        $this->_assetRepo = $assetRepo;
        $this->_request = $request;
        $this->_urlBuilder = $urlBuilder;
        $this->_paymentConfig = $paymentConfig;
    }

    /**
     * Update checkout configuration for payment icon
     *
     * @param \Magento\Checkout\Block\Onepage $subject
     * @param array $checkoutConfig
     *
     * @return array
     */
    public function afterGetCheckoutConfig(\Magento\Checkout\Block\Onepage $subject, $checkoutConfig)
    {
        $paymentMethods = $this->_paymentConfig->getActiveMethods();
        foreach ($paymentMethods as $methodCode => $paymentMethod) {
            $checkoutConfig['payment']['icons'][$methodCode] = $this->getViewFileUrl('MOne_Checkout::images/payments/' . strtolower($methodCode) . '.png');
        }
        return $checkoutConfig;
    }

    /**
     * Retrieve url of a view file
     *
     * @param string $fileId
     * @param array $params
     * @return string
     */
    public function getViewFileUrl($fileId, array $params = [])
    {
        try {
            $params = array_merge(['_secure' => $this->_request->isSecure()], $params);
            return $this->_assetRepo->getUrlWithParams($fileId, $params);
        } catch (LocalizedException $e) {
            return $this->_urlBuilder->getUrl('', ['_direct' => 'core/index/notFound']);
        }
    }

}