const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const ghPages = require('gh-pages');
const shortcuts = require('./shortcuts.json');

const sourceDirPath = path.dirname(__filename);
const projectDirPath = path.resolve(sourceDirPath, '../');
const buildDirPath = path.resolve(projectDirPath, './build');

// Create build directory
if (fs.existsSync(buildDirPath)) {
    fs.rmdirSync(buildDirPath, {
        recursive: true
    });
}
fs.mkdirSync(buildDirPath);

// Retrieve and generate each new path
const templateFilePath = path.resolve(sourceDirPath, './template.ejs');
const templateFileContents = fs.readFileSync(templateFilePath, 'utf8');
shortcuts.forEach((shortcut) => {
    const shortenerPath = shortcut.path;
    const url = shortcut.url;
    const processedPage = ejs.render(templateFileContents, {
        url: url
    });

    const newDirPath = path.resolve(buildDirPath, `./${shortenerPath}`);
    const newPathFile = path.resolve(newDirPath, './index.html');
    fs.mkdirSync(newDirPath);
    fs.writeFileSync(newPathFile, processedPage);
});

const cnamePath = path.resolve(buildDirPath, './CNAME');
fs.writeFileSync(cnamePath, "hci.nu");

// Publish to Github pages
ghPages.publish(buildDirPath);
