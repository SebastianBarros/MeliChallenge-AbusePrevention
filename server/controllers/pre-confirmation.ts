import { Request, Response } from "express";
import { validateCaptcha } from "../services/validateCaptcha";

const mockUserData = {
  name: "Juan Pérez",
  address: "Av. Siempreviva 123, Buenos Aires",
  country: "Argentina",
};

export const preConfirmationController = (req: Request, res: Response) => {
  const { referrer, token } = req.query;

  if (!token) {
    return res.status(400).send("Invalid token");
  }

  // validate token

  /** This is not the proper nor most secure way to pass props, but for a POC will do */
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/svg+xml" href="/assets/ml-logo.svg" />
      <title>Revisá tus datos</title>
      <script>
        window.__CONTACT_DATA__ = ${JSON.stringify({
          user: mockUserData,
          referrer,
          token,
        })};
      </script>
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

type SubmitBody = {
  referrer: string;
  token: string;
  captcha: string;
  contactData: {
    name: string;
    address: string;
    country: string;
  };
};

export const submitPreConfirmationController = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, SubmitBody>,
  res: Response
) => {
  const { referrer, token, contactData, captcha } = req.body;
  if (!referrer || !token || !contactData || !captcha) {
    return res.status(400).json({ error: "invalid data" });
  }

  // validate token

  const isValidCaptcha = await validateCaptcha(captcha);

  if (!isValidCaptcha) {
    return res.status(400).json({ error: "invalid data" });
  }

  // update contact data if needed. It can be done async so we don't block our curstomer purchase

  const redirectTo = `/confirmation?referrer=${encodeURIComponent(
    referrer
  )}&token=${encodeURIComponent(token)}`;
  return res.status(200).json({ redirectTo });
};
