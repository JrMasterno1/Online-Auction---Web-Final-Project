import categoryModel from '../models/category.model.js';
import productModel from '../models/product.model.js';
import cartModel from '../models/cart.model.js';

export default function (app) {
  app.use(async function (req, res, next) {

    if (typeof (req.session.auth) === 'undefined') {
      req.session.auth = false;
    }

    if (req.session.auth === false) {
      req.session.cart = [];
    }

    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    app.locals.success = req.flash('success');
    next();
  });
  app.use(async function (req, res, next) {
    res.locals.lcCategories = await categoryModel.findAllMain();
    for (let cat of res.locals.lcCategories) {
      cat.SubCat = await categoryModel.findSubCat(cat.CatID);
      for (let sub of cat.SubCat) {
        sub.ProductCount = await productModel.countProductByCat(sub.CatID);
      }
    }
    next();
  });

  app.use(async function (req, res, next) {

    if (typeof (req.session.auth) === 'undefined') {
      req.session.auth = false;
    }

    if (req.session.auth === false) {
      req.session.cart = [];
    }

    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    res.locals.cartSummary = cartModel.getNumberOfItems(req.session.cart);

    next();
  });

}