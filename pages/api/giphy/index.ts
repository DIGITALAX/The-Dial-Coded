import type { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (req: any, res: NextApiResponse<any>) => {
  try {
    const results = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${req.body}&key=${process.env.TENOR_KEY}&limit=35`
    );
    const json = await results.json()
    return res.json({json});
  } catch (err: any) {
    console.log(err.message);
  }
});

export default handler;
