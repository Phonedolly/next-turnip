import crocket from "crocket";

import isLoggedIn from "@/lib/isLoggedIn";

export default async function handler(req, res) {
  /* Check Login */
  const checkLogin = await isLoggedIn(req)
    .catch((e) => {
      console.error(e)
      return false
    })
  if (checkLogin === false) {
    return res.status(500).send({ isLoggedIn: false })
  }

  const client = new crocket();

  const buildStatus = await new Promise((resolve, reject) => {
    client.connect({ path: "/tmp/next-turnip.sock" }, (err) => {
      // Connection errors are supplied as the first parameter to callback
      if (err) {
        reject(err);
      }
      console.log("IPC Connected");
      // Instantly a message to the server
      client.emit("/request/getBuildStatus", { projectName: process.env.BLOG_NAME.toLowerCase() });
    });

    client.on('/response/getBuildStatus', (payload) => {
      client.close();
      resolve(payload);
    })
  });

  res.status(200).send(buildStatus);
}