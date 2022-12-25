const modelCategory = require('../models/Category');
const mapCategory = require('../mappers/category.js');


module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await modelCategory.find({}).populate('subcategories');
  ctx.body = {categories: categories.map(mapCategory)};
};
