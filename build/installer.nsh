!macro customInstall
  ; Ensure proper permissions for app resources
  SetOutPath "$INSTDIR\resources"
  
  ; Copy ICU data file if it exists
  IfFileExists "$INSTDIR\resources\icudtl.dat" 0 +2
    CopyFiles /SILENT "$INSTDIR\resources\icudtl.dat" "$INSTDIR\icudtl.dat"
  
  ; Set proper file permissions
  AccessControl::GrantOnFile "$INSTDIR" "(S-1-5-32-545)" "FullAccess"
  
  ; Force Windows to refresh icon cache for desktop shortcut
  ; This ensures the embedded EXE icon is displayed instead of cached Electron default
  System::Call 'shell32.dll::SHChangeNotify(i 0x08000000, i 0, i 0, i 0)'
!macroend

!macro customUnInstall
  ; Custom uninstall steps if needed
!macroend
