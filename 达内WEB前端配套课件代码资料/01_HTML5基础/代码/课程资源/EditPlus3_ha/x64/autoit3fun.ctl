#TITLE=AutoIt3 Function Reference
#INFO
EditPlus cliptext library file for AutoIt 3.2.12.0
Cliptext by Brett Pantalone <pantalone2001 at yahoo dot com>

#SORT=n

#T=Abs
;Calculates the absolute value of a number. 
Abs( ^!expression )
#T=ACos
;Calculates the arcCosine of a number. 
ACos( ^!expression )
#T=AdlibDisable
;Disables the adlib functionality. 
AdlibDisable( )
#T=AdlibEnable
;Enables Adlib functionality. 
AdlibEnable( )
#T=Asc
;Returns the ASCII code of a character. 
Asc( ^!"char" )
#T=AscW
;Returns the unicode code of a character. 
AscW( ^!"char" )
#T=ASin
;Calculates the arcsine of a number. 
ASin( ^!expression )
#T=Assign
;Assigns a variable by name with the data. 
Assign( ^!"varname", "data" [, flag] )
#T=ATan
;Calculates the arctangent of a number. 
ATan( ^!expression )
#T=AutoItSetOption
;Changes the operation of various AutoIt functions/parameters. 
AutoItSetOption( ^!"option" [, param] )
#T=AutoItWinGetTitle
;Retrieves the title of the AutoIt window. 
AutoItWinGetTitle( )
#T=AutoItWinSetTitle
;Changes the title of the AutoIt window. 
AutoItWinSetTitle( ^!"newtitle" )
#T=Beep
;Plays back a beep to the user. 
Beep( ^![ Frequency [, Duration ]] )
#T=Binary
;Returns the binary representation of an expression. 
Binary( ^!expression )
#T=BinaryLen
;Returns the number of bytes in a binary variant. 
BinaryLen( ^!binary )
#T=BinaryMid
;Extracts a number of bytes from a binary variant. 
BinaryMid( ^!binary, start [, count] )
#T=BinaryToString
;Converts a binary variant into a string. 
BinaryToString( ^!expression [, flag] )
#T=BitAND
;Performs a bitwise AND operation. 
BitAND( ^!value1, value2 [, value n] )
#T=BitNOT
;Performs a bitwise NOT operation. 
BitNOT( ^!value )
#T=BitOR
;Performs a bitwise OR operation. 
BitOR( ^!value1, value2 [, value n] )
#T=BitRotate
;Performs a bit shifting operation, with rotation. 
BitRotate( ^!value , shift [, size] )
#T=BitShift
;Performs a bit shifting operation. 
BitShift( ^!value, shift )
#T=BitXOR
;Performs a bitwise exclusive OR (XOR) operation. 
BitXOR( ^!value1, value2 [, value n] )
#T=BlockInput
;Disable/enable the mouse and keyboard. 
BlockInput( ^!flag )
#T=Break
;Enables or disables the users' ability to exit a script from the tray icon menu. 
Break( ^!mode )
#T=Call
;Calls a user-defined function contained in a string parameter. 
Call( ^!"function" [, param1 [, param2 [, paramN ]]] )
#T=CDTray
;Opens or closes the CD tray. 
CDTray( ^!"drive", "status" )
#T=Ceiling
;Returns a number rounded up to the next integer. 
Ceiling( ^!expression )
#T=Chr
;Returns a character corresponding to an ASCII code. 
Chr( ^!ASCIIcode )
#T=ChrW
;Returns a character corresponding to a unicode code. 
ChrW( ^!UNICODEcode )
#T=ClipGet
;Retrieves text from the clipboard. 
ClipGet( )
#T=ClipPut
;Writes text to the clipboard. 
ClipPut( ^!"value" )
#T=ConsoleRead
;Read from the STDIN stream of the AutoIt script process. 
ConsoleRead( ^![peek = false[, binary = false ]])
#T=ConsoleWrite
;Writes data to the STDOUT stream. Some text editors can read this stream as can other programs which may be expecting data on this stream. 
ConsoleWrite( ^!"data" )
#T=ConsoleWriteError
;Writes data to the STDERR stream. Some text editors can read this stream as can other programs which may be expecting data on this stream. 
ConsoleWriteError( ^!"data" )
#T=ControlClick
;Sends a mouse click command to a given control. 
ControlClick( ^!"title", "text", controlID [, button [, clicks [, x [, y ]]]] )
#T=ControlCommand
;Sends a command to a control. 
ControlCommand( ^!"title", "text", controlID, "command" [, "option"] )
#T=ControlDisable
;Disables or "grays-out" a control. 
ControlDisable( ^!"title", "text", controlID)
#T=ControlEnable
;Enables a "grayed-out" control. 
ControlEnable( ^!"title", "text", controlID )
#T=ControlFocus
;Sets input focus to a given control on a window. 
ControlFocus( ^!"title", "text", controlID )
#T=ControlGetFocus
;Returns the ControlRef# of the control that has keyboard focus within a specified window. 
ControlGetFocus( ^!"title" [, "text"] )
#T=ControlGetHandle
;Retrieves the internal handle of a control. 
ControlGetHandle( ^!"title", "text", controlID )
#T=ControlGetPos
;Retrieves the position and size of a control relative to it's window. 
ControlGetPos( ^!"title", "text", controlID )
#T=ControlGetText
;Retrieves text from a control. 
ControlGetText( ^!"title", "text", controlID )
#T=ControlHide
;Hides a control. 
ControlHide( ^!"title", "text", controlID )
#T=ControlListView
;Sends a command to a ListView32 control. 
ControlListView( ^!"title", "text", controlID, "command" [, option1 [, option2]] )
#T=ControlMove
;Moves a control within a window. 
ControlMove( ^!"title", "text", controlID, x, y [, width [, height]] )
#T=ControlSend
;Sends a string of characters to a control. 
ControlSend( ^!"title", "text", controlID, "string" [, flag] )
#T=ControlSetText
;Sets text of a control. 
ControlSetText( ^!"title", "text", controlID, "new text" [, flag] )
#T=ControlShow
;Shows a control that was hidden. 
ControlShow( ^!"title", "text", controlID )
#T=ControlTreeView
;Sends a command to a TreeView32 control. 
ControlTreeView( ^!"title", "text", controlID, "command" [, option1 [, option2]] )
#T=Cos
;Calculates the cosine of a number. 
Cos( ^!expression )
#T=Dec
;Returns a numeric representation of a hexadecimal string. 
Dec( ^!"hex" )
#T=DirCopy
;Copies a directory and all sub-directories and files (Similar to xcopy). 
DirCopy( ^!"source dir", "dest dir" [, flag] )
#T=DirCreate
;Creates a directory/folder. 
DirCreate( ^!"path" )
#T=DirGetSize
;Returns the size in bytes of a given directory. 
DirGetSize( ^!"path" [, flag] )
#T=DirMove
;Moves a directory and all sub-directories and files. 
DirMove( ^!"source dir", "dest dir" [, flag] )
#T=DirRemove
;Deletes a directory/folder. 
DirRemove( ^!"path" [, recurse] )
#T=DllCall
;Dynamically calls a function in a DLL. 
DllCall( ^!"dll", "return type", "function" [, "type1", param1 [, "type n", param n]] )
#T=DllCallbackFree
;Frees a previously created handle created with DllCallbackRegister. 
DllCallbackFree( ^!handle )
#T=DllCallbackGetPtr
;Returns the pointer to a callback function that can be passed to the Win32 API. 
DllCallbackGetPtr( ^!handle )
#T=DllCallbackRegister
;Creates a user-defined DLL Callback function. 
DllCallbackRegister( ^!"function", "return type", "params" )
#T=DllClose
;Closes a previously opened DLL. 
DllClose( ^!dllhandle )
#T=DllOpen
;Opens a DLL file for use in DllCall. 
DllOpen( ^!"filename" )
#T=DllStructCreate
;Creates a C/C++ style structure to be used in DllCall. 
DllStructCreate( ^!"Struct" [,Pointer] )
#T=DllStructGetData
;Returns the data of an element of the struct. 
DllStructGetData( ^!Struct, Element [, index ] )
#T=DllStructGetPtr
;Returns the pointer to the struct or an element in the struct. 
DllStructGetPtr( ^!Struct [,Element])
#T=DllStructGetSize
;Returns the size of the struct in bytes. 
DllStructGetSize( ^!Struct )
#T=DllStructSetData
;Sets the data in of an element in the struct. 
DllStructSetData( ^!Struct, Element, value [, index ] )
#T=DriveGetDrive
;Returns an array containing the enumerated drives. 
DriveGetDrive( ^!"type" )
#T=DriveGetFileSystem
;Returns File System Type of a drive. 
DriveGetFileSystem( ^!"path" )
#T=DriveGetLabel
;Returns Volume Label of a drive, if it has one. 
DriveGetLabel( ^!"path" )
#T=DriveGetSerial
;Returns Serial Number of a drive. 
DriveGetSerial( ^!"path" )
#T=DriveGetType
;Returns drive type. 
DriveGetType( ^!"path" )
#T=DriveMapAdd
;Maps a network drive. 
DriveMapAdd( ^!"device", "remote share" [, flags [, "user" [, "password"]]] )
#T=DriveMapDel
;Disconnects a network drive. 
DriveMapDel( ^!"device" )
#T=DriveMapGet
;Retrieves the details of a mapped drive. 
DriveMapGet( ^!"device" )
#T=DriveSetLabel
;Sets the Volume Label of a drive. 
DriveSetLabel( ^!"path", "label" )
#T=DriveSpaceFree
;Returns the free disk space of a path in Megabytes. 
DriveSpaceFree( ^!"path" )
#T=DriveSpaceTotal
;Returns the total disk space of a path in Megabytes. 
DriveSpaceTotal( ^!"path" )
#T=DriveStatus
;Returns the status of the drive as a string. 
DriveStatus( ^!"path" )
#T=EnvGet
;Retrieves an environment variable. 
EnvGet( ^!"envvariable" )
#T=EnvSet
;Writes an environment variable. 
EnvSet( ^!"envvariable" [, "value"] )
#T=EnvUpdate
;Refreshes the OS environment. 
EnvUpdate( )
#T=Eval
;Return the value of the variable defined by an string. 
Eval( ^!string )
#T=Execute
;Execute an expression. 
Execute( ^!string )
#T=Exp
;Calculates e to the power of a number. 
Exp( ^!expression )
#T=FileChangeDir
;Changes the current working directory. 
FileChangeDir( ^!"path" )
#T=FileClose
;Closes a previously opened text file. 
FileClose( ^!filehandle )
#T=FileCopy
;Copies one or more files. 
FileCopy( ^!"source", "dest" [, flag] )
#T=FileCreateNTFSLink
;Creates an NTFS hardlink to a file or a directory 
FileCreateNTFSLink( ^!"source", "hardlink" [, flag] )
#T=FileCreateShortcut
;Creates a shortcut (.lnk) to a file. 
FileCreateShortcut( ^!"file", "lnk" [, "workdir" [, "args" [, "desc" [, "icon" [, "hotkey" [, icon number [, state]]]]]]] )
#T=FileDelete
;Delete one or more files. 
FileDelete( ^!"path" )
#T=FileExists
;Checks if a file or directory exists. 
FileExists( ^!"path" )
#T=FileFindFirstFile
;Returns a search "handle" according to file search string. 
FileFindFirstFile( ^!"filename" )
#T=FileFindNextFile
;Returns a filename according to a previous call to FileFindFirstFile. 
FileFindNextFile( ^!search )
#T=FileGetAttrib
;Returns a code string representing a file's attributes. 
FileGetAttrib( ^!"filename" )
#T=FileGetLongName
;Returns the long path+name of the path+name passed. 
FileGetLongName( ^!"file" [, flag] )
#T=FileGetShortcut
;Retrieves details about a shortcut. 
FileGetShortcut( ^!"lnk" )
#T=FileGetShortName
;Returns the 8.3 short path+name of the path+name passed. 
FileGetShortName( ^!"file" [, flag] )
#T=FileGetSize
;Returns the size of a file in bytes. 
FileGetSize( ^!"filename" )
#T=FileGetTime
;Returns the time and date information for a file. 
FileGetTime( ^!"filename" [, option [, format]] )
#T=FileGetVersion
;Returns the "File" version information. 
FileGetVersion( ^!"filename" [,"stringname"] )
#T=FileInstall
;Include and install a file with the compiled script. 
FileInstall( ^!"source", "dest" [, flag] )
#T=FileMove
;Moves one or more files 
FileMove( ^!"source", "dest" [, flag] )
#T=FileOpen
;Opens a text file for reading or writing. 
FileOpen( ^!"filename", mode )
#T=FileOpenDialog
;Initiates a Open File Dialog. 
FileOpenDialog( ^!"title", "init dir", "filter" [, options [, "default name" [, hwnd]]] )
#T=FileRead
;Read in a number of characters from a previously opened text file. 
FileRead( ^!filehandle or "filename" [, count] )
#T=FileReadLine
;Read in a line of text from a previously opened text file. 
FileReadLine( ^!filehandle or "filename" [, line] )
#T=FileRecycle
;Sends a file or directory to the recycle bin. 
FileRecycle( ^!"source" )
#T=FileRecycleEmpty
;Empties the recycle bin. 
FileRecycleEmpty( ^!["drive"] )
#T=FileSaveDialog
;Initiates a Save File Dialog. 
FileSaveDialog( ^!"title", "init dir", "filter" [, options [, "default name" [, hwnd]]] )
#T=FileSelectFolder
;Initiates a Browse For Folder dialog. 
FileSelectFolder( ^!"dialog text", "root dir" [, flag [, "initial dir" [, hwnd]]] )
#T=FileSetAttrib
;Sets the attributes of one or more files. 
FileSetAttrib( ^!"file pattern", "+-RASHNOT" [, recurse] )
#T=FileSetTime
;Sets the timestamp of one of more files. 
FileSetTime( ^!"file pattern", "time" [, type [, recurse] ] )
#T=FileWrite
;Append a line of text to the end of a previously opened text file. 
FileWrite( ^!filehandle or "filename", "line" )
#T=FileWriteLine
;Append a line of text to the end of a previously opened text file. 
FileWriteLine( ^!filehandle or "filename", "line" )
#T=Floor
;Returns a number rounded down to the closest integer. 
Floor( ^!expression )
#T=FtpSetProxy
;Sets the internet proxy to use for ftp access. 
FtpSetProxy( ^!mode [, "proxy:port" [, "username", "password"]] )
#T=Hex
;Returns a string representation of an integer or of a binary type converted to hexadecimal. 
Hex( ^!expression [, length] )
#T=HotKeySet
;Sets a hotkey that calls a user function. 
HotKeySet( ^!"key" [, "function"] )
#T=HttpSetProxy
;Sets the internet proxy to use for http access. 
HttpSetProxy( ^!mode [, "proxy:port" [, "username", "password"]] )
#T=HWnd
;Converts an expression into an HWND handle. 
HWnd( ^!expression )
#T=InetGet
;Downloads a file from the internet using the http or ftp protocol. 
InetGet( ^!"URL" [,"filename" [, reload [, background]]] )
#T=InetGetSize
;Returns the size (in bytes) of a file located on the internet. 
InetGetSize( ^!"URL" )
#T=IniDelete
;Deletes a value from a standard format .ini file. 
IniDelete( ^!"filename", "section" [, "key"] )
#T=IniRead
;Reads a value from a standard format .ini file. 
IniRead( ^!"filename", "section", "key", "default" )
#T=IniReadSection
;Reads all key/value pairs from a section in a standard format .ini file. 
IniReadSection( ^!"filename", "section" )
#T=IniReadSectionNames
;Reads all sections in a standard format .ini file. 
IniReadSectionNames( ^!"filename" )
#T=IniRenameSection
;Renames a section in a standard format .ini file. 
IniRenameSection( ^!"filename", "section", "new section" [, flag] )
#T=IniWrite
;Writes a value to a standard format .ini file. 
IniWrite( ^!"filename", "section", "key", "value" )
#T=IniWriteSection
;Writes a section to a standard format .ini file. 
IniWriteSection( ^!"filename", "section", "data" [, index ] )
#T=InputBox
;Displays an input box to ask the user to enter a string. 
InputBox( ^!"title", "Prompt" [, "Default" [, "password char" [, width, height [, left, top [, timeOut [, hwnd]]]]]] )
#T=Int
;Returns the integer (whole number) representation of an expression. 
Int( ^!expression )
#T=IsAdmin
;Checks if the current user has full administrator privileges. 
IsAdmin( )
#T=IsArray
;Checks if a variable is an array type. 
IsArray( ^!variable )
#T=IsBinary
;Checks if a variable or expression is a binary type. 
IsBinary( ^!expression )
#T=IsBool
;Checks if a variable's base type is boolean. 
IsBool( ^!variable )
#T=IsDeclared
;Check if a variable has been declared. 
IsDeclared( ^!expression )
#T=IsDllStruct
;Checks if a variable is a DllStruct type. 
IsDllStruct( ^!variable )
#T=IsFloat
;Checks if a variable or expression is a float-type. 
IsFloat( ^!variable )
#T=IsHWnd
;Checks if a variable's base type is a pointer and window handle. 
IsHWnd( ^!variable )
#T=IsInt
;Checks if a variable or expression is an integer type. 
IsInt( ^!variable )
#T=IsKeyword
;Checks if a variable is a keyword (for example, Default). 
IsKeyword( ^!variable )
#T=IsNumber
;Checks if a variable's base type is numeric. 
IsNumber( ^!variable )
#T=IsObj
;Checks if a variable or expression is an object type. 
IsObj( ^!variable )
#T=IsPtr
;Checks if a variable's base type is a pointer. 
IsPtr( ^!variable )
#T=IsString
;Checks if a variable is a string type. 
IsString( ^!variable )
#T=Log
;Calculates the natural logarithm of a number. 
Log( ^!expression )
#T=MemGetStats
;Retrieves memory related information. 
MemGetStats( )
#T=Mod
;Performs the modulus operation. 
Mod( ^!value1, value2 )
#T=MouseClick
;Perform a mouse click operation. 
MouseClick( ^!"button" [, x, y [, clicks [, speed ]]] )
#T=MouseClickDrag
;Perform a mouse click and drag operation. 
MouseClickDrag( ^!"button", x1, y1, x2, y2 [, speed] ) 
#T=MouseDown
;Perform a mouse down event at the current mouse position. 
MouseDown( ^!"button" )
#T=MouseGetCursor
;Returns the cursor ID Number for the current Mouse Cursor. 
MouseGetCursor( )
#T=MouseGetPos
;Retrieves the current position of the mouse cursor. 
MouseGetPos( ^![dimension] )
#T=MouseMove
;Moves the mouse pointer. 
MouseMove( ^!x, y [, speed] )
#T=MouseUp
;Perform a mouse up event at the current mouse position. 
MouseUp( ^!"button" )
#T=MouseWheel
;Moves the mouse wheel up or down. NT/2000/XP ONLY. 
MouseWheel( ^!"direction" [, clicks] )
#T=MsgBox
;Displays a simple message box with optional timeout. 
MsgBox( ^!flag, "title", "text" [, timeout [, hwnd]] )
#T=Number
;Returns the numeric representation of an expression. 
Number( ^!expression )
#T=ObjCreate
;Creates a reference to a COM object from the given classname. 
ObjCreate( ^!"classname" [, "servername" [,"username", ["password"]]] )
#T=ObjEvent
;Handles incoming events from the given Object. 
ObjEvent( ^!$ObjectVar, "functionprefix" [, "interface name"] )
#T=ObjGet
;Retrieves a reference to a COM object from an existing process or filename. 
ObjGet( ^!"filename" [, "classname"] )
#T=ObjName
;Returns the name or interface description of an Object 
ObjName( ^!$Objectvariable [,Flag] )
#T=Ping
;Pings a host and returns the roundtrip-time. 
Ping( ^!address or hostname [, timeout] )
#T=PixelChecksum
;Generates a checksum for a region of pixels. 
PixelChecksum( ^!left, top, right, bottom [, step [,hwnd]] )
#T=PixelGetColor
;Returns a pixel color according to x,y pixel coordinates. 
PixelGetColor( ^!x , y [, hwnd] )
#T=PixelSearch
;Searches a rectangle of pixels for the pixel color provided. 
PixelSearch( ^!left, top, right, bottom, color [, shade-variation [, step [, hwnd]]] )
#T=ProcessClose
;Terminates a named process. 
ProcessClose( ^!"process" )
#T=ProcessExists
;Checks to see if a specified process exists. 
ProcessExists( ^!"process" ) 
#T=ProcessGetStats
;Returns an array about Memory or IO infos of a running process. 
ProcessGetStats( ^!["process" [, type]] )
#T=ProcessList
;Returns an array listing the currently running processes (names and PIDs). 
ProcessList( ^!["name"] )
#T=ProcessSetPriority
;Changes the priority of a process 
ProcessSetPriority( ^!"process", priority)
#T=ProcessWait
;Pauses script execution until a given process exists. 
ProcessWait( ^!"process" [, timeout] )
#T=ProcessWaitClose
;Pauses script execution until a given process does not exist. 
ProcessWaitClose( ^!"process" [, timeout] )
#T=ProgressOff
;Turns Progress window off. 
ProgressOff( )
#T=ProgressOn
;Creates a customizable progress bar window. 
ProgressOn( ^!"title", "maintext" [, "subtext" [, x pos [, y pos [, opt]]]] )
#T=ProgressSet
;Sets the position and/or text of a previously created Progress bar window. 
ProgressSet( ^!percent [, "subtext" [, "maintext"]] )
#T=Ptr
;Converts an expression into a pointer variant. 
Ptr( ^!expression )
#T=Random
;Generates a pseudo-random float-type number. 
Random( ^![Min [, Max [, Flag]]] )
#T=RegDelete
;Deletes a key or value from the registry. 
RegDelete( ^!"keyname" [, "valuename"] )
#T=RegEnumKey
;Reads the name of a subkey according to it's instance. 
RegEnumKey( ^!"keyname", instance )
#T=RegEnumVal
;Reads the name of a value according to it's instance. 
RegEnumVal( ^!"keyname", instance )
#T=RegRead
;Reads a value from the registry. 
RegRead( ^!"keyname", "valuename" )
#T=RegWrite
;Creates a key or value in the registry. 
RegWrite( ^!"keyname" [,"valuename", "type", value] )
#T=Round
;Returns a number rounded to a specified number of decimal places. 
Round( ^!expression [, decimalplaces] )
#T=Run
;Runs an external program. 
Run( ^!"filename" [, "workingdir" [, flag[, standard_i/o_flag]]] )
#T=RunAs
;Runs an external program under the context of a different user. 
RunAs( ^!"username", "domain", "password", logon_flags, "filename" [, "workingdir" [, flag[, standard_i/o_flag]]] )
#T=RunAsWait
;Runs an external program under the context of a different user and pauses script execution until the program finishes. 
RunAsWait( ^!"username", "domain", "password", logon_flags, "filename" [, "workingdir" [, flag]] )
#T=RunWait
;Runs an external program and pauses script execution until the program finishes. 
RunWait( ^!"filename" [, "workingdir" [, flag]] )
#T=Send
;Sends simulated keystrokes to the active window. 
Send( ^!"keys" [, flag] )
#T=SendKeepActive
;Attempts to keep a specified window active during Send(). 
SendKeepActive( ^!"title" [, "text"] )
#T=SetError
;Manually set the value of the @error macro. 
SetError( ^!code [, extended [, return value]] )
#T=SetExtended
;Manually set the value of the @extended macro. 
SetExtended( ^!code [, return value] )
#T=ShellExecute
;Runs an external program using the ShellExecute API. 
ShellExecute( ^!"filename" [, "parameters" [, "workingdir" [, "verb" [, showflag]]]] )
#T=ShellExecuteWait
;Runs an external program using the ShellExecute API and pauses script execution until it finishes. 
ShellExecuteWait( ^!"filename" [, "parameters" [, "workingdir" [, "verb" [, showflag]]]] )
#T=Shutdown
;Shuts down the system. 
Shutdown( ^!code )
#T=Sin
;Calculates the sine of a number. 
Sin( ^!expression )
#T=Sleep
;Pause script execution. 
Sleep( ^!delay )
#T=SoundPlay
;Play a sound file. 
SoundPlay( ^!"filename" [, wait] )
#T=SoundSetWaveVolume
;Sets the system wave volume by percent. 
SoundSetWaveVolume( ^!percent ) 
#T=SplashImageOn
;Creates a customizable image popup window. 
SplashImageOn( ^!"title", "file" [, width [, height [, x pos [, y pos [, opt]]]]] )
#T=SplashOff
;Turns SplashText or SplashImage off. 
SplashOff( )
#T=SplashTextOn
;Creates a customizable text popup window. 
SplashTextOn( ^!"title", "text" [, w [, h [, x pos [, y pos [, opt [, "fontname" [, fontsz [, fontwt ]]]]]]]] )
#T=Sqrt
;Calculates the square-root of a number. 
Sqrt( ^!expression )
#T=SRandom
;Set Seed for random number generation. 
SRandom( ^!Seed )
#T=StatusbarGetText
;Retrieves the text from a standard status bar control. 
StatusbarGetText( ^!"title" [, "text" [, part]] )
#T=StderrRead
;Reads from the STDERR stream of a previously run child process. 
StderrRead( ^!process_id[, peek = false[, binary = false]] )
#T=StdinWrite
;Writes a number of characters to the STDIN stream of a previously run child process. 
StdinWrite( ^!process_id[, data] )
#T=StdioClose
;Closes all resources associated with a process previously run with STDIO redirection. 
StdioClose( ^!process_id )
#T=StdoutRead
;Reads from the STDOUT stream of a previously run child process. 
StdoutRead( ^!process_id[, peek = false[, binary = false]] )
#T=String
;Returns the string representation of an expression. 
String( ^!expression )
#T=StringAddCR
;Takes a string and prefixes all linefeed characters ( Chr(10) ) with a carriage return character ( Chr(13) ). 
StringAddCR( ^!"string" )
#T=StringCompare
;Compares two strings with options. 
StringCompare( ^!"string1", "string2" [, casesense] )
#T=StringFormat
;Returns a formatted string (similar to the C sprintf() function). 
StringFormat( ^!"format control", var1 [, ... var32] )
#T=StringInStr
;Checks if a string contains a given substring. 
StringInStr( ^!"string", "substring" [, casesense [, occurrence [, start [, count]]]] )
#T=StringIsAlNum
;Checks if a string contains only alphanumeric characters. 
StringIsAlNum( ^!"string" )
#T=StringIsAlpha
;Checks if a string contains only alphabetic characters. 
StringIsAlpha("string"  )
#T=StringIsASCII
;Checks if a string contains only ASCII characters in the range 0x00 - 0x7f (0 - 127). 
StringIsASCII( ^!"string" )
#T=StringIsDigit
;Checks if a string contains only digit (0-9) characters. 
StringIsDigit( ^!"string" )
#T=StringIsFloat
;Checks if a string is a floating point number. 
StringIsFloat( ^!"string" )
#T=StringIsInt
;Checks if a string is an integer. 
StringIsInt( ^!"string" )
#T=StringIsLower
;Checks if a string contains only lowercase characters. 
StringIsLower( ^!"string" )
#T=StringIsSpace
;Checks if a string contains only whitespace characters. 
StringIsSpace( ^!"string" )
#T=StringIsUpper
;Checks if a string contains only uppercase characters. 
StringIsUpper( ^!"string" )
#T=StringIsXDigit
;Checks if a string contains only hexadecimal digit (0-9, A-F) characters. 
StringIsXDigit( ^!"string" )
#T=StringLeft
;Returns a number of characters from the left-hand side of a string. 
StringLeft( ^!"string", count )
#T=StringLen
;Returns the number of characters in a string. 
StringLen( ^!"string" )
#T=StringLower
;Converts a string to lowercase. 
StringLower( ^!"string" )
#T=StringMid
;Extracts a number of characters from a string. 
StringMid( ^!"string", start [, count] )
#T=StringRegExp
;Check if a string fits a given regular expression pattern. 
StringRegExp( ^!"test", "pattern" [, flag ] [, offset ] ] )
#T=StringRegExpReplace
;Replace text in a string based on regular expressions. 
StringRegExpReplace( ^!"test", "pattern", "replace", [ count ] )
#T=StringReplace
;Replaces substrings in a string. 
StringReplace( ^!"string", "searchstring" or start, "replacestring" [, count [, casesense]] )
#T=StringRight
;Returns a number of characters from the right-hand side of a string. 
StringRight( ^!"string", count )
#T=StringSplit
;Splits up a string into substrings depending on the given delimiters. 
StringSplit( ^!"string", "delimiters" [, flag ] )
#T=StringStripCR
;Removes all carriage return values ( Chr(13) ) from a string. 
StringStripCR( ^!"string" )
#T=StringStripWS
;Strips the white space in a string. 
StringStripWS( ^!"string", flag )
#T=StringToBinary
;Converts a string into binary data. 
StringToBinary( ^!expression [, flag] )
#T=StringTrimLeft
;Trims a number of characters from the left hand side of a string. 
StringTrimLeft( ^!"string", count )
#T=StringTrimRight
;Trims a number of characters from the right hand side of a string. 
StringTrimRight( ^!"string", count )
#T=StringUpper
;Converts a string to uppercase. 
StringUpper( ^!"string" )
#T=Tan
;Calculates the tangent of a number. 
Tan( ^!expression )
#T=TCPAccept
;Permits an incoming connection attempt on a socket. 
TCPAccept( ^!mainsocket )
#T=TCPCloseSocket
;Closes a TCP socket. 
TCPCloseSocket( ^!socket )
#T=TCPConnect
;Create a socket connected to an existing server. 
TCPConnect( ^!IPAddr, port )
#T=TCPListen
;Creates a socket listening for an incoming connection. 
TCPListen( ^!IPAddr, port [, MaxPendingConnection] )
#T=TCPNameToIP
;Converts an Internet name to IP address. 
TCPNameToIP( ^!name )
#T=TCPRecv
;Receives data from a connected socket. 
TCPRecv( ^!mainsocket, maxlen [, flag] )
#T=TCPSend
;Sends data on a connected socket. 
TCPSend( ^!mainsocket, data )
#T=TCPShutdown
;Stops TCP/UDP services. 
TCPShutdown( )
#T=UDPShutdown
;Stops TCP/UDP services. 
UDPShutdown( )
#T=TCPStartup
;Starts TCP or UDP services. 
TCPStartup( )
#T=UDPStartup
;Starts TCP or UDP services. 
UDPStartup( )
#T=TimerDiff
;Returns the difference in time from a previous call to TimerInit(). 
TimerDiff( ^!timestamp )
#T=TimerInit
;Returns a timestamp (in milliseconds). 
TimerInit( )
#T=ToolTip
;Creates a tooltip anywhere on the screen. 
ToolTip( ^!"text" [, x [, y [, "title" [, icon [, options]]]]] )
#T=TrayCreateItem
;Creates a menuitem control for the tray. 
TrayCreateItem( ^!text [, menuID [, menuentry [, menuradioitem]]] )
#T=TrayCreateMenu
;Creates a menu control for the tray menu. 
TrayCreateMenu( ^!"sub/menutext" [, menuID [, menuentry]] )
#T=TrayGetMsg
;Polls the tray to see if any events have occurred. 
TrayGetMsg( )
#T=TrayItemDelete
;Deletes a menu/item control from the tray menu. 
TrayItemDelete( ^!controlID )
#T=TrayItemGetHandle
;Returns the handle for a tray menu(item). 
TrayItemGetHandle( ^!controlID )
#T=TrayItemGetState
;Gets the current state of a control. 
TrayItemGetState( ^![controlID] )
#T=TrayItemGetText
;Gets the itemtext of a tray menu/item control. 
TrayItemGetText( ^!controlID )
#T=TrayItemSetOnEvent
;Defines a user-defined function to be called when a tray item is clicked. 
TrayItemSetOnEvent( ^!itemID, "function" )
#T=TrayItemSetState
;Sets the state of a tray menu/item control. 
TrayItemSetState( ^!controlID, state )
#T=TrayItemSetText
;Sets the itemtext of a tray menu/item control. 
TrayItemSetText( ^!controlID, text )
#T=TraySetClick
;Sets the clickmode of the tray icon - what mouseclicks will display the tray menu. 
TraySetClick( ^!flag )
#T=TraySetIcon
;Loads/Sets a specified tray icon. 
TraySetIcon( ^![iconfile [, iconID] )
#T=TraySetOnEvent
;Defines a user function to be called when a special tray action happens. 
TraySetOnEvent( ^!specialID, "function" )
#T=TraySetPauseIcon
;Loads/Sets a specified tray pause icon. 
TraySetPauseIcon( ^![iconfile [, iconID] )
#T=TraySetState
;Sets the state of the tray icon. 
TraySetState( ^![ flag ] )
#T=TraySetToolTip
;(Re)Sets the tooltip text for the tray icon. 
TraySetToolTip( ^![text] )
#T=TrayTip
;Displays a balloon tip from the AutoIt Icon. (2000/XP only) 
TrayTip( ^!"title", "text", timeout [, option] )
#T=UBound
;Returns the size of array dimensions. 
UBound( ^!Array [, Dimension] )
#T=UDPBind
;Create a socket bound to an incoming connection. 
UDPBind( ^!IPAddr, port )
#T=UDPCloseSocket
;Close a UDP socket. 
UDPCloseSocket( ^!socketarray )
#T=UDPOpen
;Open a socket connected to an existing server . 
UDPOpen( ^!IPAddr, port )
#T=UDPRecv
;Receives data from a opened socket 
UDPRecv( ^!socketarray, maxlen [, flag] )
#T=UDPSend
;Sends data on an opened socket 
UDPSend( ^!socketarray, data)
#T=VarGetType
;Returns the internal type representation of a variant. 
VarGetType( ^!expression )
#T=WinActivate
;Activates (gives focus to) a window. 
WinActivate( ^!"title" [, "text"] )
#T=WinActive
;Checks to see if a specified window exists and is currently active. 
WinActive( ^!"title" [, "text"] )
#T=WinClose
;Closes a window. 
WinClose( ^!"title" [, "text"] )
#T=WinExists
;Checks to see if a specified window exists. 
WinExists( ^!"title" [, "text"] )
#T=WinFlash
;Flashes a window in the taskbar. 
WinFlash( ^!"title" [,"text" [,flashes [,delay ]]])
#T=WinGetCaretPos
;Returns the coordinates of the caret in the foreground window 
WinGetCaretPos( )
#T=WinGetClassList
;Retrieves the classes from a window. 
WinGetClassList( ^!"title" [, "text"] )
#T=WinGetClientSize
;Retrieves the size of a given window's client area. 
WinGetClientSize( ^!"title" [, "text"] )
#T=WinGetHandle
;Retrieves the internal handle of a window. 
WinGetHandle( ^!"title" [, "text"] )
#T=WinGetPos
;Retrieves the position and size of a given window. 
WinGetPos( ^!"title" [, "text"] )
#T=WinGetProcess
;Retrieves the Process ID (PID) associated with a window. 
WinGetProcess( ^!"title" [, "text"] )
#T=WinGetState
;Retrieves the state of a given window. 
WinGetState( ^!"title" [, "text"] )
#T=WinGetText
;Retrieves the text from a window. 
WinGetText( ^!"title" [, "text"] )
#T=WinGetTitle
;Retrieves the full title from a window. 
WinGetTitle( ^!"title" [, "text"] )
#T=WinKill
;Forces a window to close. 
WinKill( ^!"title" [, "text"] )
#T=WinList
;Retrieves a list of windows. 
WinList( ^!["title" [, "text"]] )
#T=WinMenuSelectItem
;Invokes a menu item of a window. 
WinMenuSelectItem( ^!"title", "text", "item" [, "item" [, "item" [, "item" [, "item" [, "item" [, "item"]]]]]] )
#T=WinMinimizeAll
;Minimizes all windows. 
WinMinimizeAll( )
#T=WinMinimizeAllUndo
;Undoes a previous WinMinimizeAll function. 
WinMinimizeAllUndo( )
#T=WinMove
;Moves and/or resizes a window. 
WinMove( ^!"title", "text", x, y [, width [, height[, speed]]] )
#T=WinSetOnTop
;Change a window's "Always On Top" attribute. 
WinSetOnTop( ^!"title", "text", flag )
#T=WinSetState
;Shows, hides, minimizes, maximizes, or restores a window. 
WinSetState( ^!"title", "text", flag )
#T=WinSetTitle
;Changes the title of a window. 
WinSetTitle( ^!"title", "text", "newtitle" )
#T=WinSetTrans
;Sets the transparency of a window. (Windows 2000/XP or later) 
WinSetTrans( ^!"title", "text", transparency )
#T=WinWait
;Pauses execution of the script until the requested window exists. 
WinWait( ^!"title" [, "text" [, timeout]] )
#T=WinWaitActive
;Pauses execution of the script until the requested window is active. 
WinWaitActive( ^!"title" [, "text" [, timeout]] )
#T=WinWaitClose
;Pauses execution of the script until the requested window does not exist. 
WinWaitClose( ^!"title" [, "text" [, timeout]] )
#T=WinWaitNotActive
;Pauses execution of the script until the requested window is not active. 
WinWaitNotActive( ^!"title" [, "text" [, timeout]] )

#