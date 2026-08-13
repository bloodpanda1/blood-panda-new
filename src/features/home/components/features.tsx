import { Button } from '#/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '#/components/ui/item'
import { featureItems } from '#/constants'
import { cn } from '#/lib/utils'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

export default function Features() {
  return (
    <section

    // className={'space-y-4 mt-105 sm:mt-55 md:mt-48 lg:mt-32 xl:mt-20'}
    >
      <h2
        className={
          'text:xl md:text-2xl lg:text-3xl xl:text-4xl font-medium lg:font-semibold'
        }
      >
        Need Assistance?
      </h2>

      <ItemGroup className="w-full flex-row flex-wrap lg:flex-nowrap">
        {featureItems.map((item) => (
          <Item key={item.id} variant="outline" className={'bg-blue-500/10'}>
            <ItemMedia
              variant={'image'}
              className={cn('my-auto p-0.5 rounded-full', `${item.bgColor}`)}
            >
              {item.icon}
            </ItemMedia>
            <ItemContent className="gap-1">
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDescription>{item.desc}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant={'ghost'} className={'size-10'} asChild>
                {item.href === '/profile' ? (
                  <Link to={item.href} viewTransition>
                    <ChevronRight className={'size-6 text-blue-600'} />
                  </Link>
                ) : (
                  <Link
                    to={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ChevronRight className={'size-6 text-blue-600'} />
                  </Link>
                )}
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
