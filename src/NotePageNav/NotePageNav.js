import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import PropTypes from 'prop-types';
import './NotePageNav.css'
import { findNote, findFolder } from '../notes-helpers';
import NotefulContext from '../NotefulContext';

export default class NotePageNav extends Component {

  static defaultProps = {
    history: {
      goBack: () => {}
    },
    match: {
      params: {}
    }
  }
  
  static contextType = NotefulContext;

  render() {

    const { notes, folders } = this.context
    const { noteId } = this.props.match.params
    const note = findNote( notes, noteId ) || {}
    const folder = findFolder( folders, note.folderid )

    return (
      <div className='NotePageNav'>
        <CircleButton
          tag='button'
          role='link'
          onClick={() => this.props.history.goBack()}
          className='NotePageNav__back-button'
        >
          <FontAwesomeIcon icon='chevron-left' />
          <br />
          Back!
        </CircleButton>
        {folder && (
          <h3 className='NotePageNav__folder-name'>
            {folder.name}
          </h3>
        )}
      </div>
    )
  }

}

NotePageNav.propType = {
  push: PropTypes.func.isRequired
};