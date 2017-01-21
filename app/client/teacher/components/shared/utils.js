function showAlert(apply, type, message, timeOut) {
    const alert = {
        type,
        message,
        timeOut,
        show: true
    };

    apply(alert);
}