import { cn } from '#/lib/utils'
import {
  BeakerIcon,
  CheckCircle2Icon,
  FileTextIcon,
  MicroscopeIcon,
  SyringeIcon,
  TruckIcon,
} from 'lucide-react'

interface SampleJourneyTrackerProps {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  scheduleDate?: string | Date
}

export function SampleJourneyTracker({
  status,
  scheduleDate,
}: SampleJourneyTrackerProps) {
  if (status === 'CANCELLED') return null

  // Determine current active step index (0 to 3) based on status and dates
  let currentStepIndex = 0

  if (status === 'COMPLETED') {
    currentStepIndex = 4 // All completed
  } else if (status === 'CONFIRMED') {
    // If it's confirmed, we can guess the progress based on schedule date
    if (scheduleDate) {
      const scheduled = new Date(scheduleDate)
      const now = new Date()

      // If scheduled time has passed, let's pretend it's in transit or processing
      if (now > scheduled) {
        // Just for demo, we can simulate step 1 or 2 based on how much time has passed
        const hoursPassed = (now.getTime() - scheduled.getTime()) / (1000 * 60 * 60)
        if (hoursPassed > 12) {
          currentStepIndex = 2 // Processing
        } else if (hoursPassed > 2) {
          currentStepIndex = 1 // In-transit
        } else {
          currentStepIndex = 0 // Collection done / happening
        }
      } else {
        currentStepIndex = -1 // Not even collected yet (waiting for schedule)
      }
    } else {
      currentStepIndex = 1 // default to in-transit if no date
    }
  }

  const steps = [
    {
      id: 'collection',
      label: 'Collection',
      description: 'Sample collected',
      icon: SyringeIcon,
    },
    {
      id: 'transit',
      label: 'In-Transit',
      description: 'Heading to lab',
      icon: TruckIcon,
    },
    {
      id: 'processing',
      label: 'Processing',
      description: 'Analyzing sample',
      icon: MicroscopeIcon,
    },
    {
      id: 'report',
      label: 'Report',
      description: 'Results generated',
      icon: FileTextIcon,
    },
  ]

  return (
    <div className="w-full py-4 px-2">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-[10%] right-[10%] top-4 h-0.5 bg-muted -z-10" />
        
        {/* Active track line */}
        <div 
          className="absolute left-[10%] top-4 h-0.5 bg-primary -z-10 transition-all duration-500 ease-in-out" 
          style={{ 
            width: currentStepIndex >= 0 ? `${(Math.min(currentStepIndex, 3) / 3) * 80}%` : '0%',
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStepIndex > index || status === 'COMPLETED'
          const isActive = currentStepIndex === index && status !== 'COMPLETED'
          const isPending = currentStepIndex < index && status !== 'COMPLETED'

          const Icon = step.icon

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 w-1/4">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border-2 transition-colors duration-300 bg-background',
                  isCompleted
                    ? 'border-primary text-primary'
                    : isActive
                      ? 'border-primary text-primary ring-4 ring-primary/20'
                      : 'border-muted-foreground/30 text-muted-foreground/50'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2Icon className="size-5" />
                ) : (
                  <Icon className="size-4" />
                )}
              </div>
              <div className="text-center space-y-0.5">
                <p
                  className={cn(
                    'text-xs font-semibold',
                    (isCompleted || isActive) ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
