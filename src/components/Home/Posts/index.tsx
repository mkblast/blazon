import { useEffect, useState } from "react";
import { Post, User } from "../../../types";
import Styles from "./index.module.css";

function Posts() {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const API_URI = import.meta.env.VITE_API_URI;
    const token = localStorage.getItem("token");

    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_URI}/api/main/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            const posts: Post[] = data.posts;
            console.log(posts);

            setPosts(posts);
        })();
    }, [API_URI, token]);

    async function handleLike(id: string, idx: number) {
        const meRes = await fetch(`${API_URI}/api/main/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const meData = await meRes.json();
        const me: User = meData.me;

        const isliked = posts![idx].likes.find(value => value === me._id);

        let likesRes: Response;

        if (isliked !== undefined) {
            likesRes = await fetch(`${API_URI}/api/main/posts/${id}/like`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } else {
            likesRes = await fetch(`${API_URI}/api/main/posts/${id}/like`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        const likeData = await likesRes.json();
        const resPost: Post = likeData.post;

        if (!likesRes.ok) {
            console.log(likeData);
            return;
        }

        setPosts(prev => prev!.map(post => {
            return (
                post._id === id ?
                    resPost
                    :
                    post
            );
        }));
    }

    return (
        posts ?
            posts.map((post, idx) =>
                <div key={post._id} className={Styles.post}>
                    <p>{post.author.name}</p>
                    <p>{post.author.username}</p>
                    <p>{post.body}</p>
                    <p>{post.date}</p>
                    <button onClick={() => handleLike(post._id, idx)}>{post.likes.length}</button>
                </div>
            )
            :
            <></>
    );
}

export default Posts;
