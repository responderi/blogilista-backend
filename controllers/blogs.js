const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  const token = getTokenFrom(request)
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    blog.user = user.id

    if (blog.likes === undefined) {
      blog.likes = 0
    }

    if (blog.title === undefined && blog.url === undefined) {
      return response.sendStatus(400).end()
    }
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(blog)
    await user.save()
    response.json(savedBlog.toJSON()) 
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const deletedId = request.params.id
  try {
    await Blog.findByIdAndRemove(deletedId)
    response.status(200).end()
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndUpdate(request.params.id, request.body)
    response.status(200).end()
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter