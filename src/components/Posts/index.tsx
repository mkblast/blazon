import { Dispatch, SetStateAction } from "react";
import { Post as PostType, User as UserType } from "../../types";
import Styles from "./index.module.css";
import Post from "./Post";

type PostsProps = {
    posts: PostType[] | null,
    setPosts: Dispatch<SetStateAction<PostType[] | null>>
    me: UserType,
    token: string,
    API_URI: string,
}

function Posts(
    { posts, me, token, API_URI, setPosts }: PostsProps
) {
    async function handleLike(id: string, idx: number) {
        const isliked = posts![idx].likes.find(value => value === me?._id);

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
        <>
            <div className={Styles.posts}>
                {posts ?
                    posts.map((post, idx) =>
                        <Post key={post._id}
                            post={post}
                            idx={idx}
                            me={me!}
                            handleLike={handleLike}
                        />
                    )
                    :
                    <></>
                }
            </div>
        </>
    );
}

export default Posts;
