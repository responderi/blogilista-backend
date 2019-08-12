const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)
  try {
    if (blog.likes === undefined) {
      blog.likes = 0
    }

    if (blog.title === undefined && blog.url === undefined) {
      return response.sendStatus(400).end()
    }
    const savedBlog = await blog.save()
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