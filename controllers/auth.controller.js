const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: " ",
      confirmEmail: " ",
      password: " ",
      fullName: " ",
      street: " ",
      postal: " ",
      city: " ",
    };
  }

  res.render("customers/auth/signup", { inputData: sessionData });
}

async function signup(req, res) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullName: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessege:
          "please check you credentials. password must be greater than 5...",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );

    return;
  }
  const user = new User(
    req.body.email,
    req.body["confirm-email"],
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existAlready = await user.existAlready();
    if (existAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessege: "user exist already. try again!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup");
        }
      );

      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: " ",
      password: " ",
    };
  }
  res.render("customers/auth/login", {
    inputData: sessionData,
  });
}

async function login(req, res) {
  const user = new User(req.body.email, null, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }
  const sessionErrorData = {
    errorMessege: "please check your crendetials again...",
    email: this.email,
    password: this.password,
  };
  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });

    return;
  }

  const passwordIsMatching = await user.hasMatchingPassword(
    existingUser.password
  );

  //console.log("Password matching:", passwordIsMatching);

  if (!passwordIsMatching) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
