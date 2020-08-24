/*
 * Copyright 2020 Northwestern Inclusive Technology Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const ncp = require('ncp').ncp;
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
    fs.mkdirSync(newDirPath, { recursive: true });
    fs.writeFileSync(newPathFile, processedPage);
});

const cnamePath = path.resolve(buildDirPath, './CNAME');
fs.writeFileSync(cnamePath, "hci.nu");

ncp("papers", "./build/papers", function (err) {
    if (err) {
      return console.error(err);
    }
});

ncp("src/index.html", "./build/index.html", function (err) {
    if (err) {
      return console.error(err);
    }
});
