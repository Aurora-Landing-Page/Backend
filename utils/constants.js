const titles = {
  // 1xx Informational
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",

  // 2xx Success
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",

  // 3xx Redirection
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",

  // 4xx Client Errors
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",

  // 5xx Server Errors
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required",
};

// Event payment values according to datetime
const payments = {
  accomodation:           1200,

  day_zero_pronite:       500,    // Till 11:59 PM, 14 Feb 24 (IST)
  day_one_pronite:        700,    // Till 10:00 AM, 16 Feb 24 (IST)
  day_two_pronite:        400,    // Till 10:00 AM, 17 Feb 24 (IST)
  day_three_pronite:      300,    // Till 10:00 AM, 18 Feb 24 (IST)
  // Payments close after 10:00 AM, 18 Feb 24

  day_zero_whole_event:   599,    // Till 11:59 PM, 14 Feb 24 (IST)
  day_one_whole_event:    1000,   // Till 10:00 AM, 16 Feb 24 (IST)
  day_two_whole_event:    700,    // Till 10:00 AM, 17 Feb 24 (IST)
  day_three_whole_event:  500     // Till 10:00 AM, 18 Feb 24 (IST)
  // Payments close after 10:00 AM, 18 Feb 24
}

// All datetimes are handled in UTC
const timeouts = {
  base:        "1970-01-01T00:00:00.000Z",     // Epoch start as baseline
  day_zero:    "2024-03-14T18:29:00.000Z",     // Till 11:59 PM, 14 Feb 24 (IST)
  day_one:     "2024-03-15T04:30:00.000Z",     // Till 10:00 AM, 16 Feb 24 (IST)
  day_two:     "2024-03-16T04:30:00.000Z",     // Till 10:00 AM, 17 Feb 24 (IST)
  day_three:   "2024-03-17T04:30:00.000Z",     // Till 10:00 AM, 18 Feb 24 (IST)
}

module.exports = { titles, payments, timeouts }