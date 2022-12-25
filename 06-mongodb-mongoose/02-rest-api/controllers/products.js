const modelProduct = require('../models/Product');
const mapperProduct = require('../mappers/product.js');
const { default: mongoose } = require('mongoose');

/**
 * Функция возвращает список продуктов
 * @param {obj} subcategory подкатегория (Необязательно)
**/
async function getProducts(subcategory) {
  return (await modelProduct.find((subcategory == null) ? {} : {subcategory: subcategory})).map(mapperProduct);
}


module.exports.products = async function products(ctx, next) {
  const {subcategory} = ctx.query;
  const products = await getProducts(subcategory);
  ctx.body = {products: products};
}


module.exports.productById = async function productById(ctx, next) {
  //console.dir(ctx.params);
  const id = ctx.params.id;
  
  if (!mongoose.isValidObjectId(id)) {
    ctx.throw(400, 'invalid id');
    return;
  }

  const product = await modelProduct.findById(id);
  
  if (product == null) {
    ctx.throw(404, 'id not found');
    return;
  }
  
  ctx.body = {product: mapperProduct(product)};
};

