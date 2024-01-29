const fs = require('fs');
const { downloadFolder } = require("./google-drive");

const BUILD_FOLDER = "./files";

if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
  console.error('Google Drive folder ID must be specified as an environment variable.');
  process.exit(1);
}

try {
  if (!fs.existsSync(BUILD_FOLDER)) {
    fs.mkdirSync(BUILD_FOLDER);
  }

  downloadFolder(process.env.GOOGLE_DRIVE_FOLDER_ID, BUILD_FOLDER);

  console.log('All files downloaded successfully.');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
