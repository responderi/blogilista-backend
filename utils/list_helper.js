const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  
  return blogs.length === 0
  ? 0
  : blogs.reduce(reducer, 0 )
}

const favoriteBlog = (blogs) => {
  let blogWithMostLikes = null

  const result = (blogs) => {
    blogs.map(blog => {
      if (blogWithMostLikes === null || blog.likes > blogWithMostLikes.likes) {
        blogWithMostLikes = blog
      }
    })
    return blogWithMostLikes
  }

  return blogs.length === 0
  ? null
  : result(blogs)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}