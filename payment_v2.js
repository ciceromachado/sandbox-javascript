LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {
  // Create a new instance of external Payment Option and set its properties.
  var AcmeExternalPaymentOption = PaymentOptions.ExternalPayment({
    // Set the option's unique ID as it is configured on the Payment Provider so they can be related at the checkout.
    id: "acme_redirect",

    // This parameter renders the billing information form and requires the information to the consumer.
    fields: {
      billing_address: true,
    },

    // This function handles the order submission event.
    onSubmit: function (callback) {
      // Gather the minimum required information. You should include all the relevant data here.
      let acmeRelevantData = {
        orderId: Checkout.getData("order.cart.id"),
        currency: Checkout.getData("order.cart.currency"),
        total: Checkout.getData("order.cart.prices.total"),
      };

      // Use the Checkout HTTP library to post a request to our server and fetch the redirect URL.
      Checkout.http
        .post("https://62a39c9d21232ff9b2230e1e.mockapi.io/api/v1/payment", {
          data: acmeRelevantData,
        })
        .then(function (responseBody) {
           console.log(responseBody)
          // Once the redirect URL is generated, invoke the callback by passing it as argument.
          if (responseBody.data.success) {
            callback({
              success: true,
              redirect: responseBody.data.redirect_url,
              extraAuthorize: true, // Legacy paameter, but currently required with `true` value. Will be deprecrated soon.
            });
          } else {
          // If the generation of the redirect URL fails, invoke the callback indicating the corresponding error code. E.g.: `consumer_country_invalid`. See the list of available error codes.
            callback({
              success: false,
              error_code: responseBody.data.error_code,
            });
          }
        })
        .catch(function (error) {
          // Handle a potential error in the HTTP request.

          callback({
            success: false,
            error_code: "payment_processing_error",
          });
        });
    },
  });

  // Finally, add the Payment Option to the Checkout object so it can be render according to the configuration set on the Payment Provider.
  Checkout.addPaymentOption(AcmeExternalPaymentOption);
});
