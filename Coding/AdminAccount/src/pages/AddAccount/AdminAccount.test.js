// src/pages/AdminAccount/adminaccount.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminAccount from './AdminAccount';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('Component AdminAccount', () => {
  beforeEach(() => {
    mock.reset();
    localStorage.clear();
  });

  test('Add Account', async () => {
    render(<AdminAccount />);

    // click 'Add Account'
    fireEvent.click(screen.getAllByText('Add Account')[0]);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'newUser123' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '0123456789' } });
    fireEvent.click(screen.getByText('Add'));     // click 'Add' in modal

    // Display in table
    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument();
      expect(screen.getByText('newuser@example.com')).toBeInTheDocument();
      expect(screen.getByText('0123456789')).toBeInTheDocument();
    });
  });

  test('Confirm Password', async () => {
    render(<AdminAccount />);

    // click 'Add Account'
    fireEvent.click(screen.getAllByText('Add Account')[0]);

    // Fill form but wrong confirm password
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'newUser123' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), { target: { value: 'password23' } });
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'New User' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '0123456789' } });
    // click 'Add' in modal
    fireEvent.click(screen.getByText('Add'));

    // Display error
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('Check Exist Username/Email', async () => {
    render(<AdminAccount />);

    // click 'Add Account'
    fireEvent.click(screen.getAllByText('Add Account')[0]);

    // Fill form with existing username and email
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'leslie123' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Leslie' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'leslie14@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '0888888888' } });
    
    // click 'Add' in modal
    fireEvent.click(screen.getByText('Add'));

    // Display error
    await waitFor(() => {
      expect(screen.getByText('User name already exists')).toBeInTheDocument();
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
});
