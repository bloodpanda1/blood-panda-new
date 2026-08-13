import { IconCertificate2, IconClock } from '@tabler/icons-react'

export default function AuthStats() {
  return (
    <div className={'absolute top-6/12 left-6/12 -translate-6/12 w-xs'}>
      <div
        className={
          'flex flex-col items-start gap-2 lg:gap-4 rounded-md bg-accent/65 p-4 shadow-lg backdrop-blur-sm'
        }
      >
        <p className={'inline-flex items-center gap-2'}>
          <span>
            <IconCertificate2 className={'size-6 lg:size-8 stroke-blue-500'} />
          </span>
          <span
            className={
              'text-sm md:text-base lg:text-lg font-semibold text-blue-500'
            }
          >
            Certified Labs
          </span>
        </p>
        <p className={'inline-flex items-center gap-2'}>
          <span>
            <IconClock className={'size-6 lg:size-8 stroke-destructive'} />
          </span>
          <span
            className={
              'text-sm md:text-base lg:text-lg font-semibold text-destructive'
            }
          >
            6 AM - 10 PM
          </span>
        </p>
      </div>
    </div>
  )
}
