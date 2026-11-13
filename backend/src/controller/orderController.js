import orderModel from "../model/orderModel.js";
import cartModel from "../model/cartModel.js";
import productModel from "../model/product.js";
import crypto from "crypto";

async function prepareOrderProducts(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No products provided");
  }

  const prepared = [];
  for (const item of items) {
    const product = await productModel.findById(item.product);
    if (!product) throw new Error("One of the selected products is unavailable");

    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) throw new Error("Invalid product quantity");

    let variantSnapshot = undefined;
    let price = Number(product.price);
    if (item.variant?._id || item.variant) {
      const variantId = item.variant?._id || item.variant;
      const variant = product.variants.id(variantId);
      if (!variant) throw new Error(`Selected variant for ${product.name} is unavailable`);
      if (variant.stock < quantity) throw new Error(`Only ${variant.stock} item(s) left for ${product.name}`);
      price = Number(variant.price);
      variantSnapshot = {
        _id: variant._id,
        size: variant.size,
        color: variant.color,
        image: variant.image || "",
      };
    }

    prepared.push({
      product: product._id,
      quantity,
      price,
      ...(variantSnapshot ? { variant: variantSnapshot } : {}),
      selectedImage: typeof item.selectedImage === "string" ? item.selectedImage : "",
    });
  }
  return prepared;
}

function getAddress(address) {
  if (!address?.username || !address?.mobilenumber || !address?.houseaddress ||
    !address?.city || !address?.pincode || !address?.state) {
    throw new Error("Please provide a complete delivery address");
  }
  return address;
}

export async function createOrder(req, res) {
  try {
    const products = await prepareOrderProducts(req.body.products);
    const address = getAddress(req.body.address);
    const totalamount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await orderModel.create({
      user: req.user.id,
      products,
      totalamount,
      address,
      paymentmethod: "COD",
      paymentstatus: "Pending",
    });
    await cartModel.deleteMany({ user: req.user.id });
    return res.status(201).json({ message: "Order Placed", order });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to place order" });
  }
}


export async function createRazorpayOrder(req, res) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return res.status(500).json({ message: "Razorpay test keys are not configured in backend/.env" });
    }

    const products = await prepareOrderProducts(req.body.products);
    const address = getAddress(req.body.address);
    const totalamount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(totalamount * 100),
        currency: "INR",
        receipt: `shopsy_${req.user.id}_${Date.now()}`,
        notes: { userId: String(req.user.id) },
      }),
    });
    const razorpayOrder = await razorpayResponse.json();
    if (!razorpayResponse.ok) {
      return res.status(razorpayResponse.status).json({ message: razorpayOrder.error?.description || "Unable to create Razorpay order" });
    }

    return res.status(200).json({
      key: keyId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      products,
      address,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Unable to start payment" });
  }
}

export async function verifyRazorpayPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products, address } = req.body;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return res.status(500).json({ message: "Razorpay keys are not configured" });
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment verification details are missing" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    const expected = Buffer.from(expectedSignature, "hex");
    const received = Buffer.from(razorpay_signature, "hex");
    if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
    const [gatewayOrderResponse, paymentResponse] = await Promise.all([
      fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, { headers: { Authorization: authHeader } }),
      fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, { headers: { Authorization: authHeader } }),
    ]);
    const gatewayOrder = await gatewayOrderResponse.json();
    const payment = await paymentResponse.json();
    if (!gatewayOrderResponse.ok || !paymentResponse.ok ||
      gatewayOrder.notes?.userId !== String(req.user.id) ||
      payment.order_id !== razorpay_order_id || payment.status !== "captured") {
      return res.status(400).json({ message: "Razorpay payment could not be confirmed" });
    }
    if (await orderModel.findOne({ razorpayPaymentId: razorpay_payment_id })) {
      return res.status(409).json({ message: "This payment has already been used for an order" });
    }

    // Re-fetch product prices and stock rather than trusting values sent by the browser.
    const verifiedProducts = await prepareOrderProducts(products);
    const verifiedAddress = getAddress(address);
    const totalamount = verifiedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (Number(payment.amount) !== Math.round(totalamount * 100) || Number(gatewayOrder.amount) !== Math.round(totalamount * 100)) {
      return res.status(400).json({ message: "Paid amount does not match the order total" });
    }
    const order = await orderModel.create({
      user: req.user.id,
      products: verifiedProducts,
      totalamount,
      address: verifiedAddress,
      paymentmethod: "Razorpay",
      paymentstatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });
    await cartModel.deleteMany({ user: req.user.id });
    return res.status(201).json({ message: "Payment successful and order placed", order });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Payment verification failed" });
  }
}

export async function getUserOrders(req, res) {
  try {
    const orders = await orderModel
      .find({ user: req.user.id })
      .populate("products.product");

    return res.status(200).json({
      message: "order fetched",
      orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "server error",
    });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;

    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true },
    );

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}

export async function cancelOrder(req, res) {
  try {
    const { id, productId } = req.params;

    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const orderProduct = order.products.find(
      (item) => item.product.toString() === productId
    );

    if (!orderProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found in this order",
      });
    }

    if (orderProduct.orderStatus !== "Placed") {
      return res.status(400).json({
        success: false,
        message: "Product cannot be cancelled after shipping",
      });
    }

    orderProduct.orderStatus = "Cancelled";

    const allCancelled = order.products.every(
      (item) => item.orderStatus === "Cancelled"
    );

    if (allCancelled) {
      order.orderStatus = "Cancelled";

      if (order.paymentmethod === "COD") {
        order.paymentstatus = "Cancelled";
      }
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Product cancelled successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getOrders(req, res) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "unauthorized",
      });
    }

    const orders = await orderModel
      .find()
      .populate("user", "username email")
      .populate("products.product");

    return res.status(200).json({
      message: "orders fetched",
      orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export async function deleteOrder(req, res) {
  try {
    const { id, productId } = req.params;

    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const productIndex = order.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in this order",
      });
    }

    const item = order.products[productIndex];

    if (item.orderStatus !== "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled products can be deleted",
      });
    }

    order.products.splice(productIndex, 1);

    if (order.products.length === 0) {
      await orderModel.findByIdAndDelete(id);
    } else {
      order.totalamount = order.products.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: "Cancelled product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
}
