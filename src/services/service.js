class Service {
  // the service class have a function which will return an object of responded based on the code running,
  // it can be a message and data for success, or only message for error
  // the respondes then will be send to contorllers to be process

  static handleSuccess = ({
    data = undefined,
    message = "Request Successful",
    statusCode = 200,
  }) => {
    return {
      success: true,
      data,
      message,
      statusCode,
    };
  };

  static handleError = ({ message = "Request Failed", statusCode = 500 }) => {
    return {
      success: false,
      message,
      statusCode,
    };
  };

  // for redirect, the response send to controller will be an url
  static handleRedirect = (url = undefined) => {
    return {
      success: true,
      url,
    };
  };
}

module.exports = Service;
