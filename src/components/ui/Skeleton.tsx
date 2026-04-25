import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import styles from './Skeleton.module.scss'

type SkeletonProps = HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn(styles.skeleton, className)} aria-hidden="true" {...props} />
}
