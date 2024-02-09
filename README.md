# Public Docs

This project is a prototype for a simple application that downloads a folder of [MkDocs](https://www.mkdocs.org/) markdown files from Google Drive and builds them. This can be used in combination with Netlify or another hosting provider to expose a Google Drive folder as a public static site.

## Configuration

The docs build requires two environment variables to be set:
- `GOOGLE_DRIVE_FOLDER_ID` - The ID of the Google Drive folder.
- `GOOGLE_CREDENTIALS` - The Google service account credentials. You can find/create a service account in Google Cloud Platform under IAM & Admin -> Service Accounts. Once you have a service account, you can use it to create a JSON key file, and pass that to the download script.
- `INCLUDE_NETLIFY_IDENTITY` - If `true`, includes [Netlify Identify](https://docs.netlify.com/security/secure-access-to-sites/identity/) in the build.
