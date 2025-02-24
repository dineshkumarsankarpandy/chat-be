import { Controller, Get, Post, Query, Res, Body } from "@nestjs/common";
import { GithubService } from "./github.service";
import { Response } from "express";

@Controller("github")
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get("callback")
  async handleCallback(@Query("code") code: string, @Res() res: Response) {
    const token = await this.githubService.exchangeCodeForToken(code);
    res.redirect(`http://localhost:3001/preview?token=${token}`); // Adjust to your frontend route
  }

  @Post("push")
  async pushToGitHub(
    @Body() body: { token: string; files: Record<string, string>; repoName: string }
  ) {
    const { token, files, repoName } = body;
    return this.githubService.pushToGitHub(token, files, repoName);
  }
}