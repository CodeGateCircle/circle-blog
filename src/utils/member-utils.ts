import { getCollection } from "astro:content";

export async function getMemberList() {
    const allMembers = await getCollection("members", ({ data }) => {
        return import.meta.env.PROD ? data.draft !== true : true;
    })

    const sorted = allMembers.sort((a, b) => {
        const nameA = a.data.name.toLowerCase();
        const nameB = b.data.name.toLowerCase();
        return nameA < nameB ? -1 : 1;
    });

    return sorted;
}