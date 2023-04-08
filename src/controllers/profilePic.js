import { dataUri, uploadToCloud } from '../utils/upload';
import { userModel } from './auth/userAuth';

export const uploadProfilePic = async (req, res) => {
  const token = req.token;
  try {
    const { userId } = req.user.userInfo;

    if (req.file) {
      const file = dataUri(req).content;
      const imageUrl = await uploadToCloud(file, 'Rides user pic');
      const data = { profile_pic: imageUrl };
      const clause = `WHERE user_details_id = '${userId}'`;
      const addProfilePic = await userModel.editFromTable(data, clause);
      const info = `first_name, last_name, password, email, user_type, phone_number`;
      const infoClause = `WHERE user_details_id = '${userId}'`;
      const infoData = await userModel.select(info, infoClause);
      const {
        first_name: firstName,
        last_name: lastName,
        email,
        user_type: userType,
        phone_number: phoneNumber,
        profile_pic: profilePic,
      } = infoData.rows[0];
      const userInfo = {
        userId,
        firstName,
        lastName,
        email,
        userType,
        phoneNumber,
        profilePic,
      };
      return res.status(200).json({
        message: 'File successfully uploaded',
        userInfo,
        token,
        success: true,
      });
    } else {
      return res.status(400).json({
        message: 'No file added',
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'something went wrong while processing your request',
      success: false,
    });
  }
};
