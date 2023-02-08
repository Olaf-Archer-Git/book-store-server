const Blog = require("../models/blogModel");
const validateMongoose = require("../utils/validateMongoDB");

const createBlog = async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error, "createBlog error");
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  validateMongoose(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error, "updateBlog error");
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const getBlogs = await Blog.find();
    res.json(getBlogs);
  } catch (error) {
    throw new Error(error, "getAllBlogs error");
  }
};

const getBlog = async (req, res) => {
  const { id } = req.params;
  validateMongoose(id);
  try {
    const getBlog = await Blog.findById(id).populate("likes");
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numberOfViews: 1 },
      },
      { new: true }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error, "getBlog error");
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  validateMongoose(id);
  try {
    const deleteBlog = await Blog.findByIdAndDelete(id);
    res.json(deleteBlog);
  } catch (error) {
    throw new Error(error, "deleteBlog error");
  }
};

const blogLikes = async (req, res) => {
  const { blogId } = req.body;
  validateMongoose(blogId);
  //blog that you want to like
  const blog = await Blog.findById(blogId);

  //find user's login
  const loginUserId = req?.user?._id;

  //find did the post like or not
  const isLiked = blog?.isLiked;

  //find did the post dislike or not
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
};

const blogDislikes = async (req, res) => {
  const { blogId } = req.body;
  validateMongoose(blogId);
  //blog that you want to like
  const blog = await Blog.findById(blogId);

  //find user's login
  const loginUserId = req?.user?._id;

  //find did the post like or not
  const isDisliked = blog?.isDisliked;

  //find did the post dislike or not
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }

  if (isDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
};

module.exports = {
  createBlog,
  updateBlog,
  getAllBlogs,
  getBlog,
  deleteBlog,
  blogLikes,
  blogDislikes,
};
