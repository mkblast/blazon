import { useParams } from "react-router-dom";
import { useApp } from "../../../App";
import { useEffect, useState } from "react";
import { Post as PostType } from "../../../types";
import Posts from "../../../components/Posts";
import Post from "../../../components/Posts/Post";
import Styles from "./index.module.css";
import NewPost from "../../../components/Posts/newPost";

function FullPost() {
    const { id } = useParams();
    const [post, setPost] = useState<PostType | null>(null);
    const [replies, setReplies] = useState<PostType[] | null>(null);
    const { me, API_URI, token } = useApp();

    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_URI}/api/main/posts/${id}/replies`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (!res.ok) {
                console.log(data);
                return;
            }

            setReplies(data.replies);
        })();
    }, [API_URI, id, token]);


    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_URI}/api/main/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (!res.ok) {
                console.log(data);
                return;
            }

            setPost(data.post);
        })();
    }, [API_URI, id, token]);

    async function handleLike(id: string) {
        const isliked = post!.likes.find(value => value === me?._id);

        let res: Response;

        if (isliked !== undefined) {
            res = await fetch(`${API_URI}/api/main/posts/${id}/like`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            res = await fetch(`${API_URI}/api/main/posts/${id}/like`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        const data = await res.json();
        const resPost: PostType = data.post;

        if (!res.ok) {
            console.log(data);
            return;
        }

        setPost(resPost);
    }

    return (
        <>
            <div className={Styles.post}>
                {post ?
                    <Post post={post} idx={0} me={me!} handleLike={handleLike} />
                    :
                    <></>
                }
            </div>
            <div>
                {post ?
                    <NewPost reply_to={post._id} setPosts={setReplies}/>
                    :
                    <></>
                }
            </div>
            <div className={Styles.replies}>
                {replies ?
                    replies.length !== 0 ?
                        <Posts posts={replies} setPosts={setReplies} me={me!} token={token!} API_URI={API_URI!} />
                        :
                        <p>No replies</p>
                    :
                    <></>
                }
            </div>
        </>
    );
}

export default FullPost;
