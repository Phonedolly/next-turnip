import crocket from 'crocket';

export default async function handler(req, res) {
  const client = new crocket();

  const buildServerResponse = await new Promise((resolve, reject) => {
    client.connect({ path: '/tmp/next-turnip.sock' }, (e) => {
      // Connection errors are supplied as the first parameter to callback
      if (e) {
        reject(e);
      }
      console.log('IPC Connected');
      // Instantly a message to the server
      client.emit('/request/startBuild', {
        projectName: process.env.BLOG_NAME.toLowerCase(),
        repoUrl: process.env.REPO_URL,
        requestTime: Number(Date.now())
      });
    });

    // Expect a reply on '/response'
    client.on('/response/startBuild', function (payload) {
      resolve(payload);
      client.close();
    });
  });

  res.status(200).send(buildServerResponse);
}