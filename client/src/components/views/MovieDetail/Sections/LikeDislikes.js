import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import { LikeTwoTone } from "@ant-design/icons";
import { DislikeTwoTone } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

function LikeDislikes(props) {
	const { t } = useTranslation();
	const user = useSelector(state => state.user);
	const [Likes, setLikes] = useState(0);
	const [Dislikes, setDislikes] = useState(0);

	let variable = {};

	if (props.video) {
		variable = { videoId: props.videoId, userId: props.userId };
	} else {
		variable = { commentId: props.commentId, userId: props.userId };
	}

	useEffect(() => {
		let mounted = true;
		const getLikes = () => {
			Axios.post("/api/like/getLikes", variable)
				.then(response => {
					if (response.data.success) {
						mounted && setLikes(response.data.likes.length);
					} else {
						return;
					}
				});
		}
		getLikes();
		return () => { mounted = false; }
	}, [props, variable]);

	useEffect(() => {
		let mounted = true;
		const getDislikes = () => {
			Axios.post("/api/like/getDislikes", variable)
				.then(response => {
					if (response.data.success) {
						mounted && setDislikes(response.data.dislikes.length);
					} else {
						return;
					}
				});
		}
		getDislikes();
		return () => { mounted = false; }
	}, [props, variable]);

	const onLike = () => {
		if (user.userData && !user.userData.isAuth) {
			return props.history.push("/login");;
		}
		Axios.post("/api/like/upLike", variable)
			.then(response => {
				if (response.data.success) {
					if (response.data.up === true) {
						setLikes(Likes + 1);
						if (Dislikes !== 0) {
							setDislikes(Dislikes - 1);
						}
					} else {
						setLikes(Likes - 1);
					}
				} else {
					return props.history.push("/login");
				}
			});
	}

	const onDisLike = () => {
		if (user.userData && !user.userData.isAuth) {
			return props.history.push("/login");
		}
		Axios.post("/api/like/upDisLike", variable)
			.then(response => {
				if (response.data.success) {
					if (response.data.up === true) {
						setDislikes(Dislikes + 1);
						if (Likes !== 0) {
							setLikes(Likes - 1);
						}
					} else {
						setDislikes(Dislikes - 1);
					}
				} else {
					return props.history.push("/login");
				}
			});
	}

	return (
		<React.Fragment>
			<span key="comment-basic-like">
				<Tooltip title={t("movie.like")}>
					<LikeTwoTone
						twoToneColor="#19ba90"
						type="like"
						onClick={onLike}
					/>
				</Tooltip>
				<span style={{ paddingLeft: "8px", cursor: "auto" }}>{Likes}</span>
			</span>&nbsp;&nbsp;&nbsp;&nbsp;
			<span key="comment-basic-dislike">
				<Tooltip title={t("movie.dislike")}>
					<DislikeTwoTone
						twoToneColor="#19ba90"
						type="dislike"
						onClick={onDisLike}
					/>
				</Tooltip>
				<span style={{ paddingLeft: "8px", cursor: "auto" }}>{Dislikes}</span>
			</span>
		</React.Fragment>
	);
}

export default LikeDislikes;