// import { PayPalButtons } from "@paypal/react-paypal-js";

// const PayPalCheckoutButton = ({
//   totalAmount,
//   paypalEmail,
//   items,
//   handlePlaceOrder,
// }) => {
//   const createOrder = (data, actions) => {
//     // Create an order for the total amount
//     return actions.order.create({
//       purchase_units: [
//         {
//           amount: {
//             value: totalAmount, // Total amount for the group
//           },
//           payee: {
//             email_address: paypalEmail, // PayPal email of the business owner
//           },
//         },
//       ],
//     });
//   };

//   const onApprove = async (data, actions) => {
//     return actions.order.capture().then((details) => {
//       console.log("Transaction completed:", details);
//       // Once the payment is successful, call the handlePlaceOrder function
//       handlePlaceOrder({
//         paypalEmail,
//         items,
//         totalAmount,
//         orderId: details.id, // Pass the order ID back to the parent
//       });
//     });
//   };

//   const onError = (err) => {
//     console.error("PayPal error:", err);
//     // Handle PayPal errors
//   };

//   return (
//     <PayPalButtons
//       createOrder={createOrder}
//       onApprove={onApprove}
//       onError={onError}
//     />
//   );
// };

// export default PayPalCheckoutButton;
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React, { useState, useEffect } from "react";

const PayPalCheckoutButton = ({
  totalAmount,
  paypalEmail,
  items,
  merchantID,
  handlePlaceOrder,
}) => {
  // Ensure all required values are available before rendering the PayPal button
  const [isReady, setIsReady] = useState(false);
  // const merchantID= "MG44X9L3T5CEE";
  useEffect(() => {
    if (totalAmount && paypalEmail && items && handlePlaceOrder) {
      setIsReady(true);
    }
  }, [totalAmount, paypalEmail, items, handlePlaceOrder]);

  console.log(
    "merchantID",
    merchantID,
    "\nTotalAmount >> ",
    totalAmount,
    "\npaypalEmail >>",
    paypalEmail,
    "\nitems >>",
    items,
    "\nhandlePlaceOrder >>",
    handlePlaceOrder
  );

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "Abyy9Z-JZx5mZiqXweLUvTFt5Ccg48FzSSeVCvo1MJmucY3Xfv_IiY75rwI9rkLbXzMuHoWMQTjvDv8D",
      }}
    >
      {isReady ? (
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: totalAmount, // Use your dynamic amount
                  },
                  payee: {
                    merchant_id: merchantID, // Replace with the actual Merchant ID
                    email_address: paypalEmail,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            return actions.order.capture().then(async (details) => {
              const orderData = {
                id: data.orderID,
                payer: details.payer,
                items: items,
              };

              // Place the order using the captured order details
              await handlePlaceOrder(orderData);
              alert(
                "Transaction completed by " + details.payer.name.given_name
              );
            });
          }}
          onError={(err) => {
            console.error("PayPal Checkout Error:", err);
            alert("An error occurred during payment. Please try again.");
          }}
          onClick={(data, actions) => {
            if (!items || items.length === 0) {
              alert("Your cart is empty.");
              return actions.reject();
            }
            return actions.resolve();
          }}
        />
      ) : (
        <p>Loading PayPal...</p>
      )}
    </PayPalScriptProvider>
  );
};

export default PayPalCheckoutButton;