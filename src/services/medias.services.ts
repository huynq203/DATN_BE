import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { MediaType } from '~/constants/enums'
import { getNameFromFullname, handleUploadImage } from '~/utils/file'
import { uploadFiletos3 } from '~/utils/s3'
import mime from 'mime'
import fsPromises from 'fs/promises'
interface Media {
  url: string
  type: MediaType
}
class MediasSerive {
  async uploadImage(req: Request) {
    //file tu uploads/tmp
    const files = await handleUploadImage(req)
    // return files
    //dùng Promise để hình ảnh cùng thực hiện chứ k phải đợi từng cái thực hiện
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newFullFilename = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFilename)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const resultS3 = await uploadFiletos3({
          filename: 'images/' + newFullFilename,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })
        await Promise.all([fsPromises.unlink(file.filepath), fsPromises.unlink(newPath)]) // Sau khi upload anh thi se xoa anh /uploads/tmp
        return {
          url: resultS3.Location as string,
          type: MediaType.Image
        }
      })
    )
    return result
  }
}
const mediasService = new MediasSerive()
export default mediasService
