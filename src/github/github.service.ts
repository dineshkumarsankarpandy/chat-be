import { Injectable } from "@nestjs/common";
import { Octokit } from "@octokit/rest";
import axios from "axios";

@Injectable()
export class GithubService {
  async exchangeCodeForToken(code: string): Promise<string> {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );
    return response.data.access_token;
  }

  async pushToGitHub(
    token: string,
    files: Record<string, string>,
    repoName: string
  ): Promise<{ url: string }> {
    const octokit = new Octokit({ auth: token });

    const repoResponse = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: "your project is intialized successfully.",
      auto_init: false,
    });
    const owner = repoResponse.data.owner.login;
    const repo = repoResponse.data.name;

    for (const [filePath, content] of Object.entries(files)) {
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath.slice(1), // Remove leading "/" from Sandpack paths
        message: `Add ${filePath}`,
        content: Buffer.from(content).toString("base64"),
      });
    }

    return { url: `https://github.com/${owner}/${repo}` };
  }
}