import React, { Component } from 'react';
import NotefulContext from '../NotefulContext';

class ThrowError extends Component {

    static contextType = NotefulContext;

    updateContextErr(e) {
      let value = e.target;
    }

    render() {
      return (
      <div>
          <button onClick={(e) => this.updateContextErr(e)}>Toggle</button>
          <p>click button to toggle errors when clicking <br/>
          the add folder or note</p>
      </div>
      );
    }
  }

  export default ThrowError