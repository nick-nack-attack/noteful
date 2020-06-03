import React, { Component } from 'react'
import NotefulContext from '../NotefulContext'
import NotefulForm from '../NotefulForm/NotefulForm'
import ErrMsg from '../errorMessage';
import config from '../config'
import './editNote.css'

export default class EditNote extends Component {

    static contextType = NotefulContext;

    state = {
        id: null,
        title: '',
        titleTouched: false,
        content: '',
        contentTouched: false,
        folderSelected: '',
        selectedFolderId: null,
        folderId: null,
        folderSelectedTouched: false,
        error: null
    };

    updateForm(event) {
        
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
            [`${name}Touched`]: true
        })
    }

    validateEntry(key, value) {

        if (value !== '') {
            value = value.trim();
        }

        if ((key === 'note_name') || (key === 'content')) {
            if (value.length < 1) {
                return 'Note name and content are required'
            }
        } else if ( (key === 'folderSelect') && (value === 'Select') ) {
            return 'Folder must be selected'
        }
    }

    componentDidMount() {
        const passedInNoteId = this.props.noteId
        const noteLocation = config.API_NOTES + '/' + passedInNoteId
        fetch(noteLocation, {method: 'GET'})
            .then(res => {
                if (!res.ok) { 
                    return res.json().then(error => Promise.reject(error)) 
                } 
                return res.json() 
            })
            .then(resData => {
                this.setState({
                    id: resData.id,
                    title: resData.note_name,
                    folderId: resData.folderid,
                    content: resData.content
                })
                
            })
            .then(res => {
                const folder_id = this.state.folderId
                fetch((config.API_FOLDERS + '/' + folder_id), {method: 'GET'})
                .then(res => {
                    if (!res.ok) { return res.json().then(error => Promise.reject(error)) } return res.json() })
                    .then(res => {
                        this.setState({
                            folderSelected: res
                        })
                    })
            })
    }

    goBack = () => {
        window.location.href = '/'
    };

    reducefields = (array) => {
        return array.reduce((result, item) => {
            let key = Object.keys(item)[0];
            result[key] = item[key];
            return result;
        })
    }

    sendChangedFields = (object) => {
        const noteUrl = config.API_NOTES + '/' + this.state.id;
        fetch(noteUrl, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(object),
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => Promise.reject(error))}
        })
        .then((note) => {
            this.context.editNote(note);
            window.location.href = '/'
        })
        .catch(error => {
            this.setState({ error })
        })
        
    };

    handleSubmit = e => {
        e.preventDefault();
        const { titleTouched, contentTouched, selectedFolderIdTouched } = this.state
        const updatedFields = [];
        const updatedNote = {
        }
        if (titleTouched) { updatedFields.push({note_name: this.state.title}) }
        else if (contentTouched) { updatedFields.push({content: this.state.content}) }
        else if (selectedFolderIdTouched) { updatedFields.push({ folderid: this.state.selectedFolderIdTouched }) }

        if ( updatedFields.length === 0 ) {
            this.goBack()
        } else (
            this.sendChangedFields(this.reducefields(updatedFields)) 
        )

        /*
        const updatedNote = {
            id: this.state.id.value,
            note_name: this.state.note_name.value,
            content: this.state.content.value,
            folderid: this.state.folder.folderid
        }
        
        fetch((config.API_NOTES + '/' + this.state.id.value), {
            method: 'PATCH',
            body: JSON.stringify(updatedNote),
            headers: { 'content-type': 'application/json' }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => Promise.reject(error))}
        })
        .then((note) => {
            this.context.editNote(note);
            window.location.href = '/'
        })
        .catch(error => {
            this.setState({ error })
        })
        */
    };

    render() {
        const folders = this.context.folders || [];
        const folderOptions = folders.length === 0 
            ? <option>Select ...</option>
            : folders.map(folder => {
             return (
                <option 
                    id={folder.id} 
                    value={folder.id}
                    selected={this.state.folderSelected.id === folder.id}
                >
                    { folder.folder_name }
                </option>)
            })

        return (

            <div className='addNote__div'>
                <h2>Edit Note</h2>
                <NotefulForm
                onSubmit={e => this.handleSubmit(e)}
                >
                    <div className='addNote__field'>
                        <label htmlFor='note-name-input'>Name</label>
                            
                        <input
                            id='note-name-input'
                            name='title'
                            type='text'
                            className='field'
                            aria-label='Name'
                            aria-required='true'
                            value={this.state.title}
                            onChange={e => this.updateForm(e)}
                        />
                    </div>
                    <div className='addNote__field'>
                        <label htmlFor='note-content-input'>Content</label>
                            {/* {this.state.content.touched && ( <ErrMsg msg={this.validateEntry()} /> )} */}
                        <textarea
                            id='note-content-input'
                            name='content'
                            className='field'
                            defaultValue={this.state.content}
                            rows={4}
                            onChange={e => this.updateForm(e)}
                        />
                    </div>
                    <div className='addNote__field'>
                        <label htmlFor='note-folder-select'>Folder</label>
                            
                        <select 
                            id="note-folder-select"
                            name="selectedFolderId"
                            // ref={this.state.folder.folderSelected}
                            type="text"
                            className="field"
                            defaultValue={this.state.folderSelected}
                            onChange={e => this.updateForm(e)}
                        >
                                { folderOptions }

                        </select>
                    </div>
                    <div
                        className='AddNote__buttons'    
                    >
                        <button
                            type='button'
                            className='addNote__button'
                            onClick={ () => this.goBack() } >
                                Cancel
                        </button>
                        <button
                            type='submit'
                            className='addNote__button'   
                        >   
                                Save
                        </button>
                    </div>
                </NotefulForm>
            </div>
        )
    }
}

EditNote.defaultProps = {
    history: {
        goBack: () => {}
    }
}