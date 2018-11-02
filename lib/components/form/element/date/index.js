import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import withValidationClasses from '../../../../hoc/withValidationClasses';
import DatePicker from './datepicker';

/**
 * Form Element Date - Displays a jQuery UI datepicker
 */

class FormElementDate extends React.Component {
    // can grab value from DatePicker onChange here
    handleChange(value) {
        // placeholder for something more useful
        console.log(value);
    }

    render() {
        return (
            <DatePicker {...this.props} onChange={this.handleChange} />
        );
    }
}

FormElementDate.defaultProps = {
    id: '',
    readOnly: false,
    openOnInit: false,
    disabled: false,
    className: '',
    required: false,
    placeholder: '',
    maxDate: null,
    dateFormat: 'yy-mm-dd',
    defaultClasses: ['calendar', 'calendarMedium'],
    onRef: () => {},
    onChange: () => {},
};

FormElementDate.propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    onRef: PropTypes.func,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    defaultClasses: PropTypes.arrayOf(PropTypes.string),
    openOnInit: PropTypes.bool,
};

// compose component with HOC
module.exports = compose(
    withValidationClasses
)(FormElementDate);
