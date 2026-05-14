import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'white' | 'link';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  as?: 'button' | 'a';
  href?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  as = 'button',
  href,
  leftIcon,
  rightIcon,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-display font-bold transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] focus:ring-[var(--color-primary)]',
    secondary: 'bg-transparent text-[var(--color-primary)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 focus:ring-[var(--color-primary)]',
    white: 'bg-white text-[var(--color-primary)] hover:bg-gray-50 focus:ring-white',
    link: 'bg-transparent text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] underline-offset-4 hover:underline p-0 rounded-none',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const combinedClasses = `${baseStyles} ${variant === 'link' ? variants.link : `${variants[variant]} ${sizes[size]}`} ${className}`;

  const MotionComponent = motion.create(as as any);

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  };

  return (
    <MotionComponent
      {...motionProps}
      type={as === 'button' ? type : undefined}
      onClick={onClick}
      disabled={disabled}
      href={href}
      className={combinedClasses}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2 transition-transform group-hover:translate-x-1">{rightIcon}</span>}
    </MotionComponent>
  );
};

export default Button;
