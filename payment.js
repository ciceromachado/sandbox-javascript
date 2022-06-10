LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {
  // Create a new instance of external Payment Option and set its properties.
  var AcmeExternalPaymentOption = PaymentOptions.ExternalPayment({
    // Set the option's unique ID as it is configured on the Payment Provider so they can be related at the checkout.
    id: "acme_redirect",

    console.log("TESTE -->  " , Checkout.getData("order.cart.prices.total"))
  
    // This parameter renders the billing information form and requires the information to the consumer.
    fields: {
      billing_address: true
    },

    // This function handles the order submission event.
    onSubmit: function (callback) {
      // Gather the minimum required information. You should include all the relevant data here.
      callback({
        success: true,
        redirect:
          "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=806708982-50492a4b-8d0b-452f-93fd-f5db8f18e53b",
        extraAuthorize: true // Legacy paameter, but currently required with `true` value. Will be deprecrated soon.
      });
    }
  });
  // Finally, add the Payment Option to the Checkout object so it can be render according to the configuration set on the Payment Provider.
  Checkout.addPaymentOption(AcmeExternalPaymentOption);
});
