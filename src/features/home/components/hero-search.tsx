import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '#/components/ui/input-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { useNavigate } from '@tanstack/react-router'
import { GlassesIcon, XCircleIcon } from 'lucide-react'
import { useState } from 'react'

export default function HeroSearch() {
  const [selectPopular, setSelectPopular] = useState('')
  const [query, setQuery] = useState(selectPopular || '')

  const navigate = useNavigate({ from: '/' })

  function handleSearch(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    navigate({
      to: '/tests',
      search: (prev) => ({
        ...prev,
        primary: undefined,
        secondary: undefined,
        q: query || undefined,
      }),
      state: (prev) => ({
        ...prev,
        bouncedQuery: query || undefined, // if bouncedQuery is empty string then set it to undefined
      }),
      resetScroll: false,
      viewTransition: true,
    })
  }

  function handleResetSearch() {
    setQuery('')
    setSelectPopular('')
  }

  function handlePopularSearch(item: string) {
    setSelectPopular(item)
    setQuery(item.toLocaleLowerCase())
    // navigate({
    //   to: '/tests',
    //   search: (prev) => ({
    //     ...prev,
    //     primary: undefined,
    //     secondary: undefined,
    //     q: item.toLocaleLowerCase() || undefined,
    //   }),
    //   state: (prev) => ({
    //     ...prev,
    //     bouncedQuery: item.toLocaleLowerCase() || undefined, // if bouncedQuery is empty string then set it to undefined
    //   }),
    //   resetScroll: false,
    //   viewTransition: true,
    // })
    return
  }

  return (
    <form className={'px-0 space-y-4'} onSubmit={handleSearch}>
      <InputGroup>
        <InputGroupInput
          placeholder="Search tests, packages or health checkups"
          value={query || ''}
          onChange={(e) => setQuery(e.target.value.trim().toLocaleLowerCase())}
        />
        <InputGroupAddon align={'inline-end'}>
          <InputGroupButton
            type="submit"
            className={
              'bg-destructive text-accent hover:text-destructive hover:bg-accent group transition-all duration-300 ease-in-out'
            }
          >
            <InputGroupText
              className={'text-accent group-hover:text-destructive'}
            >
              Search
            </InputGroupText>
            <GlassesIcon className={'size-4'} />
          </InputGroupButton>
          {query && query.length > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size={'xs'}
                  variant={'destructive'}
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
      <div className={'flex flex-wrap items-center gap-2'}>
        <p>Popular search:</p>

        <div className={'flex items-center gap-1'}>
          {['CBC', 'Diabetes', 'Thyroid', 'Vitamin D'].map((item) => (
            <Badge
              key={item}
              className={'cursor-pointer'}
              variant={'destructive'}
              onClick={() => {
                handlePopularSearch(item)
              }}
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </form>
  )
}
