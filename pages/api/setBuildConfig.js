import crocket from "crocket";

import isLoggedIn from "@/lib/isLoggedIn";

export default async function getPm2Config(req, res) {
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

  const setBuildConfigResponse = await new Promise((resolve, reject) => {
    client.connect({ path: "/tmp/next-turnip.sock" }, (err) => {
      // Connection errors are supplied as the first parameter to callback
      if (err) {
        reject(err);
      }
      console.log("IPC Connected");
      // Instantly a message to the server
      client.emit("/request/setBuildConfig", {
        projectName: process.env.BLOG_NAME,
        newPm2Config: req.body.newPm2Config,
        newDotEnv: req.body.newDotEnv
      });
    });

    client.on('/response/setBuildConfig', (payload) => {
      client.close();
      resolve(payload);
    })
  });

  res.status(200).send(setBuildConfigResponse);
}