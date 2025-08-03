import type { AstroIntegration } from "astro";
import { collectProfiles } from "./utils/collectProfiles";

export default function profileCollector(): AstroIntegration {
	return {
		name: "profile-collector",
		hooks: {
			"astro:build:done": async () => {
				// プロフィール収集ロジックをここに実装
				console.log("Collecting profiles...");
				await collectProfiles();
				console.log("Profiles collected successfully.");
			},
		},
	};
}
