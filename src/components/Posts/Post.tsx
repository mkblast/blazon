import { Link } from "react-router-dom";
import { Post as PostType, User } from "../../types";
import { formatDate } from "../../utiles";
import Styles from "./Post.module.css";

type PostProps = {
    post: PostType,
    me: User,
    idx: number,
    handleLike: (id: string, idx: number) => void,
}

function Post(
    { post, me, idx, handleLike }: PostProps
) {
    return (
        <div className={Styles.post}>
            <Link to={`/users/${post.author._id}`} className={Styles.info}>
                <img src={post.author.profile_image} alt="" />
                <div>
                    <p className={Styles.name}>{post.author.name}</p>
                    <p className={Styles.username}>{post.author.username}</p>
                </div>
            </Link>
            <Link to={`/posts/${post._id}`} className={Styles.body}>
                <p>{post.body}</p>
            </Link>

            <div className={Styles.status}>
                <div className={Styles.actions}>
                    <Link to={`/posts/${post._id}`} className={Styles.replies}>
                        <span className="material-icons-outlined">mode_comment</span>
                    </Link>
                    <div className={Styles.like}
                        onClick={() => handleLike(post._id, idx)}
                    >
                        {post.likes.find(val => val === me?._id) ?
                            <>
                                <span>{post.likes.length}</span>
                                <span className="material-icons">favorite</span>
                            </>
                            :
                            <>
                                <span>{post.likes.length}</span>
                                <span className="material-icons">favorite_border</span>
                            </>
                        }
                    </div>
                </div>
                <p>{formatDate(post.date)}</p>
            </div>
        </div>
    );
}

export default Post;
