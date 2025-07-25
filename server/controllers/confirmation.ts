import { Request, Response } from "express";

export const confirmationController = (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Invalid token");
  }

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/assets/ml-logo.svg" />
      <title>Ya casi es tuyo!</title>
      <link rel="stylesheet" href="/assets/index.css" />
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/main.js"></script>
    </body>
    </html>
  `;

  res.send(html);
};