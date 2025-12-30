// Test script to verify Electron functionality
// Run this in the Electron app console to test current state

console.log('=== ELECTRON FUNCTIONALITY TEST ===');
console.log('Test started at:', new Date().toISOString());

// Test 1: Check if Electron environment is detected
console.log('1. Electron Environment Check:');
console.log('   window.isElectron:', window.isElectron);
console.log('   window.electronEnvironment:', window.electronEnvironment);

// Test 2: Check logo element and source
console.log('2. Logo Element Check:');
const logoElement = document.getElementById('dynamic-logo');
if (logoElement) {
    console.log('   Logo element found:', logoElement);
    console.log('   Logo src:', logoElement.src);
    console.log('   Logo complete:', logoElement.complete);
    console.log('   Logo naturalWidth:', logoElement.naturalWidth);
} else {
    console.log('   ❌ Logo element NOT found');
}

// Test 3: Check IPC availability
console.log('3. IPC Communication Check:');
console.log('   window.electronAPI:', !!window.electronAPI);
console.log('   window.require:', !!window.require);

if (window.electronAPI) {
    console.log('   electronAPI.send:', typeof window.electronAPI.send);
    console.log('   electronAPI.on:', typeof window.electronAPI.on);
    console.log('   electronAPI.once:', typeof window.electronAPI.once);
}

if (window.require) {
    try {
        const electron = window.require('electron');
        console.log('   Legacy require works:', !!electron);
        console.log('   ipcRenderer available:', !!electron.ipcRenderer);
    } catch (e) {
        console.log('   Legacy require error:', e.message);
    }
}

// Test 4: Check asset loading
console.log('4. Asset Loading Check:');
const testImage = new Image();
testImage.onload = () => console.log('   ✅ Test image loaded successfully');
testImage.onerror = () => console.log('   ❌ Test image failed to load');
testImage.src = './assets/images/giddh-big-logo.svg';

// Test 5: Google login test function
console.log('5. Google Login Test Function Available:');
window.testGoogleLogin = function() {
    console.log('Testing Google login...');

    if (window.electronAPI && window.electronAPI.send) {
        console.log('Using electronAPI for authentication');
        window.electronAPI.send('authenticate', 'google');

        window.electronAPI.once('take-your-gmail-token', (response) => {
            console.log('Google auth response:', response);
            if (response.error) {
                console.log('❌ Google auth failed:', response.error);
            } else if (response.access_token) {
                console.log('✅ Google auth successful, token received');
            } else {
                console.log('⚠️ Unexpected response format:', response);
            }
        });
    } else if (window.require) {
        try {
            const electron = window.require('electron');
            console.log('Using legacy require for authentication');
            electron.ipcRenderer.send('authenticate', 'google');

            electron.ipcRenderer.once('take-your-gmail-token', (event, response) => {
                console.log('Google auth response:', response);
                if (response.error) {
                    console.log('❌ Google auth failed:', response.error);
                } else if (response.access_token) {
                    console.log('✅ Google auth successful, token received');
                } else {
                    console.log('⚠️ Unexpected response format:', response);
                }
            });
        } catch (e) {
            console.log('❌ Legacy require failed:', e.message);
        }
    } else {
        console.log('❌ No IPC communication method available');
    }
};

console.log('=== TEST COMPLETE ===');
console.log('To test Google login, run: testGoogleLogin()');
