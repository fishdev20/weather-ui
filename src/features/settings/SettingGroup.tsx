import type { CSSProperties } from 'react'
import type { Icon } from '@phosphor-icons/react'
import styles from './SettingGroup.module.scss'

type SettingGroupProps<T extends string> = {
  label: string
  icon: Icon
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: string }>
}

export function SettingGroup<T extends string>({
  label,
  icon: IconComponent,
  value,
  onChange,
  options,
}: SettingGroupProps<T>) {
  const groupStyle = { '--option-count': options.length } as CSSProperties

  return (
    <section className={styles.settingGroup}>
      <p className={styles.settingLabel}>
        <IconComponent size={15} weight="bold" aria-hidden="true" />
        <span>{label}</span>
      </p>
      <div className={styles.settingChecklist} style={groupStyle} role="group" aria-label={label}>
        {options.map((option) => (
          <label key={option.value} className={styles.settingOption}>
            <input
              type="checkbox"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.optionLabel}>{option.label}</span>
          </label>
        ))}
      </div>
    </section>
  )
}
