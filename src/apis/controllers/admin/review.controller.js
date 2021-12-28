const Review = require('../../models/review.model');
const factory = require('./handler.controller');

exports.setProductUserIds = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.params.idUser;
    next();
};

exports.getAllReviews = async (req, res) => {

    try {
        const reviews = await Review.find();

        res.status(200).json({
            'status': 'success',
            data: reviews,
        });
    }
    catch (err) {
        console.log(err);
    }

}
exports.getAllReviewsIdProduct = async (req, res) => {
    try {
        const reviews = await Review.find({
            product: req.params.idproduct,
        });
        res.status(200).json({
            'status': 'success',
            data: reviews,
        });
    }
    catch (err) {
        console.log(err);
    }

}
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
