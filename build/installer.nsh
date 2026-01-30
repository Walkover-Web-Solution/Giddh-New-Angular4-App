!macro customInstall
  ; Force Windows to refresh icon cache for desktop shortcut
  ; This ensures the embedded EXE icon is displayed instead of cached Electron default
  System::Call 'shell32.dll::SHChangeNotify(i 0x08000000, i 0, i 0, i 0)'
!macroend

!macro customUnInstall
  ; Custom uninstall steps if needed
!macroend
