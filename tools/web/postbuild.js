const path = require('path');
const fs = require('fs');
const util = require('util');

// get application version from package.json
const appVersion = require('../../package.json').version;

// promisify core API's
const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

console.log('\nRunning post-build tasks');

// our version.json will be in the dist folder
let rootDirectiory = '';
for (var i = 0; i < process.argv.length; i++) {
    console.log(process.argv[i]);
    if (process.argv[i].startsWith('--path=')) {

        rootDirectiory = '../../' + process.argv[i].replace('--path=', '').replace(' ', '');
        console.log("Dist Folder Path = " + rootDirectiory);
    }
}

const versionFilePath = path.join(__dirname, rootDirectiory, 'version.json');
const indexFilePath = path.join(__dirname, rootDirectiory, 'index.html');
const newIndexFilePath = path.join(__dirname, rootDirectiory, 'index.php');

// Add PHP script to be inserted at the beginning
const phpScript = `<?php
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    $requestUri = $_SERVER['REQUEST_URI'];
    $fullUrl = $protocol . "://" . $host . $requestUri;
    $parsedUrl = parse_url($fullUrl);
    $baseUrl = $parsedUrl['scheme'] . '://' . $parsedUrl['host'];

    // setting fetched baseUrl in Origin Header
    $headers = [
        "Origin: $baseUrl"
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_URL, getenv("GIDDH_WHITE_LABEL_URL"));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
?>
`;

let mainHash = '';
let mainBundleFile = '';

// RegExp to find main.bundle.js, even if it doesn't include a hash in it's name (dev build)
let mainBundleRegexp = /^main.?([a-z0-9]*)?.js$/;

// read the dist folder files and find the one we're looking for
readDir(path.join(__dirname, rootDirectiory))
    .then(files => {
        mainBundleFile = files.find(f => mainBundleRegexp.test(f));
        if (mainBundleFile) {
            let matchHash = mainBundleFile.match(mainBundleRegexp);

            // if it has a hash in it's name, mark it down
            if (matchHash.length > 1 && !!matchHash[1]) {
                mainHash = matchHash[1];
            }
        }

        console.log(`Writing version and hash to ${versionFilePath}`);
        console.log(`Index ${indexFilePath}`);

        // write current version and hash into the version.json file
        const src = `{"version": "${appVersion}", "hash": "${mainHash}"}`;
        return writeFile(versionFilePath, src);
    }).then(() => {
        // main bundle file not found, dev build?
        if (!mainBundleFile) {
            return;
        }

        console.log(`Replacing hash in the ${mainBundleFile}`);

        // replace hash placeholder in our main.js file so the code knows it's current hash
        const mainFilepath = path.join(__dirname, rootDirectiory, mainBundleFile);
        return readFile(mainFilepath, 'utf8')
            .then(mainFileData => {
                const replacedFile = mainFileData.replace('{{POST_BUILD_ENTERS_HASH_HERE}}', mainHash);
                return writeFile(mainFilepath, replacedFile);
            });
    }).then(() => {
        // Read index.html and convert to PHP
        console.log('Converting index.html to index.php...');
        return readFile(indexFilePath, 'utf8')
            .then(indexContent => {
                // Combine PHP script with existing HTML content
                const newContent = phpScript + indexContent;

                // Write the new index.php file
                return writeFile(newIndexFilePath, newContent)
                    .then(() => {
                        console.log('Successfully created index.php');
                        // Delete the original index.html
                        return new Promise((resolve, reject) => {
                            fs.unlink(indexFilePath, (err) => {
                                if (err) {
                                    console.log('Error deleting index.html:', err);
                                  reject(err);
                                } else {
                                    console.log('Successfully deleted index.html');
                                    resolve();
                                }
                            });
                        });
                    });
            });
    }).catch(err => {
        console.log('Error with post build:', err);
    });
