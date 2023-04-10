 import { response, Response } from 'express';
 
 export interface CustomResponse extends Response  {
  status: string |any  
  message : string ;
  data?: Array<any>,
  body : JSON

} 

// interface Response
// import { Response } from 'express';
// export interface CustomResponse extends Response { 
//   data ?: Array<object>
// }
