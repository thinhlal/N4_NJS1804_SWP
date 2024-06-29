// adminService.test.js
const AdminService = require('./adminService');

describe('AdminService', () => {
  let adminService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      save: jest.fn()
    };
    adminService = new AdminService(mockUserRepository);
  });

  describe('setAccountStatus', () => {
    it('should allow the admin to enable the account', async () => {
      const adminId = 'admin123';
      const userId = 'user123';
      const user = { id: userId, isActive: false };

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue({ ...user, isActive: true });

      const result = await adminService.setAccountStatus(adminId, userId, true);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.save).toHaveBeenCalledWith({ ...user, isActive: true });
      expect(result.isActive).toBe(true);
    });

    it('should allow the admin to disable the account', async () => {
      const adminId = 'admin123';
      const userId = 'user123';
      const user = { id: userId, isActive: true };

      mockUserRepository.findById.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue({ ...user, isActive: false });

      const result = await adminService.setAccountStatus(adminId, userId, false);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.save).toHaveBeenCalledWith({ ...user, isActive: false });
      expect(result.isActive).toBe(false);
    });

    it('should throw an error if the user is not found', async () => {
      const adminId = 'admin123';
      const userId = 'user123';

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(adminService.setAccountStatus(adminId, userId, true)).rejects.toThrow('User not found');

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
