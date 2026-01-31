!macro customInstall
  ; Set app executable path
  StrCpy $appExe "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  
  ; Delete existing shortcuts (they may have cached wrong icon)
  Delete "$DESKTOP\${SHORTCUT_NAME}.lnk"
  Delete "$SMPROGRAMS\${MENU_FILENAME}\${SHORTCUT_NAME}.lnk"
  
  ; Recreate desktop shortcut with explicit icon reference
  CreateShortCut "$DESKTOP\${SHORTCUT_NAME}.lnk" "$appExe" "" "$appExe" 0 SW_SHOWNORMAL "" "${APP_DESCRIPTION}"
  
  ; Recreate Start Menu shortcut with explicit icon reference
  CreateDirectory "$SMPROGRAMS\${MENU_FILENAME}"
  CreateShortCut "$SMPROGRAMS\${MENU_FILENAME}\${SHORTCUT_NAME}.lnk" "$appExe" "" "$appExe" 0 SW_SHOWNORMAL "" "${APP_DESCRIPTION}"
  
  ; Force Windows to refresh icon cache
  System::Call 'shell32.dll::SHChangeNotify(i 0x08000000, i 0, i 0, i 0)'
!macroend

!macro customUnInstall
  ; Custom uninstall steps if needed
!macroend
