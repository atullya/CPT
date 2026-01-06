import { User } from '../models/user.model';
export class AdminService {
  static async getAllUsers(currentUserRole?: string) {
    // Super-admins can see all users including other super-admins
    // Other roles cannot see super-admins
    const query = currentUserRole === 'super-admin' ? {} : { role: { $ne: 'super-admin' } };

    const users = await User.find(query).select('-password').populate('createdBy', 'name email');

    return users;
  }
}
