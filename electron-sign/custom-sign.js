/**
 * Custom signing script for electron-builder
 * Integrates with SSL.com eSigner for code signing during build
 * 
 * This script is called by electron-builder for EVERY executable that needs signing:
 * - Main app executable (Giddh.exe in win-unpacked)
 * - Installer executable (Giddh Setup.exe)
 * - Update packages
 * 
 * Environment variables required:
 * - ES_USERNAME: SSL.com eSigner username
 * - ES_PASSWORD: SSL.com eSigner password
 * - ES_CREDENTIAL_ID: SSL.com credential ID
 * - ES_TOTP_SECRET: SSL.com TOTP secret for 2FA
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Signs a Windows executable using SSL.com eSigner
 * 
 * @param {Object} configuration - Signing configuration from electron-builder
 * @returns {Promise<void>}
 */
exports.default = async function(configuration) {
    const filePath = configuration.path;
    
    console.log('\n========================================');
    console.log('🔐 CUSTOM SIGNING SCRIPT');
    console.log('========================================');
    console.log(`File to sign: ${filePath}`);
    console.log(`File exists: ${fs.existsSync(filePath)}`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    
    // Check required environment variables
    const requiredEnvVars = ['ES_USERNAME', 'ES_PASSWORD', 'ES_CREDENTIAL_ID', 'ES_TOTP_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.log('⚠️  WARNING: Missing environment variables for signing:');
        console.log(`   ${missingVars.join(', ')}`);
        console.log('   Skipping code signing (development mode)');
        console.log('========================================\n');
        return;
    }
    
    console.log('✅ All required environment variables present');
    console.log('🔄 Starting SSL.com eSigner signing process...');
    
    try {
        // Create a temporary output directory
        const outputDir = path.join(path.dirname(filePath), 'signed-temp');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const outputPath = path.join(outputDir, path.basename(filePath));
        
        // Use SSL.com CodeSignTool for signing
        // This is the same tool used by the GitHub Action
        const signCommand = `npx @ssl.com/codesigntool sign \
            -username="${process.env.ES_USERNAME}" \
            -password="${process.env.ES_PASSWORD}" \
            -credential_id="${process.env.ES_CREDENTIAL_ID}" \
            -totp_secret="${process.env.ES_TOTP_SECRET}" \
            -input_file_path="${filePath}" \
            -output_dir_path="${outputDir}" \
            -malware_block=false \
            -environment_name=PROD \
            -override=true`;
        
        console.log('📝 Executing signing command...');
        
        // Execute signing command
        execSync(signCommand, {
            stdio: 'inherit',
            maxBuffer: 10 * 1024 * 1024 // 10MB buffer
        });
        
        // Verify signed file was created
        if (!fs.existsSync(outputPath)) {
            throw new Error(`Signed file not created at: ${outputPath}`);
        }
        
        console.log('✅ File signed successfully');
        console.log(`   Output: ${outputPath}`);
        
        // Replace original file with signed version
        fs.copyFileSync(outputPath, filePath);
        console.log('✅ Replaced original file with signed version');
        
        // Clean up temporary directory
        fs.rmSync(outputDir, { recursive: true, force: true });
        console.log('✅ Cleaned up temporary files');
        
        // Verify signature
        console.log('🔍 Verifying signature...');
        try {
            const verifyCommand = `powershell -Command "Get-AuthenticodeSignature '${filePath}' | Select-Object -ExpandProperty Status"`;
            const status = execSync(verifyCommand, { encoding: 'utf-8' }).trim();
            
            if (status === 'Valid') {
                console.log('✅ Signature verification: VALID');
            } else {
                console.log(`⚠️  Signature verification: ${status}`);
            }
        } catch (verifyError) {
            console.log('⚠️  Could not verify signature (may be running on non-Windows)');
        }
        
        console.log('========================================\n');
        
    } catch (error) {
        console.error('❌ SIGNING FAILED:');
        console.error(error.message);
        console.error('========================================\n');
        throw error;
    }
};
