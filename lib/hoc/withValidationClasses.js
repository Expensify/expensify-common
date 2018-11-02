import React from 'react';
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
        const validationClasses = cn(this.state.validationClasses, UI.ERROR);
        console.log(validationClasses);
        this.setState({validationClasses}, () => { console.log(this.state); });
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
