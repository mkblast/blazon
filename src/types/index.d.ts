export type User = {
    _id: string,
    name: string,
    username: string,
    date: string,
}

export type Post = {
    _id: string,
    body: string,
    author: User,
    likes: string[],
    reply_to: string | null,
    date: string,
}

export type InputError = {
    path: string | undefined,
    msg: string,
}
