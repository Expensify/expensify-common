/* globals React, ss, PubSub, EVENT, Templates, Log, UI, Url, User, App */

/**
 * File uploader
 */
module.exports = window.CreateClass({
    propTypes: {
        buttonText: window.PropTypes.string,
        /**
         * Any existing file chosen previously
         */
        fileName: window.PropTypes.string,

        /**
         * Triggered when file uploaded
         */
        onChange: window.PropTypes.func,

        /**
         * Triggered when file upload completed
         */
        onComplete: window.PropTypes.func,

        onSubmit: window.PropTypes.func,

        onError: window.PropTypes.func,

        /**
         * Data attributes needed by the uploader
         */
        data: window.PropTypes.Object,
    },

    getDefaultProps() {
        return {
            onChange: () => {},
            onComplete: () => {},
            data: {
                csrfToken: App.getCSRFToken()
            },
        };
    },

    getInitialState() {
        return {
            fileName: this.props.fileName,
            uploadStatus: this.props.fileName ? 'js_status_success' : ''
        };
    },

    componentDidMount() {
        // eslint-disable-next-line no-new
        new ss.SimpleUpload({
            button: $(this.refs.upload),
            hoverClass: 'hover',
            url: '/api.php',
            multipart: true,
            multiple: false,
            maxUploads: 1,
            responseType: 'json',
            name: '',
            data: this.props.data,
            onChange: this.props.onChange,
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
    },

    /**
     * Called after submitting a file (or when loading an already submitted file).
     *
     * @param {string} fileName
     */
    onSubmit(fileName) {
        this.setState({
            fileName,
            uploadStatus: 'js_status_uploading'
        });
        this.props.onSubmit(filename);
    },

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
        this.props.onError(fileName, errorType, status, statusText);
    },

    /**
     * Called when file upload succeeds.
     *
     * @param {string} fileName
     */
    onSuccess(fileName) {
        this.setState({
            fileName,
            uploadStatus: 'js_status_success'
        });
        this.props.onSuccess(fileName);
    },

    render() {
        const hideInputClass = {};
        hideInputClass[UI.HIDDEN] = !this.state.fileName;

        return (
            <div>
                <div>
                    <button ref="upload" className="btn btn-success-outline">{this.props.buttonText || 'Upload File'}</button>
                    <span ref="fileUploadStatus" className={React.classNames('file_upload_status', this.state.uploadStatus)} />
                </div>
                <div>
                    <input type="text" className={React.classNames('fullWidth', 'center', 'fileUpload', hideInputClass)} value={this.state.fileName} disabled />
                </div>
            </div>
        );
    }
});
