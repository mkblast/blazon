import { useEffect, useState } from "react";
import { useApp } from "../../App";
import { Post } from "../../types";
import Posts from "../../components/Posts";
import NewPost from "../../components/Posts/newPost";

function Root() {
    const { me, API_URI, token } = useApp();
    const [posts, setPosts] = useState<Post[] | null>(null);

    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_URI}/api/main/posts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (!res.ok) {
                console.log(data);
                return;
            }

            setPosts(data.posts);
        })();
    }, [API_URI, token]);

    return (
        <>
            {
                posts ?
                    <>
                        <NewPost setPosts={setPosts} reply_to={null} />
                        <Posts posts={posts} me={me!} token={token!} API_URI={API_URI!} setPosts={setPosts} />
                    </>
                    :
                    <></>
            }
        </>
    );
}

export default Root;
