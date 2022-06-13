LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {
  var Credit = PaymentOptions.Transparent.CardPayment({
    id: "mypayments_credito_mercado_pago_cicero",

    fields: {
      card_holder_birth_date: true,
    },

    onLoad: function () {
      // Do something after the script loads.
      // Example: generate a token.
    },

    onDataChange: Checkout.utils.throttle(function () {
      // Do something when the input form data changes.
      // Data changed is already available on `Checkout.getData()`.
      // Example: update credit card installments when the order value changes.
    }, 700),

    onSubmit: function (callback) {
      // Do something when user submits the payment.
      callback({
        success: true, // Or false.
      });
    },
  });

  var AcmeExternalPaymentOption = PaymentOptions.ExternalPayment({
    // Set the option's unique ID as it is configured on the Payment Provider so they can be related at the checkout.
    id: "mypayments_redirect_mercado_pago_cicero",

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
          if (responseBody.data.data.success) {
            callback({
              success: true,
              redirect: responseBody.data.data.redirect_url,
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

  Checkout.addPaymentOption(Credit);
  Checkout.addPaymentOption(AcmeExternalPaymentOption);
});
