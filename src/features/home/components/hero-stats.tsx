import { heroStats } from '#/constants'
import { cn } from '#/lib/utils'
import { ClientOnly } from '@tanstack/react-router'
import OdometerExample from './odometer-example'

export default function HeroStats() {
  return (
    <div
      className={
        'absolute -bottom-96 sm:-bottom-48 md:-bottom-40 lg:-bottom-24 xl:-bottom-12 z-10 w-full'
      }
    >
      <div className="w-full bg-background rounded-2xl border shadow-sm py-4 lg:py-6 overflow-hidden">
        <div className="grid grid-cols-4 items-stretch divide-x divide-border/50">
          {heroStats.map((stat) => {
            const isRating = stat.description === 'Customer Rating'
            const isSamples = stat.description === 'Samples Collected'

            return (
              <div
                key={stat.id}
                className={cn(
                  'flex flex-col justify-start items-center text-center px-1 sm:px-4 py-2'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center size-10 md:size-14 lg:size-16 rounded-full shrink-0 mb-1 lg:mb-2',
                    stat.bgColor
                  )}
                >
                  <div className="[&>svg]:size-5 lg:[&>svg]:size-7">
                    {stat.icon}
                  </div>
                </div>

                <div className="flex flex-col gap-0.5 lg:gap-1 items-center">
                  <h3 className="text-[11px] sm:text-base lg:text-[22px] font-bold text-foreground flex items-center justify-center">
                    {isRating ? (
                      <ClientOnly
                        fallback={<span>4.9/5</span>}
                      >
                        <OdometerExample
                          target={'odometer-target-2'}
                          value={4.9}
                          duration={2.3}
                          lastDigitDelay={0}
                          float={true}
                          suffix={'/5'}
                          className="font-bold! text-[11px]! sm:text-base! lg:text-[22px]!"
                        />
                      </ClientOnly>
                    ) : isSamples ? (
                      <ClientOnly
                        fallback={<span>10,000+</span>}
                      >
                        <OdometerExample
                          target={'odometer-target'}
                          value={10000}
                          duration={2.3}
                          lastDigitDelay={0}
                          suffix={undefined}
                          className="font-bold! text-[11px]! sm:text-base! lg:text-[22px]!"
                        />
                        <span>+</span>
                      </ClientOnly>
                    ) : (
                      stat.stat
                    )}
                  </h3>
                  <p className="text-[9px] sm:text-sm lg:text-[15px] font-medium text-muted-foreground whitespace-pre-line leading-tight lg:leading-snug">
                    {stat.description.includes(' ')
                      ? stat.description.replace(' ', '\n')
                      : stat.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
