import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandThreads,
  IconBrandWhatsapp,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import {
  ChevronRightIcon,
  Globe2Icon,
  MailPlusIcon,
  PhoneCallIcon,
} from 'lucide-react'
import { Button, buttonVariants } from './ui/button'
// import { Card, CardAction, CardContent, CardDescription } from './ui/card'

export default function Footer() {
  return (
    <footer
      className={
        'mx-auto max-w-(--breakpoint-xl) space-y-8 rounded-tl-lg rounded-tr-lg bg-blue-700 px-4 py-8'
      }
    >
      <div className={'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'}>
        <div className={'space-y-4'}>
          <div className={'flex flex-col items-start justify-center'}>
            <img src="/logo-idol.png" alt="logo" width={70} height={49} />
            <img src="/logo-txt.png" alt="logo" width={196} height={34} />
          </div>

          <p className={'text-background'}>
            <span className={'inline-block'}>Your Health, Our Priority</span>
            <span className={'inline-block'}>
              Smart diagnostics, delivered home.
            </span>
          </p>

          <Button
            type="button"
            variant={'outline'}
            className={
              'rounded-full bg-transparent text-green-300 hover:bg-green-500 hover:text-background w-full'
            }
            asChild
          >
            <a
              href="https://wa.link/fvmq1j"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandWhatsapp className={'size-4'} />
              Chat on Whatsapp
            </a>
          </Button>

          <div className={'flex items-center justify-center gap-3'}>
            <a
              href="https://www.facebook.com/share/1D82dU3Uad/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'link', size: 'icon' })}
            >
              <IconBrandFacebook className={'size-5 stroke-accent'} />
            </a>
            <a
              href="https://www.threads.com/@bloodpandaofficial?igshid=NTc4MTIwNjQ2YQ=="
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'link', size: 'icon' })}
            >
              <IconBrandThreads className={'size-5 stroke-accent'} />
            </a>

            <a
              href="https://www.instagram.com/bloodpandaofficial?utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'link', size: 'icon' })}
            >
              <IconBrandInstagram className={'size-5 stroke-accent'} />
            </a>
          </div>
        </div>
        <div className={'space-y-2'}>
          <h5 className={'font-semibold text-background'}>Quick Links</h5>
          <ul>
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <Link
                  to="/packages/$package"
                  params={{ package: 'diamond' }}
                  viewTransition
                >
                  <ChevronRightIcon className={'size-4'} />
                  Health Packages
                </Link>
              </Button>
            </li>
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <Link to="/tests" viewTransition>
                  <ChevronRightIcon className={'size-4'} />
                  Popular Tests
                </Link>
              </Button>
            </li>
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <Link to="/tests" viewTransition>
                  <ChevronRightIcon className={'size-4'} />
                  Health by Category
                </Link>
              </Button>
            </li>
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <Link to="/blogs" viewTransition>
                  <ChevronRightIcon className={'size-4'} />
                  Blogs
                </Link>
              </Button>
            </li>
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <Link to="/booking" viewTransition>
                  <ChevronRightIcon className={'size-4'} />
                  Book Home Collection
                </Link>
              </Button>
            </li>
          </ul>
        </div>
        <div className={'space-y-2'}>
          <h5 className={'font-semibold text-background'}>Contact</h5>
          <ul>
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <a href="tel:+918277842200">
                  <PhoneCallIcon className={'size-4'} />
                  +91 82778 42200
                </a>
              </Button>
            </li>
            {/* <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <a href="tel:+919999911111">
                  <PhoneCallIcon className={'size-4'} />
                  +91 99999 11111
                </a>
              </Button>
            </li> */}
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <a href="mailto:support@bloodpanda.com">
                  <MailPlusIcon className={'size-4'} />
                  support@bloodpanda.com
                </a>
              </Button>
            </li>
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <a href="mailto:info@bloodpanda.com">
                  <MailPlusIcon className={'size-4'} />
                  info@bloodpanda.com
                </a>
              </Button>
            </li>
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <a href="https://www.bloodpanda.com">
                  <Globe2Icon className={'size-4'} />
                  www.bloodpanda.com
                </a>
              </Button>
            </li>
          </ul>
        </div>
        <div className={'space-y-2'}>
          {/* here will come privacy-policy, refund-policy, terem and condition for what heading is suitable, suggest me */}
          <h5 className={'font-semibold text-background'}>Policies & Terms</h5>
          <ul>
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <Link to="/privacy-policy" viewTransition>
                  <ChevronRightIcon className={'size-4'} />
                  Privacy Policy
                </Link>
              </Button>
            </li>
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <Link to="/terms-and-condition" viewTransition>
                  <ChevronRightIcon className={'size-4'} />
                  Terms and Conditions
                </Link>
              </Button>
            </li>
            <li>
              <Button
                variant={'link'}
                asChild
                size={'sm'}
                className={'px-0 text-background'}
              >
                <Link to="/refund-policy" viewTransition>
                  <ChevronRightIcon className={'size-4'} />
                  Refund Policy
                </Link>
              </Button>
            </li>
          </ul>
        </div>
        {/* <div className={'space-y-2'}>
          <h5 className={'font-semibold text-background'}>Book now</h5>
          <Card className={''}>
            <CardContent className={'space-y-2'}>
              <CardDescription className={'text-backgroundd'}>
                Book your home collection in 60 seconds on Whatsapp.
              </CardDescription>
              <CardAction>
                <Button type="button" className={'w-full'} asChild>
                  <a
                    href="https://wa.link/fvmq1j"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat Now <ChevronRightCircleIcon className={'size-4'} />
                  </a>
                </Button>
              </CardAction>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </footer>
  )
}
