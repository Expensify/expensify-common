import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const withExtraClasses = WrappedComponent => class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: cn(props.extraClasses || [])
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({classes: cn(nextProps.extraClasses || [])});
    }

    render() {
        return (
            <WrappedComponent className={this.state.classes} {...this.props} />
        );
    }
};

withExtraClasses.propTypes = {
    extraClasses: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object
    ]
    )
};

export default withExtraClasses;
