import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '#/components/ui/item'
import { heroStats } from '#/constants'
import { cn } from '#/lib/utils'
import { ClientOnly } from '@tanstack/react-router'
import OdometerExample from './odometer-example'

export default function HeroStats() {
  return (
    <div
      className={
        'absolute -bottom-96 sm:-bottom-48 md:-bottom-40 lg:-bottom-24 xl:-bottom-12 z-10 bg-background rounded-xl border-0 w-full max-w-6xl px-4 lg:shadow-lg'
      }
      // className={
      //   'col-span-full justify-self-center z-10 bg-accent/10 backdrop-blur-lg border-none ring-0 shadow-none rounded-none border-0 w-full max-w-6xl scroll-fade-e'
      // }
    >
      <div
        className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4'}
      >
        {heroStats.map((stat) => {
          if (stat.description === 'Rating') {
            return (
              <Item key={stat.id} variant={'outline'}>
                <ItemMedia
                  variant="image"
                  className={cn(
                    'my-auto p-0.5 rounded-full',
                    `${stat.bgColor}`,
                  )}
                >
                  {stat.icon}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className={'font-semibold text-base'}>
                    <ClientOnly
                      fallback={
                        <span className={'font-semibold! text-base!'}>
                          4.9 /5
                        </span>
                      }
                    >
                      <OdometerExample
                        target={'odometer-target-2'}
                        value={4.9}
                        duration={2.3}
                        lastDigitDelay={0}
                        float={true}
                        suffix={' /5'}
                        className={'font-semibold! text-base!'}
                      />
                    </ClientOnly>
                  </ItemTitle>
                  <ItemDescription className={'font-medium'}>
                    {stat.description}
                  </ItemDescription>
                </ItemContent>
              </Item>
            )
          }

          if (stat.description === 'Samples Collected') {
            return (
              <Item key={stat.id} variant={'outline'}>
                <ItemMedia
                  variant="image"
                  className={cn(
                    'my-auto p-0.5 rounded-full',
                    `${stat.bgColor}`,
                  )}
                >
                  {stat.icon}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className={'font-semibold text-base gap-0'}>
                    <ClientOnly
                      fallback={
                        <span className={'font-semibold! text-base!'}>
                          10,000+
                        </span>
                      }
                    >
                      <OdometerExample
                        target={'odometer-target'}
                        value={10000}
                        duration={2.3}
                        lastDigitDelay={0}
                        className={'font-semibold! text-base!'}
                        suffix={undefined}
                      />
                      {''}+
                    </ClientOnly>
                  </ItemTitle>
                  <ItemDescription className={'font-medium'}>
                    {stat.description}
                  </ItemDescription>
                </ItemContent>
              </Item>
            )
          }

          return (
            <Item key={stat.id} variant={'outline'}>
              <ItemMedia
                variant="image"
                className={cn('my-auto p-0.5 rounded-full', `${stat.bgColor}`)}
              >
                {stat.icon}
              </ItemMedia>
              <ItemContent>
                <ItemTitle className={'font-semibold text-base'}>
                  {stat.stat}
                </ItemTitle>
                <ItemDescription className={'font-medium'}>
                  {stat.description}
                </ItemDescription>
              </ItemContent>
            </Item>
          )
        })}
      </div>
    </div>
  )
}
