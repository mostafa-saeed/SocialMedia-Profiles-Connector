const AWS = require('aws-sdk');
const QRCode = require('qrcode');

const s3 = new AWS.S3();

const regex = /^data:.+\/(.+);base64,(.*)$/;

const generateQRCode = async (url) => {
  const dataURL = await QRCode.toDataURL(url, {
    margin: 2,
    scale: 10,
  });

  const data = dataURL.match(regex)[2];
  const buffer = Buffer.from(data, 'base64');

  return buffer;
};

(async () => {
  const buffer = await generateQRCode('https://fb.com/mostafa.saeed0');
  // const buckets = await s3.listBuckets().promise();
  const result = await s3.upload({
    ACL: 'public-read',
    Bucket: `${process.env.AWS_BUCKET_NAME}/dev`,
    Key: 'file.png',
    Body: buffer,
  }).promise();
  console.log('testing', result);
})();
