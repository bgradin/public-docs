const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

if (!process.env.GOOGLE_CREDENTIALS) {
  console.error('Google credentials must be specified as an environment variable.');
  process.exit(1);
}

const googleCredentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
if (!googleCredentials.client_email || !googleCredentials.private_key) {
  console.error('Invalid Google credentials provided');
  process.exit(1);
}

const drive = google.drive('v3');

const auth = new google.auth.GoogleAuth({
  credentials: googleCredentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

async function listFiles(folderId) {
  const response = await drive.files.list({
    auth,
    q: `'${folderId}' in parents`,
  });
  return response.data.files;
}

async function downloadFile(file, folderPath) {
  return new Promise((resolve, reject) => {
    const dest = fs.createWriteStream(`${folderPath}/${file.name}`);
    drive.files.get(
      { fileId: file.id, alt: 'media' },
      { responseType: 'stream', auth }
    ).then(response => {
      response.data
        .on('end', () => {
          console.log(`File ${file.name} downloaded.`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`Error downloading file ${file.name}: ${err.message}`);
          reject();
        })
        .pipe(dest);
    });
  });
}

async function downloadFolder(folderId, outputPath) {
  const files = await listFiles(folderId);

  for (const file of files) {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      const subFolderPath = path.join(outputPath, file.name);
      if (!fs.existsSync(subFolderPath)) {
        fs.mkdirSync(subFolderPath);
      }
      await downloadFolder(file.id, subFolderPath);
    } else {
      await downloadFile(file, outputPath);
    }
  }
}

module.exports = {
  listFiles,
  downloadFile,
  downloadFolder,
};
