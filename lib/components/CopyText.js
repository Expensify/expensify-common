import React from 'react';
import Clipboard from 'clipboard'
import PropTypes from 'prop-types';

const propTypes = {
    // Callback fired when text has been copied - useful to display UI confirmation
    onSuccess: PropTypes.func,

    // The text to be copied
    textContent: PropTypes.string,

    // Function as a child exposes the copyTextToClipboard fuction
    children: PropTypes.func.isRequired
};

const defaultProps = {
    onSuccess: () => {},
    textContent: '',
};

/**
 * Simple render prop component that encapsulates the Clipboard feature and exposes a function that can be tied to any event
 *
 * @example
 *
 * <React.c.CopyText textContent="I am some text" onSuccess={() => {}}>
 *    {copy => (
 *        <React.c.Button onClick={copy}>
 *            Copy Me!
 *        </React.c.Button>
 *     )}
 * </React.c.CopyText>
 */
class CopyText extends React.Component {
    componentDidMount() {
        this.hiddenLink = document.createElement('a');

        // Sets up the clipboard instance
        this.clipboard = new Clipboard(this.hiddenLink, {
            text: () => this.props.textContent
        });

        // Fires callback when the clipboard has succesfully copied
        this.clipboard.on('success', () => {
            this.props.onSuccess();
        });
    }

    componentWillUnmount() {
        this.clipboard.destroy();
    }

    /**
     * Fires click event on invisible link
     */
    copyTextToClipboard() {
        this.hiddenLink.click();
    }

    render() {
        return this.props.children(() => this.copyTextToClipboard());
    }
}

CopyText.propTypes = propTypes;
CopyText.defaultProps = defaultProps;

export default CopyText;
