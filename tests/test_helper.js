const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'First blog',
    author: 'First author',
    url: 'First url',
    likes: 0
  },
  {
    title: 'Second blog',
    author: 'Second author',
    url: 'Second url',
    likes: 1
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}