const User = require("../../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

//Genarete user token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Register user and sign in
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //check if user exists
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ error: ["Por favor, utilize outro e-mail"] });
    return
  }

  //Generation password hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  //Create user
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  //if user was created sucessfully, return the token
  if (!newUser) {
    res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde"] });
    return
  }

  //Return user with token
  res.status(200).json({
    _id: newUser._id,
    profileImage: newUser.profileImage,
    token: generateToken(newUser._id),
  });
};

//Sign user in
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //Check if user exists
  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }

  //Check if password metches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ errors: ["Senha invalida"] });
    return;
  }

  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

//Get current logged in user

const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

// Update an user
const update = async (req, res) => {
  try {
    const { name, password, bio } = req.body;
    let profileImage = null;

    // Check if a file has been uploaded
    if (req.file) {
      profileImage = req.file.filename;
    }

    // Get the user from the ID
    const reqUser = req.user;
    const userId = new mongoose.Types.ObjectId(reqUser._id.toString());
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Update the name if provided
    if (name) {
      user.name = name;
    }

    // Update the password if provided
    if (password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    // Update the profile image if provided
    if (profileImage) {
      user.profileImage = profileImage;
    }

    // Update the bio if provided
    if (bio) {
      user.bio = bio;
    }

    // Save the changes
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o perfil' });
  }
};

//Getr user by ID
const getUserById = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(404).json({ errors: ["Usuario não encontrado"] })
      return;
    }
    res.status(200).json(user);

  } catch (error) {
    res.status(422).json({ errors: ["Usuario não encontrado"] })
  };
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
