const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondXML = (request, response, status, message, id) => {
  // Write the header
  response.writeHead(status, { 'Content-Type': 'text/xml' });

  // Create our response object
  let responseXML = '<response>';

  // Append our message
  responseXML = `${responseXML} <message>${message}</message>`;

  // Append our id if it exists
  if (id) {
    responseXML = `${responseXML} <id>${id}</id>`;
  }

  // Close our response object
  responseXML = `${responseXML} </response>`;

  // Write and send the response
  response.write(responseXML);
  response.end();
};

const success = (request, response, accepted) => {
  // Create a JSON object with our response
  const responseJSON = {
    message: 'This is a successful response.',
  };

  if (accepted[0] === 'text/xml') {
    // If we are accepting xml, respond with XML using the JSON object's message
    return respondXML(request, response, 200, responseJSON.message);
  }

  // Otherwise we respond with JSON as a default
  return respondJSON(request, response, 200, responseJSON);
};

const badRequest = (request, response, accepted, params) => {
  const responseJSON = {
    message: 'This request has the required parameters.',
  };

  if (!params.valid || params.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true.';
    responseJSON.id = 'badRequest';
    if (accepted[0] === 'text/xml') {
      return respondXML(request, response, 400, responseJSON.message, responseJSON.id);
    }
    return respondJSON(request, response, 400, responseJSON);
  }

  if (accepted[0] === 'text/xml') {
    return respondXML(request, response, 200, responseJSON.message);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const unauthorized = (request, response, accepted, params) => {
  const responseJSON = {
    message: 'You have successfully viewed the content.',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes.';
    responseJSON.id = 'unauthorized';
    if (accepted[0] === 'text/xml') {
      return respondXML(request, response, 401, responseJSON.message, responseJSON.id);
    }
    return respondJSON(request, response, 401, responseJSON);
  }

  if (accepted[0] === 'text/xml') {
    return respondXML(request, response, 200, responseJSON.message);
  }

  return respondJSON(request, response, 200, responseJSON);
};

const forbidden = (request, response, accepted) => {
  const responseJSON = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  if (accepted[0] === 'text/xml') {
    return respondXML(request, response, 403, responseJSON.message, responseJSON.id);
  }
  return respondJSON(request, response, 403, responseJSON);
};

const internal = (request, response, accepted) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  if (accepted[0] === 'text/xml') {
    return respondXML(request, response, 500, responseJSON.message, responseJSON.id);
  }
  return respondJSON(request, response, 500, responseJSON);
};

const notImplemented = (request, response, accepted) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  if (accepted[0] === 'text/xml') {
    return respondXML(request, response, 501, responseJSON.message, responseJSON.id);
  }
  return respondJSON(request, response, 501, responseJSON);
};

const notFound = (request, response, accepted) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  if (accepted[0] === 'text/xml') {
    return respondXML(request, response, 404, responseJSON.message, responseJSON.id);
  }

  return respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
