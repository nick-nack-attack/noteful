import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import NotefulContext from '../NotefulContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons'

import NotePageMain from '../NotePageMain/NotePageMain';
import NotePageNav from '../NotePageNav/NotePageNav';
import AddFolder from '../addFolder/addFolder';
import AddNote from '../addNote/addNote';
import EditNote from '../editNote/editNote';
import NoteListNav from '../NoteListNav/NoteListNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import ErrorBoundary from '../errorHandlers/errorBoundary';
import config from '../config'
import './App.css';

class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            folders: [],
            error: null,
            errorBoundaryKey: 0
        };
    }

    handleBackButton = () => {
        this.setState(
            prevState => ({
                errorBoundaryKey: prevState.errorBoundaryKey + 1
            }),
            console.clear()
        );
    };

    handleAddFolder = folder => {
        this.setState({
            folders: [...this.state.folders, folder]
        });
    };

    handleAddNote = note => {
        this.setState({
            notes: [...this.state.notes, note]
        });
    };

    handleEditNote = note => {
        this.setState({
            notes: [...this.state.notes, note]
        })
    }

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_NOTES}`),
            fetch(`${config.API_FOLDERS}`)
        ])
        .then( ([notesRes, foldersRes]) => {
            if(!notesRes.ok)
                return notesRes.json().then(e=>Promise.reject(e));
            if(!foldersRes.ok)
                return foldersRes.json().then(e=>Promise.reject(e));

            return Promise.all([notesRes.json(), foldersRes.json()]);
        })
        .then(([notes, folders]) => {
            folders.map(folder => {
                return this.handleAddFolder(folder);
            });
            notes.map(note => {
                return this.handleAddNote(note);
            });
        })
        .catch( error => {
            this.setState({error: `Couldn't get folders or notes`})
        });
    }

    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        })
    }

    handleDeleteFolder = folderId => {
        this.setState({
            folders: this.state.folders.filter(folder => folder.id !== folderId),
            notes: this.state.notes.filter(note => note.folderid !== folderId)
        });
    };

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route exact key={path} path={path} component={NoteListNav} /> ))}
                    <Route path="/note/:noteId" component={NotePageNav} />     
                    <Route path="/add-folder" component={NotePageNav} />
                    
            </> 
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route exact key={path} path={path} component={NoteListMain} />
                ))}
                <ErrorBoundary key={this.state.errorBoundaryKey}>
                    <Route path="/note/:noteId" render={(props) => <NotePageMain {...props} notes={this.state.notes} /> } />
                </ErrorBoundary>
                    <Route path="/add-folder" component={AddFolder} />
                    <Route path="/add-note" component={AddNote} />
                    <Route path="/edit-note/:noteId" 
                        render = {(routeProps) => {
                            let matchNote = routeProps.match.params.noteId
                            let note = this.state.notes.find(note => note.id == parseInt(matchNote))
                           return <EditNote noteId={matchNote} note={note}/>
                        }}
                    />
                    
            </>
        );
    }
                        
    render() {

        const contextValue = {
            notes: this.state.notes,
            folders: this.state.folders,
            toggle: this.state.toggle,
            toggleErrors: this.handleErrorToggle,
            addNote: this.handleAddNote,
            editNote: this.handleEditNote,
            addFolder: this.handleAddFolder,
            deleteNote: this.handleDeleteNote,
            deleteFolder: this.handleDeleteFolder,
            back: this.handleBackButton
        };

        return (
            <NotefulContext.Provider value={contextValue}>
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>
                        <FontAwesomeIcon icon={faCheckDouble} />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </div>
            </NotefulContext.Provider>
        );
    }
}

export default App;