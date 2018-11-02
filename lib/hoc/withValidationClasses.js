import React from 'react';

const withValidationClasses = WrappedComponent => class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validationClasses: ''
        };
        this.showError = this.showError.bind(this);
        this.clearError = this.clearError.bind(this);
    }

    showError() {
        // eslint-disable-next-line
        const validationClasses = UI.ERROR;
        this.setState({validationClasses});
    }

    clearError() {
        this.setState({validationClasses: ''});
    }

    render() {
        return (
            <WrappedComponent
                showError={this.showError}
                clearError={this.clearError}
                validationClasses={this.state.validationClasses}
                {...this.props}
            />
        );
    }
};

export default withValidationClasses;
