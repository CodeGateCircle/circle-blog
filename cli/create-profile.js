// create-profile.js
import { createHash } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { input, select } from "@inquirer/prompts";
import { defaultSnsIcons } from "../src/constants/icon.js";

/*
Purpose: ask for profile name and create a new profile file

(file path: src/content/members/profile-name.md)
In the file, there is frontmatter and content.
Frontmatter:
- id: profile id
- name: profile name
- avatar: profile avatar image url
- introduce: profile introduce
- links: profile links
*/

async function inputSns() {
	const sns = [];

	// for (const sns of defaultSnsIcons) {
	//     const answer_sns = await input({
	//         message: `What is the ${sns.name} of your profile?`,
	//     })
	//     if (answer_sns) {
	//         sns.push({
	//             name: sns.name,
	//             url: answer_sns,
	//         })
	//     }
	// }
	let sns_choices = defaultSnsIcons.map((sns) => ({
		name: sns.name,
		value: sns.name,
	}));
	sns_choices.push({
		name: "No more",
		value: "N",
	});

	let wantMore = "";
	while (wantMore !== "N") {
		wantMore = await select({
			message: "Do you want to add more SNS?",
			choices: sns_choices,
		});
		if (wantMore !== "N") {
			const answer_sns = await input({
				message: `What is the ${wantMore} of your profile? (input Full URL)`,
			});
			sns.push({
				name: wantMore,
				url: answer_sns,
			});
			// delete selected sns from sns_choices
			sns_choices = sns_choices.filter((sns) => sns.value !== wantMore);
		}
	}
	return sns;
}

async function inputProfiles() {
	const profiles = {
		id: "",
		name: "",
		avatar: "",
		introduce: "",
		links: [],
	};
	const answer_name = await input({
		message: "What is the name of your profile?",
	});
	profiles.name = answer_name;

	profiles.id = createHash("sha256").update(profiles.name).digest("hex");

	const answer_introduce = await input({
		message: "What is the introduce of your profile with one line?",
	});
	profiles.introduce = answer_introduce;

	profiles.links = await inputSns();

	return profiles;
}

function formatFrontmatter(profiles) {
	const lines = [
		"---",
		`name: ${profiles.name}`,
		`avatar: '/sample.png'`,
		`participated: ${new Date().toISOString().split("T")[0]}`,
		`introduce: ${profiles.introduce}`,
		"draft: false",
		"links:",
		"  [",
		...profiles.links.map(
			(link) => `    {
        name: ${link.name},
        url: ${link.url}
    }`,
		),
		"  ]",
		"---",
		"",
	];

	return lines.join("\n");
}

async function createProfile() {
	const profiles = await inputProfiles();

	const filePath = join("src", "content", "members", `${profiles.name}.md`);
	const content = formatFrontmatter(profiles);

	if (existsSync(filePath)) {
		console.log(`${filePath} already exists`);
	} else {
		writeFileSync(filePath, content);
		console.log(`${filePath} created`);
	}
}

createProfile();
