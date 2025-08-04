import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

interface SnsData {
	name: string;
	url: string;
}

interface ProfileData {
	name: string;
	avatar: string;
	introduce: string;
	url: string;
	links: SnsData[] | null;
}

export async function collectProfiles() {
	// read dir: src/content/members
	const membersDir = join("src", "content", "members");

	const files = readdirSync(membersDir).filter((file) => file.endsWith(".md"));

	const profiles: ProfileData[] = [];

	for (const file of files) {
		const filePath = join(membersDir, file);
		const content = readFileSync(filePath, "utf-8");

		const frontmatter = matter(content);
		const { name, avatar, introduce, links } = frontmatter.data;

		const url = `/members/${encodeURIComponent(name.toLowerCase().trim())}/`;

		profiles.push({
			name,
			avatar: avatar || "",
			introduce,
			url,
			links: links || [],
		});
	}

	// output: src/profiles.json
	const outputPath = join("src", "profiles.json");
	writeFileSync(outputPath, JSON.stringify(profiles, null, 2));
}
