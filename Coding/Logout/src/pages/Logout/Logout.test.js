const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const redisMock = require('redis-mock');
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

// Giả lập redis client
const redisClient = redisMock.createClient();

// Hàm logOut từ mã của bạn
const logOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log('Refresh Token:', refreshToken);
    const { deviceIdentifier } = req.body;
    console.log('Device Identifier:', deviceIdentifier);

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, account) => {
      if (err) {
        console.error('JWT verify error:', err);
        return res.status(403).json({ message: 'Token is not valid' });
      }

      const username = account.username.toString();
      console.log('Username:', username);
      const redisKey = `refreshToken:${username}:${deviceIdentifier}`;
      console.log('Redis Key:', redisKey);

      try {
        const response = await redisClient.del(redisKey);
        console.log('Redis Response:', response);
        if (response !== 1) {
          console.error('Redis del error');
          return res.status(500).json({ message: 'Logout failed' });
        }
      } catch (error) {
        console.error('Redis del error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      res.clearCookie('refreshToken');
      return res.status(200).json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Thêm route logOut vào app
app.post('/logout', logOut);

describe('POST /logout', () => {
  beforeEach(() => {
    // Giả lập JWT
    process.env.JWT_REFRESH_SECRET = 'test-secret';
    redisClient.flushall();
  });

  it('should return 403 if token is invalid', async () => {
    const response = await request(app)
      .post('/logout')
      .set('Cookie', `refreshToken=invalid-token`)
      .send({ deviceIdentifier: 'test-device-id' });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Token is not valid');
  });

  it('should return 500 if Redis del fails', async () => {
    const token = jwt.sign({ username: 'testuser' }, process.env.JWT_REFRESH_SECRET);
    const deviceIdentifier = 'test-device-id';

    // Không set refreshToken trong redis để giả lập lỗi
    const response = await request(app)
      .post('/logout')
      .set('Cookie', `refreshToken=${token}`)
      .send({ deviceIdentifier });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Logout failed');
  });

  it('should return 500 for internal server error', async () => {
    jest.spyOn(redisClient, 'del').mockImplementationOnce(() => {
      throw new Error('Internal Redis Error');
    });

    const token = jwt.sign({ username: 'testuser' }, process.env.JWT_REFRESH_SECRET);
    const deviceIdentifier = 'test-device-id';

    await redisClient.set(`refreshToken:testuser:${deviceIdentifier}`, token);

    const response = await request(app)
      .post('/logout')
      .set('Cookie', `refreshToken=${token}`)
      .send({ deviceIdentifier });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Internal Server Error');
  }, 10000);
});
