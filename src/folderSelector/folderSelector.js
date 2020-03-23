import React, { Component } from 'react';

class FolderSelector extends Component {

    render() {

        return (
            <NotefulContext.Consumer>
            <select
                id=''
                name=''
                // onChange={e=>this.}
            >
                <option value='None'>Select one...</option>
                <option>File 1</option>
                <option>File 2</option>
                <option>File 3</option>
            </select>
            </NotefulContext.Consumer>
        )
    }
}

export default FolderSelector