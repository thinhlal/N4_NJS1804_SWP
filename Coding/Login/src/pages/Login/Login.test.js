// src/pages/Login/Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';

const mock = new MockAdapter(axios);

describe('Login Component', () => {
    beforeEach(() => {
        mock.reset();
    });

    test('successful login with username A and password A', async () => {
        mock.onPost('http://localhost:5000/login').reply(config => {
            const { username, password } = JSON.parse(config.data);
            if (username === 'A' && password === 'A') {
                return [200, { token: 'token-for-A' }];
            } else if (username === 'B' && password === 'B') {
                return [200, { token: 'token-for-B' }];
            } else {
                return [401, { message: 'Invalid username or password' }];
            }
        });

        render(<Login />);
        fireEvent.change(screen.getByPlaceholderText('Enter Username or Email.'), { target: { value: 'A' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Password.'), { target: { value: 'A' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => expect(localStorage.getItem('token')).toBe('token-for-A'));
    });

    test('shows error message on failed login', async () => {
        mock.onPost('http://localhost:5000/login').reply(config => {
            const { username, password } = JSON.parse(config.data);
            if (username === 'A' && password === 'A') {
                return [200, { token: 'token-for-A' }];
            } else {
                return [401, { message: 'Invalid username or password' }];
            }
        });

        render(<Login />);

        fireEvent.change(screen.getByPlaceholderText('Enter Username or Email.'), { target: { value: 'wrongUser' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Password.'), { target: { value: 'wrongPassword' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        expect(await screen.findByText('Invalid username or password')).toBeInTheDocument();
    });
});
