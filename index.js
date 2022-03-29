const core = require("@actions/core");
const github = require("@actions/github");
const recursive = require("recursive-readdir");

async function run() {
	try {
		// const allFiles = core.getInput("allFiles");

		// console.log(allFiles);

		const github_token = core.getInput("GITHUB_TOKEN");
		// const github_token = "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";
		const context = github.context;
		console.log("hehe v1.2.5");
		console.log("context", context);
		// if (context.payload.pull_request == null) {
		// 	core.setFailed("No pull request found.");
		// 	return;
		// }
		const pull_request_number = context.payload.pull_request.number;

		const octokit = github.getOctokit(github_token);

		const { data: pullRequest } = await octokit.rest.pulls.listFiles({
			...context.repo,
			pull_number: pull_request_number,
			mediaType: {
				format: "diff",
			},
		});

		console.log(
			"DIFF FILES",
			pullRequest.map((pr) => pr.filename)
		);
		// const new_comment = octokit.issues.createComment({
		// 	...context.repo,
		// 	issue_number: pull_request_number,
		// 	body: message,
		// });
		pullRequest.foreach((pr) => {
			recursive(pr.filename, function (err, files) {
				// `files` is an array of file paths
				console.log("HEHE READING FILE", files);
			});
		});
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
