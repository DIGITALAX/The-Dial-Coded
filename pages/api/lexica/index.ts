import type { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req: any, res: NextApiResponse<any>) => {
  try {
    console.log(req.body, "body");
    const results = await fetch(
      `https://lexica.art/api/v1/search?q=${req.body.trim()}`
    );
    const json = await results.json();
    return res.json({ json });
  } catch (err: any) {
    console.error(err.message);
  }
});

export default handler;
