import { Badge } from '#/components/ui/badge'
import { buttonVariants } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '#/components/ui/item'
import { Separator } from '#/components/ui/separator'
import {
  IconBrandWhatsapp,
  IconClock,
  IconHeadset,
  IconMapCheck,
  IconPhoneCall,
} from '@tabler/icons-react'
import { Image } from '@unpic/react'

export default function ContactInfo() {
  return (
    <Card className={'rounded-none shadow-none ring-0 bg-transparent'}>
      <CardHeader className={'gap-2 lg:gap-4'}>
        <CardDescription className={'row-start-1'}>
          <Badge
            variant={'outline'}
            className={'lg:text-sm h-fit lg:[&>svg]:size-6!'}
          >
            <IconHeadset />
            We’re here for You
          </Badge>
        </CardDescription>
        <CardTitle className={'row-start-2'}>
          <h1
            className={
              'text-foreground font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'
            }
          >
            <span>How can we</span>{' '}
            <span className={'text-destructive'}>help you?</span>
          </h1>
        </CardTitle>
        <CardDescription className={'row-start-3'}>
          <p>
            Reach out to us for any queries, assistance with bookings, or help
            with choosing the right tests and packages.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className={'relative my-auto px-0 bg-transparent'}>
        <Card className={'bg-transparent shadow-none ring-0 rounded-none'}>
          <CardContent>
            <ItemGroup className={'bg-transparent'}>
              <Item size={'sm'} variant={'muted'}>
                <ItemMedia variant="image">
                  <IconMapCheck />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>Our Location</ItemDescription>
                  <address>
                    <p className={'text-sm'}>
                      8<sup>th</sup> Cross Road, Sai Sree Layout,
                      <br />(<small>Near Electronic City</small>)
                      <br />
                      Bengaluru, Karnataka 560100
                    </p>
                  </address>
                  <ItemTitle>
                    <a
                      href="https://maps.app.goo.gl/rtbNTeYYabsyUyyDA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        variant: 'link',
                        size: 'sm',
                        className: 'h-fit px-0!',
                      })}
                    >
                      Get Directions
                    </a>
                  </ItemTitle>
                </ItemContent>
              </Item>
              <Separator />
              <Item size={'sm'} variant={'muted'}>
                <ItemMedia variant="image">
                  <IconPhoneCall />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>Call or WhatsApp Us</ItemDescription>
                  <ItemTitle>
                    <a
                      href="https://wa.link/fvmq1j"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        variant: 'link',
                        size: 'sm',
                        className: 'h-fit px-0!',
                      })}
                    >
                      +91 82778 42200
                    </a>
                  </ItemTitle>
                </ItemContent>
              </Item>
              <Separator />
              <Item size={'sm'} variant={'muted'}>
                <ItemMedia variant="image">
                  <IconBrandWhatsapp />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>Email Us</ItemDescription>
                  <ItemTitle>
                    <a
                      href="mailto:info@bloodpanda.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({
                        variant: 'link',
                        size: 'sm',
                        className: 'h-fit px-0!',
                      })}
                    >
                      info@bloodpanda.com
                    </a>
                  </ItemTitle>
                </ItemContent>
              </Item>
              <Separator />
              <Item size={'sm'} variant={'muted'}>
                <ItemMedia variant="image">
                  <IconClock />
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>We're Available</ItemDescription>
                  <ItemTitle>6:00 AM – 10:00 PM Everyday</ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
          </CardContent>
          <CardFooter>
            <h2
              className={
                'text-base lg:text-xl xl:text-2xl font-semibold text-foreground'
              }
            >
              <span>Your Health.</span>{' '}
              <span className={'text-destructive'}>Our Priority</span>
            </h2>
          </CardFooter>
        </Card>

        <Image
          src="/contact-us.png"
          alt="not-found"
          layout="constrained"
          height={294}
          width={397}
          className={
            'h-full xs:h-100 md:h-90 lg:h-120 w-fit object-contain object-bottom-right absolute bottom-0 right-0 hidden sm:block'
          }
        />
      </CardContent>
    </Card>
  )
}
