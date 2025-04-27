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
    maxFiles: 10, // chi cho upload 4 file
    keepExtensions: true, // dinh dang file
    maxFileSize: 3000 * 1024, // 300kb
    maxTotalFileSize: 3000 * 1024 * 4, // Kích thước tối đa
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'url_images' && Boolean(mimetype?.includes('image/'))
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
      if (!Boolean(files.url_images)) {
        return reject(new Error('File is Empty'))
      }
      resolve(files.url_images as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  //Bi loi old(m,file) them dong so chỉnh sửa như dòng 20
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_VIDEO_DIR, // duong dan luu file
    maxFiles: 1, // chi cho upload 4 file
    maxFileSize: 50 * 1024 * 1024, // 50MB
    filter: function ({ name, originalFilename, mimetype }) {
      // check dạng
      const valid = (name === 'video' && Boolean(mimetype?.includes('mp4'))) || Boolean(mimetype?.includes('quicktime'))
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
      if (!Boolean(files.video)) {
        return reject(new Error('File is Empty'))
      }
      const video = files.video as File[]
      video.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
        video.filepath = video.filepath + '.' + ext
      })

      resolve(files.video as File[])
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
