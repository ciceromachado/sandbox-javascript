LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {
  var Custom = PaymentOptions.Transparent.CardPayment({
    id: "acme_transparent_card",

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

  Checkout.addPaymentOption(Custom);
});
