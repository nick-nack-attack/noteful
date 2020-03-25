import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import backButton from '../backButton/backButton';
import './errorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }


static getDerivedStateFromError(error) {
    return { hasError: true }
}

render() {
    if (this.state.hasError) {      
        return (
            <>
            <p className="err_msg">
                <strong>looks like something went wrong</strong>
            </p>
            <Route
                path='/'
                component={backButton}
            />
            
            </>
        );
      }
      return this.props.children;
}
}

export default ErrorBoundary

ErrorBoundary.propTypes = {
hasError: PropTypes.bool
};