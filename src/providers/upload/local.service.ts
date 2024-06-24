import {Injectable} from "@nestjs/common";
import * as fs from 'fs';
import _ from 'lodash';
import { Multer } from "multer";
import {v4 as uuid} from "uuid";

import { UPLOAD_FOLDER, UPLOAD_PATH } from "src/shared/constants";

@Injectable()
export class UploadLocalService {
  getPath(dir: UPLOAD_PATH, filename: string): string {
    return `${UPLOAD_FOLDER}/${dir}/${filename}`;
  }

  async putFile(file: Express.Multer.File, dir: UPLOAD_PATH, customId = null): Promise<any> {
    if (_.isEmpty(dir)) {
      throw new Error('Directory not found');
    }
    return new Promise((resolve, reject) => {
      const fileExtension = file.originalname.split('.').pop();
      if (!fileExtension) {
        reject('File extension not found');
      }
      if (_.isEmpty(customId)) {
        customId = uuid();
      }
      const folder = `${process.cwd()}/${UPLOAD_FOLDER}/${dir}`;
      const fileName = `${customId}_${uuid()}_${Date.now()}.${fileExtension}`;
      const filePath = `${process.cwd()}/${UPLOAD_FOLDER}/${dir}/${fileName}`;
      console.log(filePath);

      fs.mkdir(folder, { recursive: true}, function (err) {
        if (err) {
          console.log('fs.mkdir err', err);
          reject(err);
        }

        fs.writeFile(
          filePath,
          file.buffer,
          (err) => {
            if (err) {
              console.log('fs.writeFile err', err);
              reject(err);
            }
          });
      });

      resolve({
        path: `${this.getPath(dir, fileName)}`,
      });
    })
  }

  async deleteFile(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err);
          }
          resolve(true);
        });
      } else {
        resolve(true);
      }

    });
  }
}