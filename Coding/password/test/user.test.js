const { createUser, getUserByUsername, resetUsers } = require('../src/user');
const { verifyPassword } = require('../src/utils');

describe('User password encryption', () => {
    beforeEach(() => {
        // Reset users trước mỗi test để đảm bảo môi trường sạch
        resetUsers();
    });

    test('password should be encrypted when creating a user', async () => {
        const username = 'testuser';
        const password = 'TestPassword123';

        // Tạo người dùng mới
        const user = await createUser(username, password);

        // Lấy người dùng từ "database"
        const dbUser = getUserByUsername(username);
        
        expect(dbUser).not.toBeNull();
        expect(dbUser.password).not.toBe(password);

        // Kiểm tra rằng mật khẩu lưu trữ đã được mã hóa và khớp với mật khẩu gốc
        const isMatch = await verifyPassword(password, dbUser.password);
        expect(isMatch).toBe(true);
    });

    test('hashed password should not match plain password', async () => {
        const username = 'testuser';
        const password = 'TestPassword123';

        // Tạo người dùng mới
        await createUser(username, password);

        // Lấy người dùng từ "database"
        const dbUser = getUserByUsername(username);
        
        expect(dbUser).not.toBeNull();
        expect(dbUser.password).not.toBe(password);
    });

    test('password verification should succeed with correct password', async () => {
        const username = 'testuser';
        const password = 'TestPassword123';

        // Tạo người dùng mới
        await createUser(username, password);

        // Lấy người dùng từ "database"
        const dbUser = getUserByUsername(username);

        // Kiểm tra xác minh mật khẩu
        const isMatch = await verifyPassword(password, dbUser.password);
        expect(isMatch).toBe(true);
    });

    test('password verification should fail with incorrect password', async () => {
        const username = 'testuser';
        const password = 'TestPassword123';
        const wrongPassword = 'WrongPassword123';

        // Tạo người dùng mới
        await createUser(username, password);

        // Lấy người dùng từ "database"
        const dbUser = getUserByUsername(username);

        // Kiểm tra xác minh mật khẩu với mật khẩu sai
        const isMatch = await verifyPassword(wrongPassword, dbUser.password);
        expect(isMatch).toBe(false);
    });
});
