const { google } = require('googleapis');
const path = require('path');
const stream = require('stream');

const KEYFILEPATH = path.join(__dirname + '/auth.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
});

const drive = google.drive({
    version: 'v3',
    auth: auth
});

const uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.data);

    const fileMetadata = {
        name: fileObject.name,
        parents: ['1O39u-j56U9lU1IgBQ27N99vFLCiK-P1O']
    };

    const media = {
        mimeType: fileObject.mimetype,
        body: bufferStream
    };

    try {
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webContentLink'
        });
        return { fileId: response.data.id, fileUrl: response.data.webContentLink };
    } catch (error) {
        console.error(error);
        throw new Error(`Failed to upload file: ${error.message}`);
    }
};



module.exports.g_uploadFile = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).send('No files were uploaded.');
        }

        const file = req.files.send_file;
        const fileId = await uploadFile(file);

        return res.status(200).json({
            message: `File uploaded successfully`,
            ...fileId
        });
    } catch (error) {
        return res.status(500).send(`Failed to upload file: ${error.message}`);
    }
}