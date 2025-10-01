
import {rateLimit} from 'express-rate-limit';
import {StatusCodes} from 'http-status-codes'

export const rateLimiter = rateLimit({
   windowMs: 2*60*1000,
   limit: 10,
   standardHeaders: 'draft-8',
   legacyHeaders: false,
   ipv6Subnet: 56,
   message:{
      msg: "Too many requests from this IP, please try again later."
   },
   statusCode: StatusCodes.TOO_MANY_REQUESTS
});