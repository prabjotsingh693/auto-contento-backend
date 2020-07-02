const mongoose = require("mongoose");

const summaryUtil = require("../util/summarizer");
const userSummary = require("../modal/summary");
const HttpError = require("../modal/http-error");
const User = require("../modal/user");

/**
 *get user id  and the url 
 external rapid api is used to get summary
 and store it to db 
 response with id
 */
const StoreSummary = async (req, res, next) => {
  const { url, creator } = req.body;
  
  let summary;
  try {
    summary = await summaryUtil(url);
    
  } catch (err) {

    const error = new HttpError("error while getting summary", 500);
    return next(error);
  }

  const createSummary = new userSummary({
    url,
    sentences: summary,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "creating summary failed, please try again",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("could not find the user", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createSummary.save({ session: sess });
    user.summary.push(createSummary);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ smId: createSummary._id });
};

/**
 * 
need user id and summary id 
fetch data and send back
 */
const getSummary = async (req, res, next) => {
  const { creator, smId } = req.body;

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("error while getting user", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("user not found", 404);
    return next(error);
  }

  let summary;
  try {
    summary = await userSummary.findById(smId);
  } catch (err) {
    const error = new HttpError("error while extracting summary", 500);
    return next(error);
  }

  if(!summary){
    const error = new HttpError("no summary found", 404);
    return next(error);
  }

  res.status(200).json({ summary: summary.toObject({ getters: true }) });
};

/**
 * 
for updating only 
need userid and summary id and updated sentence delta
 */
const updateSummary = async (req, res, next) => {
  const { creator, smId, sentence } = req.body;
  console.log(creator, smId);


  const val = JSON.parse(sentence);

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("error while getting user", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("user not found", 404);
    return next(error);
  }

  let summary;
  try {
    summary = await userSummary.findById(smId);
  } catch (err) {
    const error = new HttpError("error while fetching summay", 500);
    return next(error);
  }
  summary.sentences = val;

  console.log(summary);

  try {
    await summary.save();
  } catch (err) {
    const error = new HttpError("error while saving", 500);
    return next(error);
  }

  res.status(200).json({ summary: summary.toObject({ getters: true }) });
};

exports.StoreSummary = StoreSummary;
exports.getSummary = getSummary;
exports.updateSummary = updateSummary;
