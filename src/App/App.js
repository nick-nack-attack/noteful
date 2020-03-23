import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NotePageMain from '../NotePageMain/NotePageMain';
import NotePageNav from '../NotePageNav/NotePageNav';
import AddFolder from '../addFolder/addFolder';
import NotefulForm from '../NotefulForm/NotefulForm'
import AddNote from '../addNote/addNote';
import NoteListNav from '../NoteListNav/NoteListNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotefulContext from '../NotefulContext'
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import config from '../config'
import './App.css';

class App extends Component {
    
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
        // fake date loading from API call
        // setTimeout(() => this.setState(STORE), 600);
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
        ])
        .then( ([notesRes, foldersRes]) => {
            if(!notesRes.ok)
                return notesRes.json().then(e=>Promise.reject(e));
            if(!foldersRes.ok)
                return foldersRes.json().then(e=>Promise.reject(e));

            return Promise.all( [notesRes.json(), foldersRes.json()] );
        })
        .then( ([notes, folders]) => {
            this.setState({
                notes,
                folders
            })
        })
        .catch( error => {
            console.log({error})
        });
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        })
    }

    addFolder = folder => {
        this.setState({
            folders: [...this.state.folders, folder]
        })
    }

    addNote = note => {
        this.setState({
            notes: [...this.state.notes, note]    
        })
    } 

    renderNavRoutes() {
        const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => (
                            <NoteListNav
                                folders={folders}
                                notes={notes}
                                {...routeProps}
                            />
                        )}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId) || {};
                        const folder = findFolder(folders, note.folderId);
                        return <NotePageNav {...routeProps} folder={folder} />;
                    }}
                />
                <Route path="/add-folder" component={AddFolder} />
               </> 
        );
    }

    renderMainRoutes() {
        const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => {
                            const {folderId} = routeProps.match.params;
                            const notesForFolder = getNotesForFolder(
                                notes,
                                folderId
                            );
                            return (
                                <NoteListMain
                                    {...routeProps}
                                    notes={notesForFolder}
                                />
                            );
                        }}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId);
                        return <NotePageMain {...routeProps} note={note} />;
                    }}
                />
                <Route path="/add-note" component={AddNote} />
            </>
        );
    }

    render() {

        const contextValue = {
            notes: this.state.notes,
            folders: this.state.folders,
            addFolder: this.addFolder,
            addNote: this.addNote,
            deleteNote: this.handleDeleteNote,
        }

        return (
            <NotefulContext.Provider value={contextValue}>
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </div>
            </NotefulContext.Provider>
        );
    }
}

export default App;