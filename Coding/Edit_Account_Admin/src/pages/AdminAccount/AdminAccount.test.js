import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminAccount from './AdminAccount';
import '../../setupTests';
import { AuthContext } from '../../../context/AuthContext';

const mockAuthContext = {
  logOut: jest.fn(),
};

const renderWithAuthContext = (component) => {
  return render(
    <AuthContext.Provider value={mockAuthContext}>
      {component}
    </AuthContext.Provider>
  );
};

test('edit an account successfully', async () => {
  renderWithAuthContext(<AdminAccount />);

  // Mở modal để chỉnh sửa tài khoản đầu tiên
  fireEvent.click(screen.getByTestId('edit-button-1'));

  // Đợi một chút để modal mở
  await new Promise((r) => setTimeout(r, 500));

  // Truy xuất modal hiện tại bằng cách tìm element chứa ID của modal
  const modal = document.getElementById('exampleModalEdit-1');

  // Kiểm tra các giá trị cũ có đúng không
  expect(modal.querySelector('[data-testid="edit-name"]').value).toBe('Leslie');
  expect(modal.querySelector('[data-testid="edit-email"]').value).toBe('leslie14@gmail.com');
  expect(modal.querySelector('[data-testid="edit-phone"]').value).toBe('1234567891');
  expect(modal.querySelector('[data-testid="edit-role"]').value).toBe('Veterinarian');

  // Chỉnh sửa giá trị
  fireEvent.change(modal.querySelector('[data-testid="edit-name"]'), { target: { value: 'Leslie Updated' } });
  fireEvent.change(modal.querySelector('[data-testid="edit-email"]'), { target: { value: 'leslie_updated@gmail.com' } });
  fireEvent.change(modal.querySelector('[data-testid="edit-phone"]'), { target: { value: '0987654321' } });
  fireEvent.change(modal.querySelector('[data-testid="edit-role"]'), { target: { value: 'Staff' } });

  // Lưu thay đổi
  fireEvent.click(modal.querySelector('[data-testid="save-changes-button"]'));

  // Kiểm tra giá trị mới đã được cập nhật
  expect(screen.getByTestId('account-row-1')).toHaveTextContent('Leslie Updated');
  expect(screen.getByTestId('account-row-1')).toHaveTextContent('leslie_updated@gmail.com');
  expect(screen.getByTestId('account-row-1')).toHaveTextContent('0987654321');
  expect(screen.getByTestId('account-row-1')).toHaveTextContent('Staff');
});
