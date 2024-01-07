async function displayRazorpay() {
 const res = await fetch("/createOrder")
   .then((response) => response.json())
   .catch((error) => console.error(error));

 if (!res) {
   alert("Server error. Are you online?");
   return;
 }

 const { amount, id: order_id, currency } = res;

 const options = {
   key: "razorpay_key_id",
   amount: amount.toString(),
   currency: currency,
   name: "Aurora",
   description: "Event Fee",
   image: { logo: "url" },
   order_id: order_id,
   handler: async function (response) {
     const data = {
       orderCreationId: order_id,
       razorpayPaymentId: response.razorpay_payment_id,
       razorpayOrderId: response.razorpay_order_id,
       razorpaySignature: response.razorpay_signature,
     };

     const result = await fetch("/verifyOrder", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(data),
     }).then((response) => response.json());

     alert(result.msg);
   },
   prefill: {
     name: "User Name",
     email: "useremail@example.com",
     contact: "9999999999",
   },
   notes: {
     address: "Address",
   },
   theme: {
     color: "#61dafb",
   },
   payment_capture: 1,
   method: "upi",
 };

 const paymentObject = new window.Razorpay(options);
 paymentObject.open();
}