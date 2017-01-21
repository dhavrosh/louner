exports.sendJSONresponse = (res, code, content) => {
    res.status(code).json(content);
};
