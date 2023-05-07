const { default: axios } = require("axios");
const { saveAs } = require('file-saver');

const download = async (req, res) => {
    try {
        const response = await axios({
            url: 'https://message-api-ufwp.onrender.com/image/168345751304720220108_182401.png',
            method: 'GET',
            responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = 'download.png';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            filename = filenameMatch ? filenameMatch[1] : filename;
        }

        const blob = new Blob([response.data], { type: response.data.type });
        saveAs(blob, filename);

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
}

module.exports = download;
