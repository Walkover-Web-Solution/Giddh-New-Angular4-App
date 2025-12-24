const fs = require('fs');
const path = require('path');

function generateFolderStructure(dirPath, basePath = '', level = 0) {
    let html = '';
    const items = [];

    try {
        const files = fs.readdirSync(dirPath);

        // Sort files and directories
        files.forEach(file => {
            if (file === 'node_modules' || file.startsWith('.git')) return;

            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);

            items.push({
                name: file,
                path: fullPath,
                isDirectory: stat.isDirectory(),
                size: stat.isDirectory() ? null : stat.size
            });
        });

        // Sort: directories first, then files
        items.sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            return a.name.localeCompare(b.name);
        });

        items.forEach(item => {
            const indent = '  '.repeat(level);
            const relativePath = path.relative(basePath, item.path);

            if (item.isDirectory) {
                html += `${indent}<div class="folder" data-level="${level}">
${indent}  <span class="folder-toggle" onclick="toggleFolder(this)">📁</span>
${indent}  <span class="folder-name">${item.name}/</span>
${indent}  <div class="folder-content" style="display: none;">
${generateFolderStructure(item.path, basePath, level + 1)}
${indent}  </div>
${indent}</div>\n`;
            } else {
                const fileExtension = path.extname(item.name).toLowerCase();
                const fileIcon = getFileIcon(fileExtension);
                const fileSize = formatFileSize(item.size);

                html += `${indent}<div class="file" data-level="${level}">
${indent}  <span class="file-icon">${fileIcon}</span>
${indent}  <span class="file-name">${item.name}</span>
${indent}  <span class="file-size">${fileSize}</span>
${indent}</div>\n`;
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error.message);
    }

    return html;
}

function getFileIcon(extension) {
    const icons = {
        '.ts': '🔷',
        '.js': '🟨',
        '.html': '🌐',
        '.css': '🎨',
        '.scss': '🎨',
        '.json': '📋',
        '.md': '📝',
        '.yml': '⚙️',
        '.yaml': '⚙️',
        '.png': '🖼️',
        '.jpg': '🖼️',
        '.jpeg': '🖼️',
        '.gif': '🖼️',
        '.svg': '🖼️',
        '.ico': '🖼️',
        '.txt': '📄',
        '.xml': '📄',
        '.gitignore': '🚫',
        '.editorconfig': '⚙️'
    };

    return icons[extension] || '📄';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function generateHTML(projectPath) {
    const projectName = path.basename(projectPath);
    const structure = generateFolderStructure(projectPath, projectPath);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName} - Project Structure</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }

        .header p {
            opacity: 0.8;
            font-size: 1.1em;
        }

        .controls {
            padding: 20px 30px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-secondary {
            background: #6c757d;
            color: white;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .search-box {
            flex: 1;
            min-width: 300px;
            position: relative;
        }

        .search-box input {
            width: 100%;
            padding: 12px 20px;
            border: 2px solid #e9ecef;
            border-radius: 25px;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }

        .search-box input:focus {
            outline: none;
            border-color: #667eea;
        }

        .structure {
            padding: 30px;
            max-height: 70vh;
            overflow-y: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            line-height: 1.6;
        }

        .folder, .file {
            margin: 2px 0;
            padding: 5px;
            border-radius: 5px;
            transition: background-color 0.2s ease;
        }

        .folder:hover, .file:hover {
            background-color: #f8f9fa;
        }

        .folder-toggle {
            cursor: pointer;
            margin-right: 8px;
            user-select: none;
            transition: transform 0.2s ease;
        }

        .folder-toggle:hover {
            transform: scale(1.2);
        }

        .folder-name {
            font-weight: 600;
            color: #2c3e50;
            cursor: pointer;
        }

        .file-icon {
            margin-right: 8px;
        }

        .file-name {
            color: #495057;
        }

        .file-size {
            margin-left: auto;
            color: #6c757d;
            font-size: 0.9em;
            float: right;
        }

        .folder-content {
            margin-left: 20px;
            border-left: 2px solid #e9ecef;
            padding-left: 15px;
        }

        .stats {
            padding: 20px 30px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 20px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }

        .stat-label {
            color: #6c757d;
            font-size: 0.9em;
        }

        .hidden {
            display: none !important;
        }

        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 10px;
            }

            .header {
                padding: 20px;
            }

            .header h1 {
                font-size: 2em;
            }

            .controls {
                padding: 15px 20px;
                flex-direction: column;
                align-items: stretch;
            }

            .search-box {
                min-width: auto;
            }

            .structure {
                padding: 20px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📁 ${projectName}</h1>
            <p>Complete Project Structure (excluding node_modules)</p>
        </div>

        <div class="controls">
            <button class="btn btn-primary" onclick="expandAll()">📂 Expand All</button>
            <button class="btn btn-secondary" onclick="collapseAll()">📁 Collapse All</button>
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="🔍 Search files and folders..." onkeyup="searchStructure()">
            </div>
        </div>

        <div class="structure" id="structure">
${structure}
        </div>

        <div class="stats">
            <div class="stat-item">
                <div class="stat-number" id="folderCount">0</div>
                <div class="stat-label">Folders</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="fileCount">0</div>
                <div class="stat-label">Files</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="tsFileCount">0</div>
                <div class="stat-label">TypeScript Files</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="htmlFileCount">0</div>
                <div class="stat-label">HTML Files</div>
            </div>
        </div>
    </div>

    <script>
        function toggleFolder(element) {
            const content = element.parentElement.querySelector('.folder-content');
            const isVisible = content.style.display !== 'none';

            content.style.display = isVisible ? 'none' : 'block';
            element.textContent = isVisible ? '📁' : '📂';
        }

        function expandAll() {
            const folders = document.querySelectorAll('.folder-content');
            const toggles = document.querySelectorAll('.folder-toggle');

            folders.forEach(folder => folder.style.display = 'block');
            toggles.forEach(toggle => toggle.textContent = '📂');
        }

        function collapseAll() {
            const folders = document.querySelectorAll('.folder-content');
            const toggles = document.querySelectorAll('.folder-toggle');

            folders.forEach(folder => folder.style.display = 'none');
            toggles.forEach(toggle => toggle.textContent = '📁');
        }

        function searchStructure() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const folders = document.querySelectorAll('.folder');
            const files = document.querySelectorAll('.file');

            if (searchTerm === '') {
                folders.forEach(folder => folder.classList.remove('hidden'));
                files.forEach(file => file.classList.remove('hidden'));
                return;
            }

            folders.forEach(folder => {
                const folderName = folder.querySelector('.folder-name').textContent.toLowerCase();
                if (folderName.includes(searchTerm)) {
                    folder.classList.remove('hidden');
                    // Show parent folders
                    let parent = folder.parentElement;
                    while (parent && parent.classList.contains('folder-content')) {
                        parent.style.display = 'block';
                        parent.parentElement.classList.remove('hidden');
                        parent.parentElement.querySelector('.folder-toggle').textContent = '📂';
                        parent = parent.parentElement.parentElement;
                    }
                } else {
                    folder.classList.add('hidden');
                }
            });

            files.forEach(file => {
                const fileName = file.querySelector('.file-name').textContent.toLowerCase();
                if (fileName.includes(searchTerm)) {
                    file.classList.remove('hidden');
                    // Show parent folders
                    let parent = file.parentElement;
                    while (parent && parent.classList.contains('folder-content')) {
                        parent.style.display = 'block';
                        parent.parentElement.classList.remove('hidden');
                        parent.parentElement.querySelector('.folder-toggle').textContent = '📂';
                        parent = parent.parentElement.parentElement;
                    }
                } else {
                    file.classList.add('hidden');
                }
            });
        }

        function updateStats() {
            const folderCount = document.querySelectorAll('.folder').length;
            const fileCount = document.querySelectorAll('.file').length;
            const tsFileCount = document.querySelectorAll('.file .file-name').length;
            const htmlFileCount = document.querySelectorAll('.file .file-name').length;

            let tsCount = 0;
            let htmlCount = 0;

            document.querySelectorAll('.file .file-name').forEach(file => {
                const fileName = file.textContent;
                if (fileName.endsWith('.ts')) tsCount++;
                if (fileName.endsWith('.html')) htmlCount++;
            });

            document.getElementById('folderCount').textContent = folderCount;
            document.getElementById('fileCount').textContent = fileCount;
            document.getElementById('tsFileCount').textContent = tsCount;
            document.getElementById('htmlFileCount').textContent = htmlCount;
        }

        // Initialize stats on page load
        document.addEventListener('DOMContentLoaded', updateStats);
    </script>
</body>
</html>`;
}

// Generate the HTML file
const projectPath = process.argv[2] || '.';
const htmlContent = generateHTML(projectPath);

fs.writeFileSync('project-structure.html', htmlContent);
console.log('✅ Project structure HTML file generated successfully!');
console.log('📁 File saved as: project-structure.html');
console.log('🌐 Open the file in your browser to view the interactive folder structure.');
