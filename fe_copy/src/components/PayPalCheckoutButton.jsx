import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React, { useState, useEffect } from "react";

const PayPalCheckoutButton = ({
  totalAmount,
  paypalEmail,
  items,
  merchantID,
  handlePlaceOrder,
  order,
}) => {
  // State to check if all required props are ready
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure all necessary props are available before rendering the PayPal button
    if (totalAmount && paypalEmail && items && handlePlaceOrder && order) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [totalAmount, paypalEmail, items, handlePlaceOrder, merchantID, order]);

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "Abyy9Z-JZx5mZiqXweLUvTFt5Ccg48FzSSeVCvo1MJmucY3Xfv_IiY75rwI9rkLbXzMuHoWMQTjvDv8D",
      }}
    >
      {isReady ? (
        <PayPalButtons
          // Using key to force re-render when totalAmount or other relevant props change
          key={`${totalAmount}-${merchantID}-${items.length}`}
          createOrder={(data, actions) => {
            if (!paypalEmail) {
              console.error("PayPal email is missing.");
              alert(
                "Merchant information is missing. Cannot proceed with payment."
              );
              return;
            }

            // Clean up the merchantID by removing any extra spaces or newline characters
            const cleanedMerchantID = merchantID?.trim();

            // Create the purchase units payload
            const purchaseUnits = [
              {
                amount: {
                  currency_code: "USD",
                  value: totalAmount,
                },
                payee: cleanedMerchantID
                  ? { merchant_id: cleanedMerchantID }
                  : { email_address: paypalEmail }, // Fallback to email if merchant_id is not provided
              },
            ];

            console.log("Creating order with the following payload:", {
              purchase_units: purchaseUnits,
            });

            return actions.order.create({
              purchase_units: purchaseUnits,
            });
          }}
          onApprove={async (data, actions) => {
            try {
              const capturedOrder = await actions.order.capture();
              console.log("Order successfully captured:", capturedOrder);

              handlePlaceOrder(order);
              alert("Transaction completed successfully.");
            } catch (error) {
              console.error("Error during transaction approval:", error);
              alert(
                "An error occurred during the transaction. Please try again."
              );
            }
          }}
          onError={(error) => {
            console.error("PayPal Checkout Error:", error);
            alert("An error occurred during payment. Please try again.");
          }}
        />
      ) : (
        <p>Loading PayPal...</p>
      )}
    </PayPalScriptProvider>
  );
};

export default PayPalCheckoutButton;
