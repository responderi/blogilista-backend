const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async() => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async() => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'new cool blog',
    author: 'new',
    url: 'new',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(response.body.length).toBe(helper.initialBlogs.length + 1)
  expect(contents).toContain(
    'new cool blog'
  )

})

test('if likes are undefined, it is 0', async () => {
  const newBlog = {
    title: 'blog',
    author: 'writer',
    url: 'url'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
  const response = await api.get('/api/blogs')
  const result = response.body.find(blog => blog.title === 'blog')
  expect(result.likes).toBe(0)
})

test('if title or url is empty, return 400', async () => {
  const newBlog = {
    author: 'writer',
    likes: 1
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})