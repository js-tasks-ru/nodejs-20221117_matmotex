const orderModel = require('../models/Order');
const productModel = require('../models/Product');

const orderMap = require('../mappers/order');
const orderConfirmationMap = require('../mappers/orderConfirmation');

const sendMail = require('../libs/sendMail');


module.exports.checkout = async function checkout(ctx, next) {
    
  const order = await orderModel.create({
    user: ctx.user
    , phone: ctx.request.body.phone
    , address: ctx.request.body.address
    , product: ctx.request.body.product
  });

  const product = await productModel.findById(order.product);

  await sendMail({
    template: 'order-confirmation'
    , locals: orderConfirmationMap(order, product)
    , to: ctx.user.email
    , subject: 'Подтверждение создания заказа'
  });

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await orderModel.find({user: ctx.user}).populate('product');
  ctx.body = {orders: orders.map(orderMap)};
};
