---
layout: post
title:  "Cat HTTP status codes"
description: "HTTP status codes explained through cat pictures"
image: "http://i.imgur.com/1yaeuIY.jpg"
date:   2016-09-26 21:00:00 +0300
---

# Informational 1xx

## 100 - Continue

The client SHOULD continue with its request.

![100](http://i.imgur.com/trZyzhA.jpg)

## 101 - Switching protocols

The server understands and is willing to comply with the client's request, via the Upgrade message header field (section 14.42), for a change in the application protocol being used on this connection.

![101](http://i.imgur.com/1yaeuIY.jpg)

# Successful 2xx

## 200 - OK

The request has succeeded. The information returned with the response is dependent on the method used in the request.

![200](http://i.imgur.com/R6KiXeK.jpg)

## 201 - Created

The request has been fulfilled and resulted in a new resource being created.

![201](http://i.imgur.com/QBCIU7D.jpg)

## 202 - Accepted

The request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place. There is no facility for re-sending a status code from an asynchronous operation such as this.

![202](http://i.imgur.com/juFIKqw.jpg)

## 203 - Non-Authoritative Information

The returned metainformation in the entity-header is not the definitive set as available from the origin server, but is gathered from a local or a third-party copy. The set presented MAY be a subset or superset of the original version.

![203](http://i.imgur.com/aZmjhyC.jpg)

## 204 - No Content

The server has fulfilled the request but does not need to return an entity-body, and might want to return updated metainformation. The response MAY include new or updated metainformation in the form of entity-headers, which if present SHOULD be associated with the requested variant.

![204](http://i.imgur.com/rsMXpB3.jpg)

## 205 - Reset Content

The server has fulfilled the request and the user agent SHOULD reset the document view which caused the request to be sent. This response is primarily intended to allow input for actions to take place via user input, followed by a clearing of the form in which the input is given so that the user can easily initiate another input action. The response MUST NOT include an entity.

![205](http://i.imgur.com/VW9fhFL.jpg)

## 206 - Partial Content

The server has fulfilled the partial GET request for the resource. The request MUST have included a Range header field (section 14.35) indicating the desired range, and MAY have included an If-Range header field (section 14.27) to make the request conditional.

![206](http://i.imgur.com/mVPmECl.jpg)

# Redirection 3xx

## 300 - Multiple Choices

The requested resource corresponds to any one of a set of representations, each with its own specific location, and agent- driven negotiation information (section 12) is being provided so that the user (or user agent) can select a preferred representation and redirect its request to that location.

![300](http://i.imgur.com/D3RQtp5.jpg)

## 301 - Moved Permanently

The requested resource has been assigned a new permanent URI and any future references to this resource SHOULD use one of the returned URIs. Clients with link editing capabilities ought to automatically re-link references to the Request-URI to one or more of the new references returned by the server, where possible. This response is cacheable unless indicated otherwise.

![301](http://i.imgur.com/WdTOk6c.jpg)

## 302 - Found

The requested resource resides temporarily under a different URI. Since the redirection might be altered on occasion, the client SHOULD continue to use the Request-URI for future requests. This response is only cacheable if indicated by a Cache-Control or Expires header field.

![302](http://i.imgur.com/Gme5ZbS.jpg)

## 303 - See Other

The response to the request can be found under a different URI and SHOULD be retrieved using a GET method on that resource. This method exists primarily to allow the output of a POST-activated script to redirect the user agent to a selected resource. The new URI is not a substitute reference for the originally requested resource. The 303 response MUST NOT be cached, but the response to the second (redirected) request might be cacheable.

![303](http://i.imgur.com/7iQZSmm.jpg)

## 304 - Not Modified

If the client has performed a conditional GET request and access is allowed, but the document has not been modified, the server SHOULD respond with this status code. The 304 response MUST NOT contain a message-body, and thus is always terminated by the first empty line after the header fields.

![304](http://i.imgur.com/Gm8imDB.jpg)

## 305 - Use Proxy

The requested resource MUST be accessed through the proxy given by the Location field. The Location field gives the URI of the proxy. The recipient is expected to repeat this single request via the proxy. 305 responses MUST only be generated by origin servers.

![305](http://i.imgur.com/I4gFcTO.jpg)

## 306 - (Unused)

The 306 status code was used in a previous version of the specification, is no longer used, and the code is reserved.

![306](http://i.imgur.com/d1QN3AE.jpg)

## 307 - Temporary Redirect

The requested resource resides temporarily under a different URI. Since the redirection MAY be altered on occasion, the client SHOULD continue to use the Request-URI for future requests. This response is only cacheable if indicated by a Cache-Control or Expires header field.

![307](http://i.imgur.com/TEMbnhR.jpg)

# Client Error 4xx

## 400 - Bad Request

The request could not be understood by the server due to malformed syntax. The client SHOULD NOT repeat the request without modifications.

![400](http://i.imgur.com/r8fmqR9.jpg)

## 401 - Unauthorized

The request requires user authentication. The response MUST include a WWW-Authenticate header field (section 14.47) containing a challenge applicable to the requested resource.

![401](http://i.imgur.com/n46JUqU.jpg)

## 402 - Payment Required

This code is reserved for future use.

![402](http://i.imgur.com/EAbRGO1.jpg)

## 403 - Forbidden

The server understood the request, but is refusing to fulfill it.

![403](http://i.imgur.com/AE4xQyj.jpg)

## 404 - Not Found

The server has not found anything matching the Request-URI. No indication is given of whether the condition is temporary or permanent.

![404](http://i.imgur.com/YPIkU1j.jpg)

## 405 - Method Not Allowed

The method specified in the Request-Line is not allowed for the resource identified by the Request-URI.

![405](http://i.imgur.com/9NdnNmR.jpg)

## 406 - Not Acceptable

The resource identified by the request is only capable of generating response entities which have content characteristics not acceptable according to the accept headers sent in the request.

![406](http://i.imgur.com/JN4VFyV.jpg)

## 407 Proxy Authentication Required

This code is similar to 401 (Unauthorized), but indicates that the client must first authenticate itself with the proxy. The proxy MUST return a Proxy-Authenticate header field (section 14.33) containing a challenge applicable to the proxy for the requested resource.

![407](http://i.imgur.com/ZEW9b9e.jpg)

## 408 - Request Timeout

The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time.

![408](http://i.imgur.com/p4rF3wA.jpg)

## 409 - Conflict

The request could not be completed due to a conflict with the current state of the resource.

![409](http://i.imgur.com/lHF6LHW.jpg)

## 410 - Gone

The requested resource is no longer available at the server and no forwarding address is known.

![410](http://i.imgur.com/OwbXglN.jpg)

## 411 - Length Required

The server refuses to accept the request without a defined Content- Length.

![411](http://i.imgur.com/l8WJXLh.jpg)

## 412 - Precondition Failed

The precondition given in one or more of the request-header fields evaluated to false when it was tested on the server.

![412-1](http://i.imgur.com/4UlQLiW.jpg)
![412-2](http://i.imgur.com/r8fmqR9.jpg)

## 413 - Request Entity Too Large

The server is refusing to process a request because the request entity is larger than the server is willing or able to process.

![413](http://i.imgur.com/NPWcmDF.jpg)

## 414 - Request-URI Too Long

The server is refusing to service the request because the Request-URI is longer than the server is willing to interpret.

![414](http://i.imgur.com/FcMrX0n.jpg)

## 415 - Unsupported Media Type

The server is refusing to service the request because the entity of the request is in a format not supported by the requested resource for the requested method.

![415](http://i.imgur.com/1RRXple.jpg)

## 416 - Requested Range Not Satisfiable

A server SHOULD return a response with this status code if a request included a Range request-header field (section 14.35), and none of the range-specifier values in this field overlap the current extent of the selected resource, and the request did not include an If-Range request-header field.

![416](http://i.imgur.com/UT9iQHv.jpg)

## 417 - Expectation Failed

The expectation given in an Expect request-header field (see section 14.20) could not be met by this server, or, if the server is a proxy, the server has unambiguous evidence that the request could not be met by the next-hop server.

![417](http://i.imgur.com/Kiz5Eak.jpg)

# Server Error 5xx

## 500 - Internal Server Error

The server encountered an unexpected condition which prevented it from fulfilling the request.

![500](http://i.imgur.com/CQ7wEIB.jpg)

## 501 - Not Implemented

The server does not support the functionality required to fulfill the request.

![501](http://i.imgur.com/gqZlwmy.jpg)

## 502 - Bad Gateway

The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.

![502](http://i.imgur.com/OX5sSsQ.jpg)

## 503 - Service Unavailable

The server is currently unable to handle the request due to a temporary overloading or maintenance of the server.

![503](http://i.imgur.com/4UlQLiW.jpg)

## 504 - Gateway Timeout

The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server specified by the URI (e.g. HTTP, FTP, LDAP) or some other auxiliary server (e.g. DNS) it needed to access in attempting to complete the request.

![504](http://i.imgur.com/sk6jt6u.jpg)

## 505 - HTTP Version Not Supported

The server does not support, or refuses to support, the HTTP protocol version that was used in the request message.

![505](http://i.imgur.com/FELctb1.jpg)

# References

HTTP status code documentation retrieved from [here](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).
