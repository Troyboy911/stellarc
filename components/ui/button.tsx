import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'premium';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-orange-600 dark:to-red-600 text-white hover:from-blue-700 hover:to-purple-700 dark:hover:from-orange-700 dark:hover:to-red-700 focus:ring-blue-500 dark:focus:ring-orange-500':
              variant === 'default',
            'border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300':
              variant === 'outline',
            'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300': variant === 'ghost',
            'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 dark:from-orange-500 dark:via-red-500 dark:to-pink-500 text-gray-900 dark:text-white hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 dark:hover:from-orange-600 dark:hover:via-red-600 dark:hover:to-pink-600 shadow-lg shadow-yellow-500/50 dark:shadow-orange-500/50':
              variant === 'premium',
          },
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'default',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };