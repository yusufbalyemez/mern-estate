import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//next'i yazdığımız hata middleware'ini kullanmak için oluşturdum.

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (err) {
    /* res.status(500).json(err.message); */
    //oluşturulan hata middleware'i kullanıldı.
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { password, email } = req.body;
  console.log(email);
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid credentials!"));
    //JWT TOKEN OLUŞTURUR
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    //Burada password alanı pass ismiyle çıkarılıyor ve geri kalan tüm bilgiler rest isimli bir nesnede toplanıyor.
    const { password: pass, ...rest } = validUser._doc;
    // httpOnly, cookie'nin sadece HTTP tarafından erişilebilir olmasını sağlayarak, client-side script'lerin bu cookie'ye erişimini engeller ve XSS (Cross-Site Scripting) saldırılarına karşı bir koruma sağlar.
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }); // await eklenmeli
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true, secure: true }) // HTTPS için secure eklenmeli
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); //2 kere yapılması sebebi 16 haneli olması için.
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true, secure: true }) // HTTPS için secure eklenmeli
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie('acces_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
