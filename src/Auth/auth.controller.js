const express = require("express");
const router = express.Router();
const prisma = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("./passport");

// Register
router.post("/register",async (req, res) => {
    try {
      const { name, phone_number, address, email, password, retryPassword, role } = req.body;

      const hasEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      // Check if email allready
      if (hasEmail) return res.status(405).json({ message: "User existing" });

      if (password.length < 8)
        return res.status(405).json({ message: "Password min 8 digit" });

      if (retryPassword !== password)
        return res.status(405).json({ message: "Password invalid" });

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          name,
          phone_number,
          address,
          email,
          password: hashPassword,
          retryPassword: hashPassword,
          role,
        },
      });
      res.status(201).json({ message: "User created successfully.", user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Login
router.post("/login", passport.authenticate("local", { session: false }),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        // eslint-disable-next-line no-undef
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("jwt", token, { httpOnly: true });

      res.json({ email});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Logout successful.' });
  });

module.exports = router;
