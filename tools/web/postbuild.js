const path = require('path');
const fs = require('fs');
const util = require('util');

// Get application version from package.json
const appVersion = require('../../package.json').version;

// Promisify core API's
const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const renameFile = util.promisify(fs.rename);

console.log('\nRunning post-build tasks');

// Define variables
let rootDirectiory = '';
for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--path=')) {
        rootDirectiory = '../../' + process.argv[i].replace('--path=', '').trim();
        console.log("Dist Folder Path = " + rootDirectiory);
    }
}

const versionFilePath = path.join(__dirname, rootDirectiory, 'version.json');
const indexFilePath = path.join(__dirname, rootDirectiory, 'index.html');
const newIndexFilePath = path.join(__dirname, rootDirectiory, 'index.php');

let mainHash = '';
let mainBundleFile = '';
const mainBundleRegexp = /^main.?([a-z0-9]*)?.js$/;

// PHP script to prepend to index.html
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

// JavaScript to append to index.html
const whiteLabelScript = `
<script>
    var response = '<?php echo json_encode($response) ?>';
    if (response) {
        localStorage.setItem('whiteLabel', response.slice(1,-1));
    }
</script>
`;

// Function to append script to index.html
const appendScriptToIndex = (indexPath, phpScriptContent, jsScriptContent) => {
    return readFile(indexPath, 'utf8')
        .then((indexContent) => {
            // Prepend the PHP script and append the JS script just before the closing </body> tag
            const updatedContent = indexContent.replace('</body>', `${jsScriptContent}\n</body>`);
            const finalContent = `${phpScriptContent}\n${updatedContent}`;
            return writeFile(indexPath, finalContent);
        })
        .then(() => {
            console.log('Successfully appended PHP and JS scripts to index.html');
        });
};

// Read the dist folder and perform operations
readDir(path.join(__dirname, rootDirectiory))
    .then(files => {
        mainBundleFile = files.find(f => mainBundleRegexp.test(f));
        if (mainBundleFile) {
            const matchHash = mainBundleFile.match(mainBundleRegexp);
            if (matchHash.length > 1 && !!matchHash[1]) {
                mainHash = matchHash[1];
            }
        }

        console.log(`Writing version and hash to ${versionFilePath}`);
        const versionContent = `{"version": "${appVersion}", "hash": "${mainHash}"}`;
        return writeFile(versionFilePath, versionContent);
    })
    .then(() => {
        if (!mainBundleFile) {
            console.warn('Main bundle file not found, skipping hash replacement.');
            return;
        }

        console.log(`Replacing hash in the ${mainBundleFile}`);
        const mainFilePath = path.join(__dirname, rootDirectiory, mainBundleFile);
        return readFile(mainFilePath, 'utf8')
            .then(mainFileData => {
                const replacedContent = mainFileData.replace('{{POST_BUILD_ENTERS_HASH_HERE}}', mainHash);
                return writeFile(mainFilePath, replacedContent);
            });
    })
    .then(() => {
        console.log('Appending PHP and JS scripts to index.html...');
        return appendScriptToIndex(indexFilePath, phpScript, whiteLabelScript);
    })
    .then(() => {
        console.log('Renaming index.html to index.php...');
        return renameFile(indexFilePath, newIndexFilePath);
    })
    .then(() => {
        console.log('Successfully renamed index.html to index.php');
    })
    .catch(err => {
        console.error('Error during post-build tasks:', err);
    });
