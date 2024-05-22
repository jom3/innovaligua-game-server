import { HttpException, HttpStatus } from "@nestjs/common";
import { extname } from "path";

// eslint-disable-next-line @typescript-eslint/ban-types
export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function) => {

  if ( !file ) return callback( new Error('Empty file'), false );

    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        callback(null, true);
    } else {
        callback(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
}