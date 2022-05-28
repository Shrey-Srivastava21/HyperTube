const express = require("express");
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/getLikes", auth, (req, res) => {
	let variable = {};

	if (req.body.videoId) {
		variable = { videoId: req.body.videoId };
	} else {
		variable = { commentId: req.body.commentId };
	}

	Like.find(variable)
		.exec((err, likes) => {
			if (err) return (res.status(400).send(err));
			res.status(200).json({ success: true, likes });
		});
});

router.post("/getDislikes", auth, (req, res) => {
	let variable = {};

	if (req.body.videoId) {
		variable = { videoId: req.body.videoId };
	} else {
		variable = { commentId: req.body.commentId };
	}

	Dislike.find(variable)
		.exec((err, dislikes) => {
			if (err) return (res.status(400).send(err));
			res.status(200).json({ success: true, dislikes });
		});
});

function upLike(variable, err, result, res) {
	if (err) return (res.status(400).send(err));
	else if (result.length === 0) {
		const like = new Like(variable);

		like.save((err, likeResult) => {
			if (err) return (res.json({ success: false, err }));
			Dislike.findOneAndDelete(variable)
				.exec((err, disLikeResult) => {
					if (err) return (res.status(400).json({ success: false, err }));
					res.status(200).json({ success: true, up: true });
				});
		});
	} else {
		Like.findOneAndDelete(variable)
			.exec((err, likeResult) => {
				if (err) return (res.status(400).json({ success: false, err }));
				res.status(200).json({ success: true, up: false });
			});
	}
}

router.post("/upLike", auth, (req, res) => {
	if (req.body.videoId) {
		let variable = { videoId: req.body.videoId, userId: req.user._id };

		Like.find({
			$and : [{ "videoId" : req.body.videoId }, { "userId" : req.user._id }]
		}, (err, result) => {
			upLike(variable, err, result, res);
		});
	} else {
		let variable = { commentId: req.body.commentId , userId: req.user._id };

		Like.find({
			$and : [{ "commentId" : req.body.commentId }, { "userId" : req.user._id }]
		}, (err, result) => {
			upLike(variable, err, result, res);
		});
	}
});

function upDislike(variable, err, result, res) {
	if (err) return (res.status(400).send(err));
	else if (result.length === 0) {
		const disLike = new Dislike(variable);

		disLike.save((err, dislikeResult) => {
			if (err) return (res.json({ success: false, err }));
			Like.findOneAndDelete(variable)
				.exec((err, likeResult) => {
					if (err) return (res.status(400).json({ success: false, err }));
					res.status(200).json({ success: true, up: true });
				});
		});
	} else {
		Dislike.findOneAndDelete(variable)
			.exec((err, likeResult) => {
				if (err) return ((res.status(400).json({ success: false, err })));
				res.status(200).json({ success: true, up: false });
			});
	}
}

router.post("/upDisLike", auth, (req, res) => {
	if (req.body.videoId) {
		let variable = { videoId: req.body.videoId, userId: req.user._id };

		Dislike.find({
			$and : [{ "videoId" : req.body.videoId }, { "userId" : req.user._id }]
		}, (err, result) => {
			upDislike(variable, err, result, res);
		});
	} else {
		let variable = { commentId: req.body.commentId , userId: req.user._id };

		Dislike.find({
			$and : [{ "commentId" : req.body.commentId }, { "userId" : req.user._id }]
		}, (err, result) => {
			upDislike(variable, err, result, res);
		});
	}
});

module.exports = router;