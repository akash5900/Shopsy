import mongoose from "mongoose";

const orderProductSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    variant: {
        _id: mongoose.Schema.Types.ObjectId,
        size: String,
        color: String,
        image: String,
    },
    selectedImage: String,
    orderStatus: {
        type: String,
        enum: ["Placed", "Shipped", "Delivered", "Cancelled"],
        default: "Placed",
    },
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [orderProductSchema],
    totalamount: { type: Number, required: true },
    address: {
        username: String,
        mobilenumber: Number,
        houseaddress: String,
        city: String,
        pincode: Number,
        state: String
    },
    paymentmethod: { type: String, enum: ["COD", "Razorpay"], required: true },
    paymentstatus: {
        type: String,
        enum: ["Pending", "Paid", "Cancelled"],
        default: "Pending"
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    orderStatus: {
        type: String,
        enum: ["Placed", "Shipped", "Delivered", "Cancelled"],
        default: "Placed",
    },
}, { timestamps: true });

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
