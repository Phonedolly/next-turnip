import probe from "probe-image-size";

export default async function handler(req, res) {
  res.status(200).send({
    properties: await probe(req.body.imageLocation)
  })
}