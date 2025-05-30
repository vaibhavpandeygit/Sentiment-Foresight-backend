const User = require('../../models/User');
const asyncHandler = require('express-async-handler');

// GET /me
exports.getMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const user = await User.findById(userId).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  let profileData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  if (role === "brand" && user.brandDetails) {
    profileData.brandDetails = {
      brandName: user.brandDetails.brandName,
      website: user.brandDetails.website,
      contactPerson: user.brandDetails.contactPerson,
      contactEmail: user.brandDetails.contactEmail,
      phone: user.brandDetails.phone,
      address: user.brandDetails.address,
      industry: user.brandDetails.industry,
    };
  } else if (role === "consumer" && user.consumerDetails) {
    profileData.consumerDetails = {
      age: user.consumerDetails.age,
      gender: user.consumerDetails.gender,
      location: user.consumerDetails.location,
      points: user.consumerDetails.points,
    };
  }

  res.status(200).json(profileData);
});


exports.updateMe = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;
  const { name, email, ...rest } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  if (role === 'brand') {
    user.brandDetails = {
      ...(user.brandDetails?.toObject() || {}),
      brandName: rest.brandName ?? user.brandDetails.brandName,
      website: rest.website ?? user.brandDetails.website,
      contactPerson: rest.contactPerson ?? user.brandDetails.contactPerson,
      contactEmail: rest.contactEmail ?? user.brandDetails.contactEmail,
      phone: rest.phone ?? user.brandDetails.phone,
      address: rest.address ?? user.brandDetails.address,
      industry: rest.industry ?? user.brandDetails.industry
    };
  } else if (role === 'consumer') {
    user.consumerDetails = {
      ...(user.consumerDetails?.toObject() || {}),
      age: rest.age ?? user.consumerDetails.age,
      gender: rest.gender ?? user.consumerDetails.gender,
      location: rest.location ?? user.consumerDetails.location
      // points usually should not be updated manually by user
    };
  } else {
    return res.status(400).json({ message: 'Role not supported for update' });
  }

  await user.save();

  res.status(200).json({ message: 'Profile updated successfully' });
}
);


exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Please provide both current and new passwords' });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: 'Password updated successfully' });
});