const express = require('express');
const { Favorite } = require("../models/Favorite");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/favoriteNumber", auth, (req, res) => {
    Favorite.find({ "movieId": req.body.movieId })
        .exec((err, subscribe) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, subscribeNumber: subscribe.length })
        })
});

router.post("/favorited", auth, (req, res) => {
    Favorite.find({ "movieId": req.body.movieId, "userFrom": req.user._id })
        .exec((err, subscribe) => {
            if (err) return res.status(400).send(err)
            let result = false;

            if (subscribe.length !== 0) {
                result = true
            }
            res.status(200).json({ success: true, subcribed: result })
        })
});

router.post("/addToFavorite", auth, (req, res) => {
    let infos = {
        movieId: req.body.movieId,
        userFrom: req.user._id,
        movieTitle: req.body.movieTitle,
        moviePost: req.body.moviePost,
        movieRunTime: req.body.movieRunTime
    };
    const favorite = new Favorite(infos);

    favorite.save((err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({ success: true })
    })
});

router.post("/removeFromFavorite", auth, (req, res) => {


    Favorite.findOneAndDelete({ movieId: req.body.movieId, userFrom: req.user._id})
        .exec((err, doc) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({ success: true, doc })
        })
});

router.post("/getFavoredMovie", auth, (req, res) => {
    Favorite.find({ 'userFrom': req.user._id })
        .exec((err, favorites) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, favorites })
        })
});

module.exports = router;