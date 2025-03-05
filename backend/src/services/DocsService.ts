import fs from "fs/promises";
import path from "path";
import { marked } from "marked";

export class DocsService {
  private static async readApiSpec(): Promise<string> {
    const specPath = path.join(__dirname, "../docs/api-spec.md");
    return await fs.readFile(specPath, "utf-8");
  }

  public static async generateHtmlDocs(): Promise<string> {
    const markdown = await this.readApiSpec();
    const html = marked(markdown);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Library API Documentation</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              max-width: 1000px;
              margin: 0 auto;
              padding: 2rem;
            }
            pre {
              background: #f6f8fa;
              padding: 1rem;
              border-radius: 6px;
              overflow-x: auto;
            }
            code {
              font-family: Monaco, "Courier New", monospace;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  }
}
