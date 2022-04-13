class Service {
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

  static handleRedirect = (url = undefined) => {
    return {
      success: true,
      url,
    };
  };
}

module.exports = Service;
