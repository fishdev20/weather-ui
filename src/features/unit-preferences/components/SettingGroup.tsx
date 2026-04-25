import type { Icon } from '@phosphor-icons/react'
import { SegmentedControl } from '../../../components/ui/SegmentedControl'
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
  return (
    <section className={styles.settingGroup}>
      <p className={styles.settingLabel}>
        <IconComponent size={15} weight="bold" aria-hidden="true" />
        <span>{label}</span>
      </p>
      <SegmentedControl
        className={styles.settingControl}
        ariaLabel={label}
        value={value}
        options={options}
        onChange={onChange}
      />
    </section>
  )
}
