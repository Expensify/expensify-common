/* globals UI */

import React from 'react';
import _ from 'underscore';
import PropTypes from 'prop-types';
import cn from 'classnames';

/**
 * Step progress bar.
 * @param {array} steps of {id, title}
 * @param {string} currentStep id
 * @return {React.Component}
 */
const StepProgressBar = ({steps, currentStep}) => {
    const currentStepIndex = Math.max(0, _.findIndex(steps, step => step.id === currentStep));
    return (
        <div id="js_steps_progress" className="progress-wrapper">
            <div className="progress">
                {_.map(steps, (step, i) => {
                    // We should change active to UI.ACTIVE
                    let status = currentStepIndex === i ? UI.ACTIVE : '';
                    if (currentStepIndex > i) {
                        status = 'complete';
                    }

                    return (
                        <div key={step.id} className={cn('progress-step', 'js_step', step.id, status)}>
                            <div className="progress-dot">
                                <div className="inner" />
                            </div>
                            <div className="progress-desc">
                                <span className="js_step_title">{step.title}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

StepProgressBar.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentStep: PropTypes.string.isRequired
};

export default StepProgressBar;
