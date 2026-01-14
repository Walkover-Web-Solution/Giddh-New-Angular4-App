!macro customInstall
  ; Ensure proper permissions for app resources
  SetOutPath "$INSTDIR\resources"
  
  ; Copy ICU data file if it exists
  IfFileExists "$INSTDIR\resources\icudtl.dat" 0 +2
    CopyFiles /SILENT "$INSTDIR\resources\icudtl.dat" "$INSTDIR\icudtl.dat"
  
  ; Set proper file permissions
  AccessControl::GrantOnFile "$INSTDIR" "(S-1-5-32-545)" "FullAccess"
!macroend

!macro customUnInstall
  ; Custom uninstall steps if needed
!macroend
