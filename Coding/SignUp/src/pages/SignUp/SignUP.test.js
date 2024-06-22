import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';

const mock = new MockAdapter(axios);

describe('SignUp Component', () => {
    beforeEach(() => {
        mock.reset();
    });

    test('successful sign up', async () => {
        mock.onPost('http://localhost:5000/signup').reply(200, { message: 'Registration successful!' });

        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );
        fireEvent.change(screen.getByPlaceholderText('Username/Email'), { target: { value: 'newUser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'newPassword123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newPassword123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        // test case message
        await waitFor(() => expect(screen.getByText('Registration successful!')).toBeInTheDocument());
    });

    test('shows error message when passwords do not match', async () => {
        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );
        fireEvent.change(screen.getByPlaceholderText('Username/Email'), { target: { value: 'newUser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'newPassword123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'differentPassword' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        // test case message
        await waitFor(() => expect(screen.getByText('Passwords do not match')).toBeInTheDocument());
    });

    test('shows error message when username is too short', async () => {
        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );
        fireEvent.change(screen.getByPlaceholderText('Username/Email'), { target: { value: 'usr' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'newPassword123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newPassword123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

       // test case message
        await waitFor(() => expect(screen.getByText('Username must be at least 5 characters long')).toBeInTheDocument());
    });

    test('shows error message when password is too short', async () => {
        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );
        fireEvent.change(screen.getByPlaceholderText('Username/Email'), { target: { value: 'newUser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'short' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'short' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

       // test case message
        await waitFor(() => expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument());
    });

    test('shows server error message on failed sign up', async () => {
        mock.onPost('http://localhost:5000/signup').reply(400, { message: 'Username already exists' });

        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );
        fireEvent.change(screen.getByPlaceholderText('Username/Email'), { target: { value: 'existingUser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'newPassword123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newPassword123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        // test case message
        await waitFor(() => expect(screen.getByText('Username already exists')).toBeInTheDocument());
    });

    test('does not save account to database', async () => {
        mock.onPost('http://localhost:5000/signup').reply(500, { message: 'Database error: Could not save user' });

        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );
        fireEvent.change(screen.getByPlaceholderText('Username/Email'), { target: { value: 'testUserNoSave' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'testPassword123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'testPassword123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        // test case message
        await waitFor(() => expect(screen.getByText('Database error: Could not save user')).toBeInTheDocument());
    });
});
