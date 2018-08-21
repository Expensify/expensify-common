function showError() {
    this.setState({error: true});
}

function clearError() {
    this.setState({error: false});
}

export default {
    showError,
    clearError
};
