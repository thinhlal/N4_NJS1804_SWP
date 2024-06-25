// src/pages/AdminServices/AdminServices.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminServices from './AdminServices';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('Component AdminServices', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('Add Service', async () => {
    render(<AdminServices />);

    // Click 'Add Services' button
    fireEvent.click(screen.getAllByText('Add Services')[0]);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Services Name'), { target: { value: 'New Service' } });
    fireEvent.change(screen.getByPlaceholderText('Services Description'), { target: { value: 'Service Description' } });
    fireEvent.change(screen.getByPlaceholderText('Services Price'), { target: { value: '$100' } });

    // Click 'Add' button in modal
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('New Service')).toBeInTheDocument();
      expect(screen.getByText('Service Description')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
    });
  });

  test('Validate Services Name Input with Number', async () => {
    render(<AdminServices />);

    // Click 'Add Services' button
    fireEvent.click(screen.getAllByText('Add Services')[0]);

    // Fill form with invalid services name containing numbers
    fireEvent.change(screen.getByPlaceholderText('Services Name'), { target: { value: 'Service123' } });
    // fireEvent.change(screen.getByPlaceholderText('Services Name'), { target: { value: 'Service' } });
    fireEvent.change(screen.getByPlaceholderText('Services Description'), { target: { value: 'Service Description' } });
    fireEvent.change(screen.getByPlaceholderText('Services Price'), { target: { value: '$100' } });

    // Click 'Add' button in modal
    fireEvent.click(screen.getByText('Add'));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Only letters and spaces are allowed')).toBeInTheDocument();
    });
  });


  test('Validate Price Input', async () => {
    render(<AdminServices />);

    // Click 'Add Services' button
    fireEvent.click(screen.getAllByText('Add Services')[0]);

    // Fill form with invalid price
    fireEvent.change(screen.getByPlaceholderText('Services Name'), { target: { value: 'New Service' } });
    fireEvent.change(screen.getByPlaceholderText('Services Description'), { target: { value: 'Service Description' } });
    fireEvent.change(screen.getByPlaceholderText('Services Price'), { target: { value: '100' } });
    // fireEvent.change(screen.getByPlaceholderText('Services Price'), { target: { value: '$100' } });


    // Click 'Add' button in modal
    fireEvent.click(screen.getByText('Add'));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Price must start with "$" and be followed by numbers')).toBeInTheDocument();
    });
  });
});
