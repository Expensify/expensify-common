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

    enhance(instance) {
        // eslint-disable-next-line
        instance.showError = this.showError.bind(instance);
        // eslint-disable-next-line
        instance.clearError = this.clearError.bind(instance);
    }

    showError() {
        // eslint-disable-next-line
        this.setState({validationClasses: cn(this.state.validationClasses, UI.ERROR)});
    }

    clearError() {
        this.setState({validationClasses: ''});
    }

    render() {
        return this.enhance(
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
