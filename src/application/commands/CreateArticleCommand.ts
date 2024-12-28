export class CreateArticleCommand {
  constructor(
    public readonly title: string,
    public readonly content: string,
    public readonly userId: number,
  ) {}
}
