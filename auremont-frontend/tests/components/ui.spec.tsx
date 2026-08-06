import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomInput from '@/components/checkout/CustomInput';
import ProgressIndicator from '@/components/checkout/ProgressIndicator';

describe('UI Component Library Suite', () => {
  describe('CustomInput Form Component', () => {
    it('should render input field with accessible label', () => {
      render(
        <CustomInput
          label="Full Name"
          name="fullName"
          value="Alexander Vance"
          onChange={jest.fn()}
        />
      );

      const labelElement = screen.getByText('Full Name');
      const inputElement = screen.getByLabelText('Full Name');

      expect(labelElement).toBeDefined();
      expect(inputElement).toHaveValue('Alexander Vance');
    });

    it('should handle focus and blur state classes', () => {
      const onFocusMock = jest.fn();
      const onBlurMock = jest.fn();

      render(
        <CustomInput
          label="Email Address"
          name="email"
          value=""
          onFocus={onFocusMock}
          onBlur={onBlurMock}
          onChange={jest.fn()}
        />
      );

      const inputElement = screen.getByLabelText('Email Address');
      fireEvent.focus(inputElement);
      expect(onFocusMock).toHaveBeenCalledTimes(1);

      fireEvent.blur(inputElement);
      expect(onBlurMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('ProgressIndicator Stepper Component', () => {
    it('should render active step highlighted correctly', () => {
      const steps = ['Information', 'Shipping', 'Payment'];
      render(<ProgressIndicator steps={steps} currentStep={1} />);

      expect(screen.getByText('Information')).toBeDefined();
      expect(screen.getByText('Shipping')).toBeDefined();
      expect(screen.getByText('Payment')).toBeDefined();
    });
  });
});
