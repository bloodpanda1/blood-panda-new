import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '#/components/ui/item'
import { bookingSteps } from '#/constants'
import { Fragment } from 'react/jsx-runtime'

export default function BookingSteps() {
  return (
    <section>
      <Card
        className={'rounded-none border-0 bg-transparent shadow-none ring-0'}
      >
        <CardHeader>
          <CardTitle>
            <h3
              className={
                'text-center text-base md:text-xl lg:text-2xl xl:text-3xl'
              }
            >
              Book Your Test in 3 Easy Steps
            </h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup className="w-full flex-row flex-wrap lg:flex-nowrap">
            {bookingSteps.map((step, idx) => {
              const isLastItem =
                bookingSteps.lastIndexOf(bookingSteps[idx + 1]) === idx + 1
              return (
                <Fragment key={step.id}>
                  <Item
                    variant={'outline'}
                    className={'justify-center md:justify-between'}
                  >
                    <ItemMedia
                      variant={'default'}
                      className={'size-8 rounded-full bg-accent p-2'}
                    >
                      {idx + 1}
                    </ItemMedia>
                    <ItemContent className={'min-w-16 md:min-w-auto'}>
                      <ItemTitle>{step.title}</ItemTitle>
                      <ItemDescription>{step.desc}</ItemDescription>
                    </ItemContent>
                    <ItemMedia variant={'icon'}>
                      <img
                        src={step.icon}
                        alt={step.title}
                        width={'100%'}
                        height={'100%'}
                        className={'h-full w-full'}
                      />
                    </ItemMedia>
                  </Item>
                  {isLastItem ? <ItemSeparator orientation="vertical" /> : null}
                </Fragment>
              )
            })}
          </ItemGroup>
        </CardContent>
      </Card>
    </section>
  )
}
