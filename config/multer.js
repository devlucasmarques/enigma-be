const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

const MAX_SIZE_TWO_MEGABYTES = 2 * 1024 * 1024;

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', 'tmp', 'uploads'));
    },
    filename: (req, file, cb) => cb(null, file.originalname)
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: (req, file, cb) =>
      cb(
        null,
        file.mimetype === 'application/octet-stream'
          ? process.env.BUCKET_FILE_NAME
          : process.env.BUCKET_NAME
      ),
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => cb(null, file.originalname)
  })
};

module.exports = {
  dest: path.resolve(__dirname, '..', 'tmp', 'uploads'),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: MAX_SIZE_TWO_MEGABYTES
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
      'application/octet-stream'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. ${file.mimetype}`));
    }
  }
};
