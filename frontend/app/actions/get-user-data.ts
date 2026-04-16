import { currentUser } from "@clerk/nextjs/server";

export default async function userData() {
    const user = await currentUser();

    return user;
}