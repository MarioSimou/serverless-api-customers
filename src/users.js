import { v4 as uuidv4 } from 'uuid'
import AWS from 'aws-sdk'
import 'regenerator-runtime'
import { withMiddlewares, findUserById, validateId, validateUser, getEventResponse, validateUserUpdate } from './middlewares'

const dynamoDB = new AWS.DynamoDB.DocumentClient()
export const TableName = "usersTable"

// GET /users
export const getUsersFn = async (event) => {
  const {Items} = await dynamoDB.scan({
    TableName, 
    Select: 'ALL_ATTRIBUTES'
  }).promise()
  
  return getEventResponse(200, null, Items)
}

export const getUsers = withMiddlewares()(getUsersFn)

// GET /users/:id
const getUserFn = async event => getEventResponse(200, null, event.locals.user)

export const getUser = withMiddlewares(validateId,findUserById)(getUserFn)

// POST /users
const postUserFn = async (event) => {
  const {email, username} = JSON.parse(event.body)
  const user = {id: uuidv4(), username, email}

  await dynamoDB.put({TableName,Item: user}).promise()
  const {Item} = await dynamoDB.get({TableName, Key: {id: user.id}}).promise()

  return getEventResponse(200, null, Item)
}

export const postUser = withMiddlewares(validateUser)(postUserFn)

// DELETE /users/:id
const deleteUserFn = async event => {
  const {id} = event.pathParameters
  await dynamoDB.delete({TableName, Key:{id}}).promise()

  return getEventResponse(204)
}
export const deleteUser = withMiddlewares(validateId, findUserById)(deleteUserFn)

// PUT /users/:id
const putUserFn = async event => {
  const {id} = event.pathParameters
  const body = JSON.parse(event.body) 
  const expressionAttributes = Object.entries(body).reduce((acc,[k,v]) => ({...acc, [`:${k}`]:v}),{})
  const updateExpression = Object.keys(body).reduce((acc, key, i) => [...acc,i === 0 ? `${key} = :${key}` : `,${key} = :${key}`], ['set']).join(' ')

  const {Attributes} = await dynamoDB.update({
    TableName,
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributes,
    ReturnValues:"ALL_NEW",
  }).promise()
  
  return getEventResponse(200, null, Attributes)
}
export const putUser = withMiddlewares(validateId, validateUserUpdate)(putUserFn)