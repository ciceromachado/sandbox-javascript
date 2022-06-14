LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {

    const creditCard = buildCreditCard(Checkout, PaymentOptions);
    Checkout.addPaymentOption(creditCard);
});

function buildCreditCard(Checkout,PaymentOptions) {

    return PaymentOptions.Transparent.CardPayment({
        id: "mypayments_credito_mercado_pago_cicero",
        fields: {
            card_holder_birth_date: true,
        },
        onLoad: function () {


        },
        onDataChange: Checkout.utils.throttle(function () {
        }, 700),
        onSubmit: function (callback) {

            var acmeCardRelevantData = {
                orderId: Checkout.getData("order.cart.id"),
                currency: Checkout.getData("order.cart.currency"),
                total: Checkout.getData("order.cart.prices.total"),
                email: Checkout.getData("order.contact.email")

            };

            console.log(acmeCardRelevantData)

            Checkout.http
                .post("https://shrouded-mountain-60269.herokuapp.com/shop/card", acmeCardRelevantData)
                .then(function (responseBody) {
                    console.log("==========================");
                    console.log(responseBody);
                    console.log("==========================");
                })
                .catch(function (error) {
                    console.log("==========================");
                    console.log(error);
                    console.log("==========================");
                });
        }
    });
}
