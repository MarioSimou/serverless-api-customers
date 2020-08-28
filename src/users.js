// GET /users
export const getUsers = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'getUsers'})
  }
}

// GET /users/:id
export const getUser = async (event, ctx) => {
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
export const postUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'post User'})
  }
}

// DELETE /users/:id
export const deleteUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'delete user'})
  }
}

// PUT /users/:id
export const putUser = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'put user'})
  }
}