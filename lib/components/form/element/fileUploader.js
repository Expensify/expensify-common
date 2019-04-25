/* globals ss, PubSub, EVENT, Templates, Log, Url, User, App */

import React from 'react';
import PropTypes from 'prop-types';
import {UI} from '../../../CONST';

const propTypes = {
    buttonText: PropTypes.string.isRequired,

    /**
     * Any existing file chosen previously
     */
    fileName: PropTypes.string,

    /**
     * Triggered when file uploaded
     */
    onChange: PropTypes.func
};

const defaultProps = {
    fileName: '',
    onChange: () => {}
};

/**
 * File uploader
 */
class FileUploader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fileName: props.fileName,
            uploadStatus: props.fileName ? 'js_status_success' : ''
        };
    }

    componentDidMount() {
        // eslint-disable-next-line no-new
        new ss.SimpleUpload({
            button: $(this.refs.upload),
            url: '/api.php',
            multipart: true,
            maxUploads: 1,
            responseType: 'json',
            name: 'file',
            data: {
                command: 'UploadDocument',
                authToken: Url.getParameter('authToken'),
                email: User.getEmail(),
                csrfToken: App.getCSRFToken()
            },
            onSubmit: this.onSubmit,
            onError: this.onError,
            onComplete: (fileName, response) => {
                if (response.jsonCode === 200) {
                    this.onSuccess(response.filenames[0]);
                } else {
                    this.onError();
                }
            }
        });
    }

    /**
     * Called after submitting a file (or when loading an already submitted file).
     *
     * @param {string} fileName
     */
    onSubmit(fileName) {
        const {onChange} = this.props;

        this.setState({
            fileName,
            uploadStatus: 'js_status_uploading'
        });

        onChange(fileName);
    }

    /**
     * Called when file upload had an error.
     *
     * @param {string} fileName
     * @param {string} errorType
     * @param {number} status
     * @param {string} statusText
     */
    onError(fileName, errorType, status, statusText) {
        this.setState({
            fileName: null,
            uploadStatus: 'js_status_error'
        });
        PubSub.publish(EVENT.SETTINGS.REIMBURSEMENT_ACCOUNT.SHOW_ERROR, {
            error: Templates.get(['Settings', 'BankAccount', 'uploadFailed'])
        });
        Log.alert('Add Reimbursement upload error', 0, {errorType, status, statusText});
    }

    /**
     * Called when file upload succeeds.
     *
     * @param {string} fileName
     */
    onSuccess(fileName) {
        const {onChange} = this.props;

        this.setState({
            fileName,
            uploadStatus: 'js_status_success'
        });

        onChange(fileName);
    }

    render() {
        const {buttonText} = this.props;
        const {fileName, uploadStatus} = this.state;
        const hideInputClass = {};

        hideInputClass[UI.HIDDEN] = !fileName;

        return (
            <div>
                <div>
                    <button ref="upload" type="button" className="btn btn-success-outline">{buttonText || 'Upload File'}</button>
                    <span ref="fileUploadStatus" className={React.classNames('file_upload_status', uploadStatus)} />
                </div>
                <div>
                    <input type="text" className={React.classNames('fullWidth', 'center', 'fileUpload', hideInputClass)} value={fileName} disabled />
                </div>
            </div>
        );
    }
}

FileUploader.propTypes = propTypes;
FileUploader.defaultProps = defaultProps;

export default FileUploader;
