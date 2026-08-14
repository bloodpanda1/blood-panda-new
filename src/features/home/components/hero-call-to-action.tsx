import { FlaskConical, ClipboardList, Stethoscope, Phone } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export default function HeroCallToAction() {
  return (
    <div className="w-full space-y-6 mt-8">
      {/* Trust Markers */}
      {/* <div className="flex flex-col sm:flex-row items-center justify-between bg-background border rounded-xl p-4 sm:p-6 shadow-sm gap-4 sm:gap-0">
        <div className="flex items-center gap-4 flex-1 justify-center w-full mx-auto px-4">
          <div className="bg-red-600 text-white p-3 rounded-full flex-shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
          <p className="font-medium text-sm sm:text-base leading-tight text-left">Fast Sample<br/>Collection</p>
        </div>

        <div className="hidden sm:block h-12 w-px bg-border flex-shrink-0"></div>
        <div className="block sm:hidden w-full h-px bg-border"></div>

        <div className="flex items-center gap-4 flex-1 justify-center w-full mx-auto px-4">
          <div className="bg-blue-700 text-white p-3 rounded-full flex-shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <p className="font-medium text-sm sm:text-base leading-tight text-left">Accurate<br/>Reports</p>
        </div>

        <div className="hidden sm:block h-12 w-px bg-border flex-shrink-0"></div>
        <div className="block sm:hidden w-full h-px bg-border"></div>

        <div className="flex items-center gap-4 flex-1 justify-center w-full mx-auto px-4">
          <div className="bg-red-600 text-white p-3 rounded-full flex-shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <p className="font-medium text-sm sm:text-base leading-tight text-left">Expert Care<br/>Across Bangalore</p>
        </div>
      </div> */}

      {/* Booking Card */}
      <div className="bg-[#FDFBF7] border border-[#0b1b4d]/10 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="bg-[#0b1b4d]/10 text-[#0b1b4d] p-4 rounded-full flex-shrink-0">
            <Phone className="w-8 h-8 fill-current" />
          </div>
          <div className="text-[#0b1b4d]">
            <p className="text-sm sm:text-base text-[#0b1b4d]/80 font-medium">Book Your Test Today</p>
            <p className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-wide mt-1">8277842200</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[280px]">
          <Link
            to="/booking"
            viewTransition
            className={cn(buttonVariants({ size: 'lg' }), "bg-red-600 hover:bg-red-700 text-white w-full rounded-lg text-lg font-semibold h-12")}
          >
            Book a Test
          </Link>
          <Link
            to="/tests"
            viewTransition
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "bg-white text-[#0b1b4d] hover:bg-slate-100 border-[#0b1b4d]/20 w-full rounded-lg text-lg font-semibold h-12 shadow-sm")}
          >
            Explore Packages
          </Link>
        </div>
      </div>
    </div>
  )
}
