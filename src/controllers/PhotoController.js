const Photo = require("../models/Photo");
const User = require("../models/User")
const mongoose = require("mongoose");

// Insert a photo, with an user realted to it

const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  // Create photo
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  // If photo was created sucessfully, return the token
  if (!newPhoto) {
    res.status(422).json({
      error: ["Houve um erro, por favor tente mais tarde"],
    });
    return;
  }

  res.status(201).json(newPhoto);

};

// Remove a photo from DB
const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const photo = await Photo.findByIdAndDelete(id);

    // Check if photo exists
    if (!photo) {
      res.status(404).json({
        errors: ["Foto não encontrada!"],
      });
      return;
    }

    // Check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
      res.status(422).json({
        errors: ["Ocorreu um erro, tente novamente mais tarde!"],
      });
      return;
    }

    // if photo was deleted sucessfully
    res.status(200)
      .json({ id: photo._id, message: "Foto removida com sucesso!" });
  } catch (error) {
    res.status(500).json({
      errors: ["Erro no servidor, tente novamente mais tarde2!"],
    });
    return;
  }

};

// Get photo all photos
const getAllPhotos = async (req, res) => {

  const photos = await Photo.find({}).sort([['createdAt', -1]])
    .exec();

  return res.status(200).json(photos);
};

// Get user photos

const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id }).sort([['createdAt', -1]])
    .exec();

  return res.status(200).json(photos);
};

// Get photo by ID

const getPhotoById = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findById(id);

    // Check photo exists
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada!"], });
      return;
    }
    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({
      errors: ["Erro no servidor, tente novamente mais tarde3!"],
    });
    return;
  }
};

// Update a photo

const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
      res.status(404).json({ errors: ["Foto não encontrada!"] });
      return;
    }

    // Check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
      res.status(422).json({ errors: ["Ocorreu um erro, tente novamente mais tarde!"] });
      return;
    }

    if (title) {
      photo.title = title;
    }

    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ errors: ["Erro no servidor, tente novamente mais tarde!"] });
  }
};

// Like a photo



module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
};