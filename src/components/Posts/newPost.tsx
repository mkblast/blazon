import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Post as PostType } from "../../types";
import { useApp } from "../../App";

type NewPostProps = {
    reply_to: string | null,
    setPosts: Dispatch<SetStateAction<PostType[] | null>>
}

function NewPost(
    { reply_to, setPosts }: NewPostProps
) {
    const { API_URI, token } = useApp();
    const [post, setPost] = useState("");

    function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setPost(e.target.value);
    }

    async function handleSubmit() {
        const url = new URL(reply_to ?
            `${API_URI}/api/main/posts/${reply_to}/replies`
            :
            `${API_URI}/api/main/posts`
        );

        const res = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                body: post,
            })
        });
        const data = await res.json();

        if (!res.ok) {
            console.log(data);
            return;
        }

        setPosts(prev => (
            prev !== null ?
                [data.post, ...prev]
                :
                [data.post]
        ));
        setPost("");
    }

    return (
        <>
            <form onSubmit={(e) => {
                e.preventDefault();
            }}>
                <textarea name="body" onChange={handleInputChange} value={post}></textarea>
                <button onClick={handleSubmit}>
                    <span className="material-icons">send</span>
                </button>
            </form>
        </>
    );
}

export default NewPost;
