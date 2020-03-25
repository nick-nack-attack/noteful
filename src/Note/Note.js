import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

  // Now handle the click delete. It has one argument, event.
  handleClickDelete = () => {
    // this variable is set to whatever the passed in noteId is
    const noteId = this.props.id
    // Now update the database
    // Fetch using the config file to get the url to the database and the location will be adding /notes/ and the note's id
    // The second argument includes the method and header(s)
    fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
      // The method is deleting (a note)
      method: 'DELETE',
      // This header says what type of content it is — which it's application/json type.
      headers: {
        'content-type': 'application/json'
      },
    })
    // Then, handle the response.
    .then( res => {
      // If the response okay is false ...
      if (!res.ok) {
        // ... return the reponse, convert it to json, then have Promise handle the rejection by passing the error in.
        return res.json().then(e=>Promise.reject(e))
      // Otherwise, if the response is okay, return the response and convert it to json.
      }
    })
    // run an anonymous function
    .then( () => {
      // run the function in the context, pass in the noteId
      this.context.deleteNote(noteId)
      // Allow parent to perform another behavior.
      this.props.onDeleteNote(noteId)
    })
    // console log if anything here goes wrong
    .catch(error=>console.log(error))
  }

  render() {

    // these are the values being passed in as props
    const { id, name, modified } = this.props

    return (

      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/note/${id}`}>
            {name}
          </Link>
        </h2>
        <button 
          className='Note__delete' 
          type='button'
          onClick={this.handleClickDelete}
        >
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
            { format(new Date(this.props.modified), 'MMM dd, yyyy') }
            </span>
          </div>
        </div>
      </div>
    )
  }
}

Note.propType = {
  onDeleteNote: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
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
