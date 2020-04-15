import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './NotePageMain.css'
import NotefulContext from '../NotefulContext';
import Note from '../Note/Note';
import { findNote } from '../notes-helpers';

export default class NotePageMain extends Component {

  state = {
    forErrors: this.props.match,
    toggle: true,
  }

  static defaultProps = {
    match: {
      params: {}
    }
  }

  static contextType = NotefulContext;

  handleDeleteNote = note_id => {
    this.props.history.push('/')
  }

  render () {
    const { notes=[] } = this.context
    const { noteId } = this.state.forErrors.params
    const note = findNote(notes, noteId) || { content: ''}
    
    console.log('this is passed in NOTE_ID', noteId);
    console.log('these are notes', notes);
    console.log('this is note', note);

      if(this.state.toggle === false) {
        this.setState({
          forErrors: 'err'
        })
        this.setState({
          forErrors: this.props.match
        })
      }

  return (

    <section className='NotePageMain'>
      <Note
        id={note.id}
        name={note.note_name}
        modified={note.modified}
        onDeleteNote={this.handleDeleteNote}
      />
      <div className='NotePageMain__content'>
        {note.content.split(/\n \r|\n/).map((para, i) =>
          <p key={i}>{para}</p>
        )}
      </div>
    </section>
  )
  }
}

NotePageMain.defaultProps = {
  note: {
    content: '',
  }
}