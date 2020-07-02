const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../modal/user");
const HttpError = require("../modal/http-error");

//-------------------------------------------------------------------------------------
const signUp = async (req, res, next) => {
  //add validation

  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up is failed, please try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exists", 422);
    return next(error);
  }

  let hasedPassword;

  try {
    hasedPassword = await bycrpt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "user cannot be created, please try again",
      500
    );
    return next(error);
  }

  const createUser = new User({
    email,
    password: hasedPassword,
    summary: [],
  });

  try {
    await createUser.save();
  } catch (err) {
    const error = new HttpError("Signing up is failed, please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createUser.id, email: createUser.email },
      "make_summary_easy",
    );
  } catch (err) {
    const error = new HttpError("Signing up is failed, please try again", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createUser.id, email: createUser.email, token: token });
};




//--------------------------------------login--------------------------------------
const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("logging in is failed, please try again", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("invalid credentials", 401);
    return next(error);
  }

  let isPasswordValid = false;
  try {
    isPasswordValid = await bycrpt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("logging in failed, please try again", 500);
    return next(error);
  }

  if (!isPasswordValid) {
    const error = new HttpError("invalid credentials", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "make_summary_easy",
      
    );
  } catch (err) {
    const error = new HttpError("logging in is failed, please try again", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email ,
    token: token,
  });
};

exports.signUp = signUp;
exports.logIn = logIn;
