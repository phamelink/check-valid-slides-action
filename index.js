const core = require("@actions/core");
const github = require("@actions/github");
const recursive = require("recursive-readdir");

async function run() {
	try {
		// recursive(
		// 	"./contributions/presentation",
		// 	["!*.pdf", "!*.md"],
		// 	function (err, files) {
		// 		// `files` is an array of file paths
		// 		console.log(files);
		// 	}
		// );

		// const allFiles = core.getInput("allFiles");

		// console.log(allFiles);

		// const github_token = core.getInput("GITHUB_TOKEN");

		const context = github.context;
		console.log("hehe v1.2.5");
		console.log(context);
		// if (context.payload.pull_request == null) {
		// 	core.setFailed("No pull request found.");
		// 	return;
		// }
		// const pull_request_number = context.payload.pull_request.number;

		// const octokit = new github.GitHub(github_token);
		// const new_comment = octokit.issues.createComment({
		// 	...context.repo,
		// 	issue_number: pull_request_number,
		// 	body: message,
		// });
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
