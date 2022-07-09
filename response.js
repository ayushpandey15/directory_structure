exports.sendCustomResponse = sendCustomResponse;

function sendCustomResponse(res, message, code, data) {
    let response = {
      message: message,
      status : code,
      data   : data || {},
    };
    res.status(code || 200).send(JSON.stringify(response));
}