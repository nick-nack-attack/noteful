import React, { Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import CircleButton from '../CircleButton/CircleButton'
import NotefulContext from '../NotefulContext'
import { countNotesForFolder } from '../notes-helpers'
import config from '../config'
import './NoteListNav.css'

export default class NoteListNav extends Component {

  static contextType = NotefulContext;

  handleClickDeleteFolder = (folderId) => {
    fetch( config.API_FOLDERS + '/' + folderId, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      },
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(e=>Promise.reject(e))
      }
    })
    .then(() => {
      this.context.deleteFolder(folderId)
    })
    .catch(err => console.log(err))
  }

  render() {

    const { folders= [] } = this.context

  return (

    <div className='NoteListNav'>
      <ul className='NoteListNav__list'>
        {folders.map(folder =>
          <li key={folder.id}>
            <div className='folder__delete__div'>
              <button
                className='folder__delete'
                type='button'
                onClick={() => this.handleClickDeleteFolder(folder.id)}
              >
                <FontAwesomeIcon icon={faTrashAlt}/>
              </button>
              </div>
            <NavLink
              className='NoteListNav__folder-link'
              to={`/folder/${folder.id}`}
            >
              <span className='NoteListNav__num-notes'>
                {countNotesForFolder(this.context.notes, folder.id)}
              </span>
              {folder.folder_name}
            </NavLink>
          </li>
        )}
      </ul>
      <div className='NoteListNav__button-wrapper'>
        <CircleButton
          tag={Link}
          to='/add-folder'
          type='button'
          className='NoteListNav__add-folder-button'
        >
          <FontAwesomeIcon icon={faPlus} />
          <br />
          Folder
        </CircleButton>
      </div>
    </div>
    )
  }
}