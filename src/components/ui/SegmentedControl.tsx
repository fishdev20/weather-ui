import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'
import styles from './SegmentedControl.module.scss'

type SegmentedControlOption<T extends string> = {
  value: T
  label: string
}

type SegmentedControlProps<T extends string> = {
  ariaLabel: string
  value: T
  options: SegmentedControlOption<T>[]
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  ariaLabel,
  value,
  options,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const groupStyle = { '--segment-count': options.length } as CSSProperties

  return (
    <div
      className={cn(styles.segmentedControl, className)}
      style={groupStyle}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={cn(styles.segmentButton, isActive && styles.segmentButtonActive)}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
