export default function clearValue() {
    const element = ReactDOM.findDOMNode(this);
    element.value = '';

    if (typeof this.props.forcedUpdate === 'function') {
        this.props.forcedUpdate();
    }
}
