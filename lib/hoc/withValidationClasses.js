import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const withValidationClasses = WrappedComponent => class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validationClasses: ''
        };
    }

    showError() {
        // eslint-disable-next-line
        this.setState({validationClasses: cn(this.state.validationClasses, UI.ERROR)});
    }

    clearError() {
        this.setState({validationClasses: ''});
    }

    render() {
        return (
            <WrappedComponent validationClasses={this.state.validationClasses} {...this.props} />
        );
    }
};

withValidationClasses.propTypes = {
    extraClasses: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object
    ]
    )
};

export default withValidationClasses;
