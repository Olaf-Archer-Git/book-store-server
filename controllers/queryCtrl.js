const Query = require("../models/queryModel");
const validateMongoDB = require("../utils/validateMongoDB");

const createQuery = async (req, res) => {
  try {
    const newQuery = await Query.create(req.body);
    res.json(newQuery);
  } catch (error) {
    throw new Error("create query", error);
  }
};

const getSingleQuery = async (req, res) => {
  const { id } = req.params;
  validateMongoDB(id);

  try {
    const singleQuery = await Query.findById(id);
    res.json(singleQuery);
  } catch (error) {
    throw new Error("get single query", error);
  }
};

const getAllQueries = async (req, res) => {
  try {
    const allQueries = await Query.find();
    res.json(allQueries);
  } catch (error) {
    throw new Error("get all queries", error);
  }
};

const updateQuery = async (req, res) => {
  const { id } = req.params;
  validateMongoDB(id);

  try {
    const updateQuery = await Query.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateQuery);
  } catch (error) {
    throw new Error("update query", error);
  }
};

const deleteQuery = async (req, res) => {
  const { id } = req.params;
  validateMongoDB(id);

  try {
    const deleteQuery = await Query.findByIdAndDelete(id);
    res.json(deleteQuery);
  } catch (error) {
    throw new Error("delete query", error);
  }
};

module.exports = {
  createQuery,
  getSingleQuery,
  getAllQueries,
  updateQuery,
  deleteQuery,
};
