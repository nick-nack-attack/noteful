import React from 'react'

const NotefulContext = React.createContext({
    notes: [],
    folders: [],
    toggle: false,
    deleteNote: () => {},
    deleteFolder: () => {},
    addFolder: () => {},
    addNote: () => {},
    editNote: () => {},
    toggleErrors: () => {},
    throwError: () => {},
    backButton: () => {}
})

export default NotefulContext;