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
const mkdir = util.promisify(fs.mkdir);

console.log('\nRunning post-build tasks');

// Define variables
let rootDirectiory = '';
for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--path=')) {
        rootDirectiory = '../../' + process.argv[i].replace('--path=', '').trim();
        console.log("Dist Folder Path = " + rootDirectiory);
    }
}

if (!rootDirectiory) {
    console.error('Error: Missing --path argument. Please provide the dist folder path.');
    process.exit(1);
}

const versionFilePath = path.join(__dirname, rootDirectiory, 'version.json');
const indexFilePath = path.join(__dirname, rootDirectiory, 'index.html');
const newIndexFilePath = path.join(__dirname, rootDirectiory, 'index.php');
const phpConfPath = path.join(
    __dirname,
    rootDirectiory,
    '.platform/nginx/conf.d/elasticbeanstalk/php.conf'
);

let mainHash = '';
let mainBundleFile = '';
const mainBundleRegexp = /^main.?([a-z0-9]*)?.js$/;

// PHP script to prepend to index.html
const phpScript = `<?php

/* -------------------------------------------------
 * 1. Instance metadata endpoint
 * ------------------------------------------------- */
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($requestUri === '/instance-metadata') {
    header('Content-Type: application/json');

    $cacheFile = __DIR__ . '/instance-metadata.json';
    $instanceInfo = null;

    if (file_exists($cacheFile)) {
        $instanceInfo = file_get_contents($cacheFile);
    }

    if ($instanceInfo === null) {
        $token = @file_get_contents(
            "http://169.254.169.254/latest/api/token",
            false,
            stream_context_create([
                'http' => [
                    'method'  => 'PUT',
                    'header'  => "X-aws-ec2-metadata-token-ttl-seconds: 21600",
                    'timeout' => 2
                ]
            ])
        );

        if ($token !== false) {
            $ctx = stream_context_create([
                'http' => [
                    'method'  => 'GET',
                    'header'  => "X-aws-ec2-metadata-token: $token",
                    'timeout' => 2
                ]
            ]);

            $instanceInfo = @file_get_contents(
                "http://169.254.169.254/latest/dynamic/instance-identity/document",
                false,
                $ctx
            );

            if ($instanceInfo) {
                file_put_contents($cacheFile, $instanceInfo);
            }
        }
    }

    http_response_code(200);
    echo $instanceInfo ?: '{}';
    exit;
}

/* -------------------------------------------------
 * 2. Resolve base URL (Origin header)
 * ------------------------------------------------- */
$protocol   = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
$host       = $_SERVER['HTTP_HOST'];
$requestUri = $_SERVER['REQUEST_URI'];
$fullUrl    = $protocol . "://" . $host . $requestUri;

$parsedUrl  = parse_url($fullUrl);
$baseUrl    = $parsedUrl['scheme'] . '://' . $parsedUrl['host'];

$headers = [
    "Origin: $baseUrl"
];

/* -------------------------------------------------
 * 3. Region detection (query param → cookie)
 * ------------------------------------------------- */
parse_str($parsedUrl['query'] ?? '', $queryParams);

$region = null;

/* Priority 1: Query param */
if (!empty($queryParams['region'])) {
    $region = strtolower($queryParams['region']);

    if (in_array($region, ['uk', 'gb'])) {
        setcookie(
            'region',
            $region,
            time() + (86400 * 30), // 30 days
            '/',
            '',
            false,
            true
        );
    }
}
/* Priority 2: Cookie */
if ($region === null && !empty($_COOKIE['region'])) {
    $region = strtolower($_COOKIE['region']);
}

/* -------------------------------------------------
 * 4. Select target white-label URL
 * ------------------------------------------------- */
$targetUrl = getenv("GIDDH_WHITE_LABEL_URL");

if ($region && in_array($region, ['uk', 'gb'])) {
    $targetUrl = getenv("GIDDH_GB_WHITE_LABEL_URL");
}

/* -------------------------------------------------
 * 5. Proxy request via cURL
 * ------------------------------------------------- */
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$response = curl_exec($ch);
curl_close($ch);
?>`;

// JavaScript to append to index.html
const whiteLabelScript = `
<script>
    var response = '<?php echo json_encode($response) ?>';
    if (response) {
        localStorage.setItem('whiteLabel', response.slice(1,-1));
    }
</script>`;

// Nginx configuration for php.conf
const nginxConfig = `
# This file is managed by Elastic Beanstalk, Pass the PHP scripts to FastCGI server

root /var/www/html;

index index.php index.html index.htm;

# Exclude Angular files (static assets or specific routes)
location ~* \.(?:js|css|png|jpg|jpeg|gif|ico|woff|woff2|ttf|otf|eot|svg|mp4|webm|html|json|map|pdf|txt|br)$ {
    try_files $uri =404;
}

# Serve Angular application paths directly
location /assets/ {
    try_files $uri $uri/ =404;
}

# Redirect all other requests to PHP
location / {
    try_files ^ /index.php$is_args$args;
}

location ~ \.(php|phar)(/.*)?$ {
    fastcgi_split_path_info ^(.+\.(?:php|phar))(/.*)$;
    fastcgi_intercept_errors on;
    fastcgi_index  index.php;
    fastcgi_param  QUERY_STRING       $query_string;
    fastcgi_param  REQUEST_METHOD     $request_method;
    fastcgi_param  CONTENT_TYPE       $content_type;
    fastcgi_param  CONTENT_LENGTH     $content_length;
    fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;
    fastcgi_param  REQUEST_URI        $request_uri;
    fastcgi_param  DOCUMENT_URI       $document_uri;
    fastcgi_param  DOCUMENT_ROOT      $document_root;
    fastcgi_param  SERVER_PROTOCOL    $server_protocol;
    fastcgi_param  REQUEST_SCHEME     $scheme;
    fastcgi_param  HTTPS              $https if_not_empty;
    fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
    fastcgi_param  SERVER_SOFTWARE    nginx/$nginx_version;
    fastcgi_param  REMOTE_ADDR        $remote_addr;
    fastcgi_param  REMOTE_PORT        $remote_port;
    fastcgi_param  SERVER_ADDR        $server_addr;
    fastcgi_param  SERVER_PORT        $server_port;
    fastcgi_param  SERVER_NAME        $server_name;
    # PHP only, required if PHP was built with --enable-force-cgi-redirect
    fastcgi_param  REDIRECT_STATUS    200;
    fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    fastcgi_param  PATH_INFO $fastcgi_path_info;
    fastcgi_pass   php-fpm;
}`;

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

// Ensure directories exist
const ensureDirectoriesExist = (filePath) => {
    const dirPath = path.dirname(filePath);
    return mkdir(dirPath, { recursive: true })
        .then(() => console.log(`Directories ensured for path: ${dirPath}`))
        .catch((err) => {
            if (err.code !== 'EEXIST') {
                console.error(`Error ensuring directories for ${dirPath}:`, err);
                throw err;
            }
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
        console.log('Ensuring directories for php.conf...');
        return ensureDirectoriesExist(phpConfPath); // Ensures directory exists before writing
    })
    .then(() => {
        console.log('Writing nginx configuration to php.conf...');
        return writeFile(phpConfPath, nginxConfig);
    })
    .then(() => {
        console.log('Creating .platform folder ');
        return mkdir(path.join(__dirname, rootDirectiory, '.platform', 'nginx', 'conf.d'), { recursive: true });
    })
    .then(() => {
        console.log('Post-build tasks completed successfully.');
    })
    .catch(err => {
        console.error('Error during post-build tasks:', err);
    });