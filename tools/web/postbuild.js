const path = require('path');
const fs = require('fs');
const util = require('util');

// Promisify core APIs
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

// Define variables
let rootDirectory = '';
for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i].startsWith('--path=')) {
        rootDirectory = '../../' + process.argv[i].replace('--path=', '').trim();
        console.log("Dist Folder Path = " + rootDirectory);
    }
}

const phpConfPath = path.join(
    __dirname,
    rootDirectory,
    '.platform/nginx/conf.d/elasticbeanstalk/php.conf'
);

const nginxConfig = `
# This file is managed by Elastic Beanstalk
#
# Pass the PHP scripts to FastCGI server
#
root /var/www/html/public/website;
index index.php index.html index.htm;
# Exclude Angular files (static assets or specific routes)
location ~* \\.(?:js|css|png|jpg|jpeg|gif|ico|woff|woff2|ttf|otf|eot|svg|mp4|webm|html|json|map|pdf|txt|br)$ {
    try_files $uri =404;
}
# Serve Angular application paths directly
location /assets/ {
    try_files $uri $uri/ =404;
}
# Redirect all other requests to PHP
location / {
    rewrite ^ /index.php$is_args$args;
}
location ~ \\.(php|phar)(/.*)?$ {
    fastcgi_split_path_info ^(.+\\.(?:php|phar))(/.*)$;
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
    fastcgi_param  REDIRECT_STATUS    200;
    fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    fastcgi_param  PATH_INFO $fastcgi_path_info;
    fastcgi_pass   php-fpm;
}
`;

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

ensureDirectoriesExist(phpConfPath)
    .then(() => {
        console.log('Writing nginx configuration to php.conf...');
        return writeFile(phpConfPath, nginxConfig);
    })
    .then(() => {
        console.log('php.conf created successfully.');
    })
    .catch(err => {
        console.error('Error during post-build tasks:', err);
    });
