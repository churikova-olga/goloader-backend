import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
// Разрешить только sgf
export const imageFileFilter = (req, file, callback) => {
  file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')

  if (!file.originalname.match(/\.(sgf)$/)) {
    return callback(
      new HttpException(
        'Only sgf files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};
export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 10).toString(10))
    .join('');
  callback(null, `${name}${randomName}${fileExtName}`);
};