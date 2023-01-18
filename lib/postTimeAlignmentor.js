const { utcToZonedTime, format } = require('date-fns-tz')

const postTimeAlignmentor = (eachPost) => (
  {
    title: eachPost.title,
    thumbnailURL: eachPost.thumbnailURL || undefined,
    postURL: eachPost.postURL,
    postDate: format(utcToZonedTime(eachPost.createdAt), 'yyyy-MM-dd')
  })

module.exports = postTimeAlignmentor;