const modelProduct = require('../models/Product');
const mapperProduct = require('../mappers/product');


async function getProducts(query) {
  //console.log(query);
  const products = await modelProduct.find( (query == null) ? {} : {'$text': {'$search': query}});
  const result = Number(products.length) > 0 ? products.map(mapperProduct) : [];
  //console.dir(result);
  return result;
}


module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  //console.log('--------------------');
  const products = await getProducts(query);
  ctx.body = {products: products};
};
