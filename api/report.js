import { kv } from "@vercel/kv";

export default async function handler(req, res) {

  // POST = submit report
  if (req.method === "POST") {

    const { location, disaster, description } = req.body || {};

    if (!location || !disaster || !description) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const report = {
      id: Date.now(),
      location,
      disaster,
      description,
      time: new Date().toLocaleString()
    };

    // store in Redis
    await kv.lpush("reports", JSON.stringify(report));

    return res.status(200).json({
      message: "Report submitted",
      report
    });
  }


  // GET = fetch reports
  if (req.method === "GET") {

    const reports = await kv.lrange("reports", 0, 50);

    const parsed = reports.map(r => JSON.parse(r));

    return res.status(200).json(parsed);
  }


  // method not allowed
  return res.status(405).json({
    message: "Method not allowed"
  });

}