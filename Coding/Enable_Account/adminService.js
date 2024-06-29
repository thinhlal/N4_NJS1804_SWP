// adminService.js
class AdminService {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }
  
    async setAccountStatus(adminId, userId, status) {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.isActive = status;
      await this.userRepository.save(user);
      return user;
    }
  }
  
  module.exports = AdminService;
  