import AWS from 'aws-sdk'
import {TableName} from '../users'

const dynamoDB = new AWS.DynamoDB.DocumentClient()

const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

class Response {
  constructor(status, success, message, data){
    this.status = status
    this.success = success
    this.message = message
    this.data = data
  }
  stringify(){
    return JSON.stringify({
      status: this.status,
      success: this.success,
      message: this.message,
      data: this.data
    })
  }
}

export const getEventResponse = (status, message, data) => {
  let body
  switch(status){
    case STATUS_CODES.OK:
    case STATUS_CODES.CREATED:
      body = new Response(status, true, message, data).stringify()
      break  
    case STATUS_CODES.NO_CONTENT:
      body = new Response(status, true).stringify()
      break
    case STATUS_CODES.BAD_REQUEST:
    case STATUS_CODES.UNAUTHORIZED:
    case STATUS_CODES.FORBIDDEN:
    case STATUS_CODES.NOT_FOUND:
    case STATUS_CODES.INTERNAL_SERVER_ERROR:
      body = new Response(status, false, message).stringify()
      break
  }

  return {statusCode: body.status, body}
} 

export const validateId = event => {
  const {id} = event.pathParameters

  if(!id){
    throw new Error('Validation error')
  }
}
export const validateUser = event => {
  const {email, username} = JSON.parse(event.body)  

  if(!email || !username){
    throw new Error('Validation error')
  }
}

export const validateUserUpdate = event => {
  const {email, username} = JSON.parse(event.body)  

  if(!email && !username){
    throw new Error('Validation error')
  }
}

export const findUserById = async event => {
  const {id} = event.pathParameters
  const {Item} = await dynamoDB.get({TableName, Key: {id}}).promise()

  if(!Item){
    throw new Error('User not found')
  }

  event.locals = { user: Item }
}

export const withMiddlewares = (...middlewares) => fn => async (event, context, callback) => {
  try {
    for(const middleware of middlewares){
      await middleware(event, context, callback)
    }

    return await fn(event, context, callback)  
  }catch(e){
    return getEventResponse(e.status || STATUS_CODES.BAD_REQUEST, e.message)
  }
}