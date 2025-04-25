import fs from 'fs'
import { Request } from 'express'
import { File } from 'formidable'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_IMAGE_TEMP_DIR)) {
    // Neu chua co duong dan thi tao duong dan
    fs.mkdirSync(UPLOAD_IMAGE_TEMP_DIR, {
      recursive: true // muc dich la de tao folder nested
    })
    fs.mkdirSync(UPLOAD_VIDEO_DIR, {
      recursive: true // muc dich la de tao folder nested
    })
  }
}

//Upload cấu hình khi upload file lưu vào  /uploads/temp
export const handleUploadImage = async (req: Request) => {
  //Bi loi old(m,file) them dong so chỉnh sửa như dòng 20
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR, // duong dan luu file
    maxFiles: 4, // chi cho upload 4 file
    keepExtensions: true, // dinh dang file
    maxFileSize: 300 * 1024, // 300kb
    maxTotalFileSize: 300 * 1024 * 4, // Kích thước tối đa
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image_url' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is Empty'))
      }
      resolve(files.image as File[])
    })
  })
}

export const getNameFromFullname = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}

export const getExtension = (fullname: string) => {
  const namearr = fullname.split('.')
  return namearr[namearr.length - 1]
}
