const { utcToZonedTime, format } = require('date-fns-tz')

const postTimeAlignmentor = (eachPost) => (
  {
    title: eachPost.title,
    content: eachPost.content,
    postURL: eachPost.postURL,
    images:eachPost.images,
    thumbnailURL: eachPost.thumbnailURL || undefined,
    createdAt: format(utcToZonedTime(eachPost.createdAt), 'yyyy-MM-dd')
  })

module.exports = postTimeAlignmentor;