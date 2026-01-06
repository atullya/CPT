import { User } from '../models/user.model';

export class UserService {
  static async getAllUsersForUsers() {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .populate('createdBy', 'name email');
    return users;
  }
}
