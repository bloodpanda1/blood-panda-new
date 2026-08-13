import { Button } from '#/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '#/components/ui/input-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { XCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

const routeApi = getRouteApi('/tests')

export default function SearchItems() {
  const { q } = routeApi.useSearch()

  const [query, setQuery] = useState(q || '')

  const navigate = useNavigate({ from: routeApi.id })

  const handleResetSearch = () => {
    setQuery('')
    navigate({ search: {}, resetScroll: false })
  }

  // Debounce callback
  const debounced = useDebouncedCallback(
    // function
    (val) => {
      setQuery(val)
      navigate({
        search: (prev) => ({
          ...prev,
          primary: undefined,
          secondary: undefined,
          q: val || undefined, // if bouncedQuery is empty string then set it to undefined
        }),
        resetScroll: false,
      })
    },
    // delay in ms
    300,
  )

  return (
    <div className="mx-auto grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput
          placeholder="Type to search..."
          value={query || ''}
          onChange={(e) => debounced(e.target.value.toLocaleLowerCase())}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="secondary">Search</InputGroupButton>

          {q && q.length > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size={'xs'}
                  className={'size-6'}
                  onClick={() => handleResetSearch()}
                >
                  <XCircleIcon className={'size-4'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear</p>
              </TooltipContent>
            </Tooltip>
          ) : null}
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
