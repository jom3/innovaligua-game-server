
export const fileNamer = ( req: Express.Request, file: Express.Multer.File, callback: any ) => {
    if ( !file ) return callback( new Error('Empty file'), false );

    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${ file.originalname.split('.')[0] }.${ fileExtension }`;

    callback(null, fileName );

}