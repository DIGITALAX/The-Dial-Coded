import { NextApiResponse } from "next";
import nextConnect from "next-connect";
const bodyParser = require("body-parser");

const handler = nextConnect();

handler.post(async (req: any, res: NextApiResponse<any>) => {
  try {
    const results = await fetch(
      `http://127.0.0.1:7860/${JSON.parse(req.body).model}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.parse(req.body).input),
      }
    );
    const json = await results.json();
    return res.json({ json });
  } catch (err: any) {
    console.error(err.message);
  }
});

export default handler;
