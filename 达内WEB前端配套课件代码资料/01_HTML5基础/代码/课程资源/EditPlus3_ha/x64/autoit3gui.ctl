#TITLE=AutoIt3 GUI Reference
#INFO
EditPlus cliptext library file for AutoIt 3.2.12.0
Cliptext by Brett Pantalone <pantalone2001 at yahoo dot com>

#SORT=n

#T=GUICreate
;Create a GUI window. 
GUICreate( ^!^!"title" [, width [, height [, left [, top [, style [, exStyle [, parent]]]]]]] )
#T=GUICtrlCreateAvi
;Creates an AVI video control for the GUI. 
GUICtrlCreateAvi( ^!^!filename, subfileid, left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateButton
;Creates a Button control for the GUI. 
GUICtrlCreateButton( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateCheckbox
;Creates a Checkbox control for the GUI. 
GUICtrlCreateCheckbox( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateCombo
;Creates a ComboBox control for the GUI. 
GUICtrlCreateCombo( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateContextMenu
;Creates a context menu for a control or entire GUI window. 
GUICtrlCreateContextMenu( ^![controlID] )
#T=GUICtrlCreateDate
;Creates a date control for the GUI. 
GUICtrlCreateDate( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateDummy
;Creates a Dummy control for the GUI. 
GUICtrlCreateDummy( )
#T=GUICtrlCreateEdit
;Creates an Edit control for the GUI. 
GUICtrlCreateEdit( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateGraphic
;Creates a Graphic control for the GUI. 
GUICtrlCreateGraphic( ^!left, top [, width [, height [, style]]] )
#T=GUICtrlCreateGroup
;Creates a Group control for the GUI. 
GUICtrlCreateGroup( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateIcon
;Creates an Icon control for the GUI. 
GUICtrlCreateIcon( ^!filename, iconName, left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateInput
;Creates an Input control for the GUI. 
GUICtrlCreateInput( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateLabel
;Creates a static Label control for the GUI. 
GUICtrlCreateLabel( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateList
;Creates a List control for the GUI. 
GUICtrlCreateList( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateListView
;Creates a ListView control for the GUI. 
GUICtrlCreateListView( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateListViewItem
;Creates a ListView item. 
GUICtrlCreateListViewItem( ^!"text", listviewID )
#T=GUICtrlCreateMenu
;Creates a Menu control for the GUI. 
GUICtrlCreateMenu( ^!"submenutext" [, menuID [, menuentry]] )
#T=GUICtrlCreateMenuItem
;Creates a MenuItem control for the GUI. 
GUICtrlCreateMenuItem( ^!"text", menuID [, menuentry [, menuradioitem]] )
#T=GUICtrlCreateMonthCal
;Creates a month calendar control for the GUI. 
GUICtrlCreateMonthCal( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateObj
;Creates an ActiveX control in the GUI. 
GUICtrlCreateObj( ^!$ObjectVar, left, top [, width [, height ]] )
#T=GUICtrlCreatePic
;Creates a Picture control for the GUI. 
GUICtrlCreatePic( ^!filename, left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateProgress
;Creates a Progress control for the GUI. 
GUICtrlCreateProgress( ^!left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateRadio
;Creates a Radio button control for the GUI. 
GUICtrlCreateRadio( ^!"text", left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateSlider
;Creates a Slider control for the GUI. 
GUICtrlCreateSlider( ^!left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateTab
;Creates a Tab control for the GUI. 
GUICtrlCreateTab( ^!left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateTabItem
;Creates a TabItem control for the GUI. 
GUICtrlCreateTabItem( ^!"text" )
#T=GUICtrlCreateTreeView
;Creates a TreeView control for the GUI. 
GUICtrlCreateTreeView( ^!left, top [, width [, height [, style [, exStyle]]]] )
#T=GUICtrlCreateTreeViewItem
;Creates a TreeViewItem control for the GUI. 
GUICtrlCreateTreeViewItem( ^!"text", treeviewID )
#T=GUICtrlCreateUpdown
;Creates an UpDown control for the GUI. 
GUICtrlCreateUpdown( ^!inputcontrolID [,style] )
#T=GUICtrlDelete
;Deletes a control. 
GUICtrlDelete( ^!controlID )
#T=GUICtrlGetHandle
;Returns the handle for a control and some special (item) handles (Menu, ContextMenu, TreeViewItem). 
GUICtrlGetHandle( ^!controlID )
#T=GUICtrlGetState
;Gets the current state of a control 
GUICtrlGetState( ^![controlID] )
#T=GUICtrlRead
;Read state or data of a control. 
GUICtrlRead( ^!controlID [, advanced] )
#T=GUICtrlRecvMsg
;Send a message to a control and retrieve information in lParam. 
GUICtrlRecvMsg( ^!controlID , msg [, wParam [, lParamType]] )
#T=GUICtrlRegisterListViewSort
;Register a user defined function for an internal listview sorting callback function. 
GUICtrlRegisterListViewSort( ^!controlID, "function" )
#T=GUICtrlSendMsg
;Send a message to a control. 
GUICtrlSendMsg( ^!controlID, msg , wParam, lParam )
#T=GUICtrlSendToDummy
;Sends a message to a Dummy control. 
GUICtrlSendToDummy( ^!controlID [, state] )
#T=GUICtrlSetBkColor
;Sets the background color of a control. 
GUICtrlSetBkColor( ^!controlID, backgroundcolor )
#T=GUICtrlSetColor
;Sets the text color of a control. 
GUICtrlSetColor( ^!controlID, textcolor)
#T=GUICtrlSetCursor
;Sets the mouse cursor icon for a particular control. 
GUICtrlSetCursor( ^!controlID, cursorID )
#T=GUICtrlSetData
;Modifies the data for a control. 
GUICtrlSetData( ^!controlID, data [, default] )
#T=GUICtrlSetDefBkColor
;Sets the default background color of all the controls of the GUI window. 
GUICtrlSetDefBkColor( ^!color [, winhandle] )
#T=GUICtrlSetDefColor
;Sets the default text color of all the controls of the GUI window. 
GUICtrlSetDefColor( ^!deftextcolor [, winhandle] )
#T=GUICtrlSetFont
;Sets the font for a control. 
GUICtrlSetFont(controlID, size [, weight [, attribute [, fontname]]] )
#T=GUICtrlSetGraphic
;Modifies the data for a control. 
GUICtrlSetGraphic( ^!controlID, type [, par1 [, ... par6]] )
#T=GUICtrlSetImage
;Sets the bitmap or icon image to use for a control. 
GUICtrlSetImage( ^!controlID, filename [, iconname [, icontype]] )
#T=GUICtrlSetLimit
;Limits the number of characters/pixels for a control. 
GUICtrlSetLimit( ^!controlID, max [, min] )
#T=GUICtrlSetOnEvent
;Defines a user-defined function to be called when a control is clicked. 
GUICtrlSetOnEvent( ^!controlID, "function" )
#T=GUICtrlSetPos
;Changes the position of a control within the GUI window. 
GUICtrlSetPos( ^!controlID, left, top [, width [, height]] )
#T=GUICtrlSetResizing
;Defines the resizing method used by a control. 
GUICtrlSetResizing( ^!controlID, resizing )
#T=GUICtrlSetState
;Changes the state of a control. 
GUICtrlSetState( ^!controlID, state )
#T=GUICtrlSetStyle
;Changes the style of a control. 
GUICtrlSetStyle( ^!controlID, style [, exStyle] )
#T=GUICtrlSetTip
;Sets the tip text associated with a control. 
GUICtrlSetTip( ^!controlID, tiptext [, "title" [, icon [, options]]]]] )
#T=GUIDelete
;Deletes a GUI window and all controls that it contains. 
GUIDelete( ^![winhandle] )
#T=GUIGetCursorInfo
;Gets the mouse cursor position relative to GUI window. 
GUIGetCursorInfo( ^![winhandle] )
#T=GUIGetMsg
;Polls the GUI to see if any events have occurred. 
GUIGetMsg( ^![advanced] )
#T=GUIGetStyle
;Retrieves the styles of a GUI window. 
GUIGetStyle( ^![ winhandle] )
#T=GUIRegisterMsg
;Register a user defined function for a known Windows Message ID (WM_MSG). 
GUIRegisterMsg( ^!msgID, "function" )
#T=GUISetAccelerators
;Sets the accelerator table to be used in a GUI window. 
GUISetAccelerators( ^!accelerators [, winhandle] )
#T=GUISetBkColor
;Sets the background color of the GUI window. 
GUISetBkColor( ^!background [, winhandle] )
#T=GUISetCoord
;Sets absolute coordinates for the next control. 
GUISetCoord( ^!left, top [, width [, height [, winhandle]]] )
#T=GUISetCursor
;Sets the mouse cursor icon for a GUI window. 
GUISetCursor( ^![cursorID [, override [, winhandle]]] )
#T=GUISetFont
;Sets the default font for a GUI window. 
GUISetFont(size [, weight [, attribute [, fontname [, winhandle]]]] )
#T=GUISetHelp
;Sets an executable file that will be run when F1 is pressed. 
GUISetHelp( ^!helpfile [, winhandle] )
#T=GUISetIcon
;Sets the icon used in a GUI window. 
GUISetIcon( ^!iconfile [, iconID [, winhandle]] )
#T=GUISetOnEvent
;Defines a user function to be called when a system button is clicked. 
GUISetOnEvent( ^!specialID, "function" [, winhandle] )
#T=GUISetState
;Changes the state of a GUI window. 
GUISetState( ^![flag [, winhandle]] )
#T=GUISetStyle
;Changes the styles of a GUI window. 
GUISetStyle( ^!Style [,ExStyle [, winhandle]] )
#T=GUIStartGroup
;Defines that any subsequent controls that are created will be "grouped" together. 
GUIStartGroup( ^![winhandle] )
#T=GUISwitch
;Switches the current window used for GUI functions. 
GUISwitch( ^!winhandle [, tabitemID] )
