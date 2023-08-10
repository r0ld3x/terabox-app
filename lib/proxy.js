
import { createClient } from "redis";

const client = createClient(); 

export default async function handler(req, res) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "API key is required" });
  }

  // Check if the API key is valid in Redis
  client.get(apiKey, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Process the request and respond
    res.json({ message: "Proxy request successful" });

    // Delete the API key after the response
    client.del(apiKey);
  });
}
