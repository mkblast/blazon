import { useEffect, useState } from "react";
import { Post } from "../../../types";
import { useApp } from "../../../App";
import Posts from "../../../components/Posts";

function Explore() {
    const { me, token, API_URI } = useApp();
    const [posts, setPosts] = useState<Post[] | null>(null);

    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_URI}/api/main/posts/all`, {
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
        <Posts posts={posts} setPosts={setPosts} API_URI={API_URI!} token={token!} me={me!}/>
    );
}

export default Explore;
