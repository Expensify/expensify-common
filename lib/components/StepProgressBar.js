import React from 'react';
import _ from 'underscore';
import PropTypes from 'prop-types';
import cn from 'classnames';
import * as UIConstants from '../CONST';

const stepShape = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

const propTypes = {
    steps: PropTypes.arrayOf(PropTypes.shape(stepShape)).isRequired,
    currentStep: PropTypes.string.isRequired,
};

/**
 * Step progress bar.
 *
 * @param {array} steps of {id, title}
 * @param {string} currentStep id
 *
 * @return {React.Component}
 */
function StepProgressBar({steps, currentStep}) {
    const isCurrentStep = (step) => step.id === currentStep;
    const currentStepIndex = Math.max(0, _.findIndex(steps, isCurrentStep));

    const renderStep = (step, i) => {
        let status = currentStepIndex === i ? UIConstants.UI.ACTIVE : '';
        if (currentStepIndex > i) {
            status = 'complete';
        }

        return (
            <div
                key={step.id}
                className={cn('progress-step', 'js_step', step.id, status)}
            >
                <div className="progress-dot">
                    <div className="inner" />
                </div>
                <div className="progress-desc">
                    <span className="js_step_title">{step.title}</span>
                </div>
            </div>
        );
    };

    return (
        <div
            id="js_steps_progress"
            className="progress-wrapper"
        >
            <div className="progress">{_.map(steps, renderStep)}</div>
        </div>
    );
}

StepProgressBar.propTypes = propTypes;

export default StepProgressBar;
