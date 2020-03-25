import React from 'react'

const NotefulContext = React.createContext({
    notes: [],
    folders: [],
    toggle: false,
    deleteNote: () => {},
    deleteFolder: () => {},
    addFolder: () => {},
    addNote: () => {},
    toggleErrors: () => {},
    throwError: () => {},
    backButton: () => {}
})

export default NotefulContext;