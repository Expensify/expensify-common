import React from 'react';
import cn from 'classnames';

const withExtraClasses = WrappedComponent => class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            extraClasses: cn(props.extraClasses || [])
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({classes: cn(nextProps.extraClasses || [])});
    }

    render() {
        return (
            <WrappedComponent extraClasses={this.state.extraClasses} {...this.props} />
        );
    }
};

export default withExtraClasses;
