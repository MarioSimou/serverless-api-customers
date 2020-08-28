'use strict';

// GET /users
module.exports.getUsers = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'getUsers'})
  }
}

// GET /users/:id
module.exports.getUser = async (event, ctx) => {
  const { id } = event.pathParameters

  if(!id){
    return {
      statusCode: 401,
      body: JSON.stringify({message: 'Unauthorized user'})
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({message: 'get user'})
  }
}

// POST /users
module.exports.postUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'post User'})
  }
}

// DELETE /users/:id
module.exports.deleteUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'delete user'})
  }
}

// PUT /users/:id
module.exports.putUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'put user'})
  }
}