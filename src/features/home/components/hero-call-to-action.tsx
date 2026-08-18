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
      <div className="bg-[#FDFBF7] border border-[#0b1b4d]/10 rounded-xl p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-sm">
        <a 
          href="https://wa.link/fvmq1j" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 sm:gap-4 md:gap-6 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="bg-[#E8F7EE] p-3 sm:p-4 rounded-full flex-shrink-0">
            <img src="/whatsapp-icon.png" alt="WhatsApp" className="w-7 h-7 sm:w-10 sm:h-10 object-contain" />
          </div>
          <div className="text-[#0b1b4d]">
            <p className="text-xs sm:text-sm md:text-base text-[#0b1b4d]/80 font-medium">Book Your Test Today</p>
            <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold tracking-wide mt-0.5 sm:mt-1">8277842200</p>
          </div>
        </a>

        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto md:min-w-[240px]">
          <Link
            to="/booking"
            viewTransition
            className={cn(buttonVariants({ size: 'lg' }), "bg-red-600 hover:bg-red-700 text-white flex-1 md:flex-none md:w-full rounded-lg text-xs sm:text-base font-semibold h-10 sm:h-12 px-2 sm:px-4")}
          >
            Book a Test
          </Link>
          <Link
            to="/tests"
            viewTransition
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), "bg-white text-[#0b1b4d] hover:bg-slate-100 border-[#0b1b4d]/20 flex-1 md:flex-none md:w-full rounded-lg text-xs sm:text-base font-semibold h-10 sm:h-12 shadow-sm px-2 sm:px-4")}
          >
            <span className="sm:hidden">Packages</span>
            <span className="hidden sm:inline">Explore Packages</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
