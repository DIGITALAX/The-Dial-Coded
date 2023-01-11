import type { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req: any, res: NextApiResponse<any>) => {
  try {
    const results = await fetch(
      `https://lexica.art/api/v1/search?q=${req.body.trim()}`
    );
    console.log(results);
    const json = await results.json();
    return res.status(200).json({ json });
  } catch (err: any) {
    console.error(err.message);
    return res
      .status(500)
      .json({ error: "Couldn't fetch images, try again", success: false });
  }
});

export default handler;
