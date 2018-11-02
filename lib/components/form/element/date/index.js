import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import withValidationClasses from '../../../../hoc/withValidationClasses';
import withExtraClasses from '../../../../hoc/withExtraClasses';
import DatePicker from './datepicker';

/**
 * Form Element Date - Displays a jQuery UI datepicker
 */

const FormElementDate = props => (
    <DatePicker {...props} onChange={value => console.log(value)} />
);

FormElementDate.defaultProps = {
    id: '',
    readOnly: false,
    openOnInit: false,
    disabled: false,
    className: '',
    required: false,
    placeholder: '',
    maxDate: null,
    dateFormat: 'mm/dd/yy',
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
    withExtraClasses,
    withValidationClasses
)(FormElementDate);
