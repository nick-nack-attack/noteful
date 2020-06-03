import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import NotefulContext from '../NotefulContext'
import config from '../config'
import './Note.css'


export default class Note extends Component {
  
  // Set up a default props with an empty delete function
  static defaultProps ={
    onDeleteNote: () => {},
  }

  // Add a static contextType which is noteful context file
  static contextType = NotefulContext;

  handleClickEdit = () => {
  }

  // Now handle the click delete. It has one argument, event.
  handleClickDelete = () => {
    const noteId = this.props.note.id    
    fetch( config.API_NOTES + '/' + noteId , {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
    .then( res => {
      if (!res.ok) {
        return res.json().then(e=>Promise.reject(e))
      }
    })
    .then( () => {
      this.context.deleteNote(noteId)
      this.props.onDeleteNote(noteId)
    })
    .catch(err => console.log(err))
  }

  render() {

    const { id, note_name, modified, content } = this.props.note
    const { note } = { id, note_name, modified, content }

    return (

      <div className='Note'>
        <Link to={{
          pathname:`/note/${this.props.note.id}`,
          note: note
        }}
        
        >
        <h2 className='Note__title'>
            { note_name }
        </h2>
        </Link>
        <button 
          className='Note__delete' 
          type='button'
          onClick={this.handleClickDelete}
        >
          <FontAwesomeIcon icon={faTrashAlt}/>
          {' '}
          remove
        </button>
        <Link to={{
          pathname:`edit-note/${id}`, 
          theNoteId: id
        }}
        >
        <button
          className='Note__edit'
          type='button'
          onClick={this.handleClickEdit}
        >
          <FontAwesomeIcon icon={faEdit}/>
          {' '}
          edit
        </button>
        </Link>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
            { modified && format(new Date(modified), 'MMM dd, yyyy') }
            </span>
          </div>
        </div>
      </div>
    )
  }
}

Note.propType = {
  onDeleteNote: PropTypes.func.isRequired,
  note_name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  modified: PropTypes.string
};

// new Date("2019-01-03T00:00:00.000Z")
// 

// { format(props.modified, 'Do MMM YYYY') }
// { format(new Date(props.modified), 'MMM dd, yyyy') }

// 2019-01-03T00:00:00.000Z

/*
Wed Jan 02 2019 17:00:00 GMT-0700
(Mountain Standard Time)
*/

// { format(new Date(this.props.modified), 'MMM dd, yyyy') }
