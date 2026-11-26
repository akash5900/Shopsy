import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function userSignup(req, res) {
  try {
    const { username, email, mobilenumber, password, role } = req.body;

    if (!username) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(username.trim())) {
      return res.status(400).json({
        message: "Name can contain only letters and spaces",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (!mobilenumber) {
      return res.status(400).json({
        message: "Mobilenumber is required",
      });
    }

    if (!/^[6-9]\d{9}$/.test(mobilenumber.trim())) {
      return res.status(400).json({
        message: "Please enter a valid mobile number",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const alreadyExists = await userModel.findOne({ email });

    if (alreadyExists) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      mobilenumber,
      password: hashPassword,
      role: "user",
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
    );

    return res.status(201).json({
      statusCode: 201,
      message: "Signup Successfully",
      Token: token,
      user: user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function userLogin(req, res) {
  try {
    const { email, mobilenumber, password } = req.body;

    if (!email && !mobilenumber) {
      return res.status(400).json({
        message: "Email or mobile number is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await userModel.findOne({
      $or: [{ email }, { mobilenumber }],
    });

    if (!user) {
      return res.status(404).json({
        message: "Invalid user",
      });
    }

    const isPassworValid = await bcrypt.compare(password, user.password);

    if (!isPassworValid) {
      return res.status(404).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({
      statuscode: "200",
      message: "User Login Successfully",
      user: safeUser,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function adminSignup(req, res) {
  try {
    const { username, email, mobilenumber, password, role } = req.body;

    if (!username) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(username.trim())) {
      return res.status(400).json({
        message: "Name can contain only letters and spaces",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (!mobilenumber) {
      return res.status(400).json({
        message: "Mobilenumber is required",
      });
    }

    if (!/^[6-9]\d{9}$/.test(mobilenumber.trim())) {
      return res.status(400).json({
        message: "Please enter a valid mobile number",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const alreadyExists = await userModel.findOne({ email });

    if (alreadyExists) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const admin = await userModel.create({
      username,
      email,
      mobilenumber,
      password: hashPassword,
      role: "admin",
    });

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
    );

    return res.status(201).json({
      statusCode: 201,
      message: "Signup Successfully",
      AdminToken: token,
      user: admin,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const admin = await userModel.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        message: "Invalid user",
      });
    }

    const isPassworValid = await bcrypt.compare(password, admin.password);

    if (!isPassworValid) {
      return res.status(404).json({
        message: "Invalid Password",
      });
    }

    if (admin.role != "admin") {
      return res.status(403).json({
        message: "Not an admin",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("AdminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      statuscode: "200",
      message: "Admin Login Successfully",
      admin,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function allUsers(req, res) {
  try {
    const users = await userModel.find().select("-password");

    return res.status(200).json({
      statuscode: "200",
      message: "users fetched successfully",
      users,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function editUser(req, res) {
  try {
    const { username, email, mobilenumber } = req.body;
    const userId = req.user.id;

    const currentUser = await userModel.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const updateData = {};

    if (username !== undefined) {
      if (typeof username !== "string" || !username.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      const trimmedUsername = username.trim();

      if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(trimmedUsername)) {
        return res.status(400).json({
          message: "Name can contain only letters and spaces",
        });
      }

      updateData.username = trimmedUsername;
    }

    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
      ) {
        return res.status(400).json({
          message: "Please enter a valid email address",
        });
      }

      const trimmedEmail = email.trim();

      if (trimmedEmail !== currentUser.email) {
        const existingEmail = await userModel.findOne({
          email: trimmedEmail,
          _id: { $ne: userId },
        });

        if (existingEmail) {
          return res.status(409).json({
            message: "Email is already in use",
          });
        }
      }

      updateData.email = trimmedEmail;
    }

    if (mobilenumber !== undefined) {
      if (
        typeof mobilenumber !== "string" ||
        !/^[6-9]\d{9}$/.test(mobilenumber.trim())
      ) {
        return res.status(400).json({
          message: "Please enter a valid mobile number",
        });
      }

      const trimmedMobile = mobilenumber.trim();

      if (trimmedMobile !== currentUser.mobilenumber) {
        const existingMobile = await userModel.findOne({
          mobilenumber: trimmedMobile,
          _id: { $ne: userId },
        });

        if (existingMobile) {
          return res.status(409).json({
            message: "Mobile number is already in use",
          });
        }
      }

      updateData.mobilenumber = trimmedMobile;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Please provide at least one field to update",
      });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        },
      )
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Edit profile error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function getProfie(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await userModel.findByIdAndDelete(id);

    return res.status(200).json({
      statuscode: "200",
      message: "User Deleted",
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function userLogout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function adminLogout(req, res) {
  try {
    res.clearCookie("AdminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Admin logged out successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}
