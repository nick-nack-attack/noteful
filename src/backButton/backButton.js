import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotefulContext from '../NotefulContext';
import './backButton.css';

class backButton extends Component {

    static contextType = NotefulContext;

    render() {

        return (

            <button 
            className='backButton' 
            onclick = { this.context.back }
            >
                Back
            </button>
        )
    }
}
 export default backButton

 backButton.propTypes = {
     goBack: PropTypes.func
 }