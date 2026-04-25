import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from 'react'
import { cn } from '../../lib/cn'
import styles from './Button.module.scss'

type ButtonVariant = 'default' | 'ghost' | 'outline'
type ButtonSize = 'default' | 'sm' | 'icon'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const variantClassMap: Record<ButtonVariant, string> = {
  default: styles.variantDefault,
  ghost: styles.variantGhost,
  outline: styles.variantOutline,
}

const sizeClassMap: Record<ButtonSize, string> = {
  default: styles.sizeDefault,
  sm: styles.sizeSm,
  icon: styles.sizeIcon,
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'default', size = 'default', asChild = false, type, children, ...props },
    ref,
  ) => {
    const mergedClassName = cn(
      styles.button,
      variantClassMap[variant],
      sizeClassMap[size],
      className,
    )

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string }>
      return cloneElement(child, {
        className: cn(mergedClassName, child.props.className),
      })
    }

    return (
      <button ref={ref} type={type ?? 'button'} className={mergedClassName} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
