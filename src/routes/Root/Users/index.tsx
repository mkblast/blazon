import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Post as PostType, User as UserType } from "../../../types";
import { useApp } from "../../../App";
import Posts from "../../../components/Posts";
import Styles from "./index.module.css";
import { formatDate } from "../../../utiles";
import { Link } from "react-router-dom";

type about = {
    value: string,
    edit: boolean
}

function User() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState<UserType | null>(null);
    const [posts, setPosts] = useState<PostType[] | null>(null);
    const [following, setFollowing] = useState(false);
    const { me, setMe, token, API_URI } = useApp();
    const [about, setAbout] = useState<about>({ value: "", edit: false });
    const [profileImg, setProfileImg] = useState<File | null>(null);

    useEffect(() => {
        // const isFollowed = user?.following.find(v => v === me?._id);
        const isFollowed = me?.following.find(v => v === user?._id);
        if (isFollowed) {
            setFollowing(true);
            return;
        }

        setFollowing(false);
    }, [me, user]);

    useEffect(() => {
        (async () => {
            const url = new URL(`${API_URI}/api/main/users/${id}/posts`);
            url.searchParams.set("replies", searchParams.get("replies") ?? "false");

            const userReq = fetch(`${API_URI}/api/main/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const postsReq = fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const [userRes, postsRes] = await Promise.all([userReq, postsReq]);

            const userData = await userRes.json();
            const postsData = await postsRes.json();

            if (!userRes.ok || !postsRes.ok) {
                console.log(userData, postsData);
                return;
            }

            const user: UserType = userData.user;
            const posts: PostType[] = postsData.posts;

            setUser(user);
            setPosts(posts);
        })();
    }, [API_URI, id, searchParams, token]);

    async function handleFollow() {
        const isFollowed = me?.following.find(v => v === user?._id);
        const res = await fetch(`${API_URI}/api/main/users/${user?._id}/follow`, {
            method: isFollowed ? "DELETE" : "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();

        if (!res.ok) {
            console.log(data);
            return;
        }

        setMe(data.user);
    }

    function handleAboutChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setAbout(prev => ({ ...prev, value: e.target.value }));
    }

    async function handleAboutSubmit() {
        const res = await fetch(`${API_URI}/api/main/me`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "Application/json"
            },

            body: JSON.stringify({
                about: about.value,
                profile_image: me?.profile_image,
            })
        });
        const data = await res.json();

        if (!res.ok) {
            console.log(data);
            return;
        }

        setUser(data.user);
        setAbout(prev => ({ ...prev, edit: false }));
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setProfileImg(e.target.files[0]);
        }
    }

    async function handleProfileImgSubmit() {
        if (!profileImg) {
            console.log("Please select a file first.");
            return;
        }

        if (profileImg.size > 4000000) {
            console.log("Image must be smaller than 4mb");
            return;
        }

        const formData = new FormData();
        formData.append("profile_image", profileImg);

        const res = await fetch(`${API_URI}/api/main/me/profile_image`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();
        setUser(data.user);
    }

    return (
        <div className={Styles.container}>
            {user ?
                <div className={Styles.user}>
                    <div className={Styles.top}>
                        <div className={Styles.info}>
                            <img src={user.profile_image} alt="" />
                            <div>
                                <p className={Styles.name}>{user.name}</p>
                                <p className={Styles.username}>{user.username}</p>
                            </div>
                        </div>
                        {me?._id !== user._id ?
                            <div>
                                <button onClick={handleFollow}>
                                    {
                                        following ?
                                            "Unfollow"
                                            :
                                            "Follow"
                                    }
                                </button>
                            </div>
                            :
                            <></>
                        }
                    </div>
                    <div className={Styles.middle}>
                        {/* TODO: Add follower and following count */}
                        <p>{formatDate(user.date)}</p>
                    </div>
                    <div className={Styles.buttom}>
                        {
                            about.edit ?
                                <>
                                    <textarea name="about" value={about.value} onChange={handleAboutChange}></textarea>
                                    <button onClick={handleAboutSubmit}>
                                        <span className="material-icons">done</span>
                                    </button>
                                </>
                                :
                                <>
                                    {
                                        user.about !== "" ?
                                            <p>{user.about}</p>
                                            :
                                            <p>No description</p>
                                    }
                                </>
                        }
                        <>
                            {
                                me?._id === user._id ?
                                    <button onClick={() => setAbout(prev => ({ value: me.about, edit: !prev.edit }))}>
                                        <span className="material-icons">edit</span>
                                    </button>
                                    :
                                    <></>
                            }
                        </>
                    </div>
                </div>
                :
                <> </>
            }
            <form onSubmit={(e) => {
                e.preventDefault();
            }}>
                <input type="file" onChange={handleFileChange} required />
                <button onClick={handleProfileImgSubmit}>submit</button>
            </form>
            <ul className={Styles.nav}>
                <li className={searchParams.has("replies") === false ? Styles.nav_selected : ""}>
                    <Link to={`/users/${id}`}>Posts</Link>
                </li>
                <li className={searchParams.has("replies") === true ? Styles.nav_selected : ""}>
                    <Link to={`/users/${id}?replies=true`}>Posts & Replies</Link>
                </li>
            </ul>
            <Posts posts={posts}
                me={me!}
                token={token!}
                API_URI={API_URI!}
                setPosts={setPosts}
            />
        </div>
    );
}

export default User;
