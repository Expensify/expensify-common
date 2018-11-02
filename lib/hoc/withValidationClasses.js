import React from 'react';

const withValidationClasses = WrappedComponent => class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validationClasses: ''
        };
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
        console.log('Updating Child with props... ', this.state.validationClasses);
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
