import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import NotefulContext from '../NotefulContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import { findNote } from '../notes-helpers'
import config from '../config'
import './NotePageMain.css'

export default class NotePageMain extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      id: this.props.match.params.noteId
    }
  }

  static defaultProps = {
    match: {
      params: {}
    }
  }
  static contextType = NotefulContext

  handleDeleteNote = noteId => {
    this.props.history.push(`/`)
  }

  handleClickDelete = (noteId) => {
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
      this.handleDeleteNote()
    })
    .catch(err => console.log(err))
  }

  render() {
    const { notes=[] } = this.context
    const { noteId } = this.props.match.params
    console.log(notes, noteId)
    const note = findNote(notes, parseInt(noteId)) || { content: '' }

    return (
      <section className='NotePageMain'>
        <h1>{note.note_name}</h1>
        <h2>Modified { note.modified && format(new Date(note.modified), 'MMM dd, yyyy') }</h2>
        <div className='NotePageMain__content'>
          {note.content.split(/\n \r|\n/).map((para, i) =>
            <p key={i}>{para}</p>
          )}
        </div>
        <button 
          
          type='button'
          onClick={() => this.handleClickDelete(note.id)}
        >
          <FontAwesomeIcon icon={faTrashAlt}/>
          {' '}
          remove
        </button>
      </section>
    )
  }
}