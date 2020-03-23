import React, { Component } from 'react';
import NotefulContext from '../NotefulContext'
import ValidationError from '../validationError'
import config from '../config'
import './addFolder.css'

// This variable is to make something required
const Required = () => {
    return <span className='AddBookmark__required'>*</span>
}

class AddFolder extends Component {

    static contextType = NotefulContext;
    
    constructor(props) {
        super(props);
        this.state = {
            folderName: {
                value: '',
                touched: false,
            },
            error: null,
        }
    }

    generateNewFolderId = () => {
        // b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1
        const id = Math.random().toString(36).substr(2, 8)
        const idTotal = id + '-ffaf-11e8-8eb2-f2801f1b9fd1'
        return idTotal
    }

    handleSubmit = (e) => {
        // Prevent default form functionality
        e.preventDefault();
        const folderName = this.state.folderName.value;
        const newId = this.generateNewFolderId();
        const newFolder = {
            id: newId,
            name: folderName
        }
        // Set error to null
        this.setState({error:null})
        // Send this new data to server
        
        
        fetch(config.ADD_FOLDER, {
            method: 'POST',
            body: JSON.stringify(newFolder),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error=> {
                    throw error
                })
            }
            return res.json()
        })
        .then(data => {
            this.props.history.push('/')
            this.context.addFolder(data)
        })
        .catch(error => {
            this.setState({error})
        })
    
    }
    
    handleClickCancel = () => {
        this.props.history.push('/')
    };
        

    updateNewFolderName = (folderName) => {
        this.setState({folderName: {value: folderName, touched: true}})
        console.log(folderName)
    }

    validateFolderName = () => {
        const folderName = this.state.folderName.value.trim();
        if (folderName.length === 0) {
            return "Name is required"
        } else if (folderName.length > 10) {
            return "Must be less than 10 characters"
        } 
    }
    
    render() {

        const folderNameError = this.validateFolderName();
        const { error } = this.state

        return (

            <div className='addFolder__div'>
            <h3>New Folder</h3>
            <form 
                className='addFolder__form'
                onSubmit={this.handleSubmit}
            >
                <div>
                    Between 1-10 characters
                </div>
                <div 
                    className='AddFolder__error' 
                    role='alert'
                >
                    {error && <p>{error.message}</p>}
                </div>
                <div>
                <label htmlFor='name'>New Folder Name {' '} <Required/></label>
                    <input
                        type='text'
                        className='newFolder__input'
                        name='name'
                        id='name'
                        placeholder ='ex. Recipes'
                        required
                        onChange={e=>this.updateNewFolderName(e.target.value)}
                    />
                    {this.state.folderName.touched && <ValidationError message={folderNameError}/>}
                    <div className='AddFolder__buttons'>
                        <button 
                            type='button' 
                            onClick={this.handleClickCancel} 
                        >
                            Cancel
                        </button>
                        {' '}
                        <button
                            type='submit'
                            className='addNewFolder__button'
                            disabled={this.validateFolderName()}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </form>
            </div>
        )
    }
}

export default AddFolder