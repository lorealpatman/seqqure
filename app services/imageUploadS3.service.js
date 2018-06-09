const AWS = require("aws-sdk");
const s3 = new AWS.S3();

// const base64Data = new Buffer(
//   base64.replace(/^data:image\/\w+;base64,/, ""),
//   "base64"
// );

// Getting the file type, ie: jpeg, png or gif
// const type = base64.split(";")[0].split("/")[1];
function signedUrl(filename, filetype, callBack) {
  const params = {
    Bucket: process.env.S3_PUBLIC,
    Key: filename,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: filetype
  };
  s3.getSignedUrl("putObject", params, callBack);
  console.log("Image successfully uploaded.", data);
}

// see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property

function getObject(filename, callBack) {
  const params = {
    Bucket: process.env.S3_PUBLIC,
    Key: filename
  };

  s3.getSignedUrl("getObject", params, callBack);
  console.log(data);
}

module.exports = {
  signedUrl: signedUrl,
  getObject: getObject
};
