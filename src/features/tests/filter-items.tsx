import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Skeleton } from '#/components/ui/skeleton'
import { formattedCategoryName } from '#/lib/utils'
import { Route } from '#/routes/tests'
import { Await, getRouteApi, useNavigate } from '@tanstack/react-router'

const routeApi = getRouteApi('/tests')

export default function FilterItems() {
  const { primary, secondary } = routeApi.useSearch()

  const navigate = useNavigate({ from: routeApi.id })

  const { primaryCategories, deferredPromise } = Route.useLoaderData()

  const handlePrimaryChange = (e: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        primary: e,
        q: undefined,
        secondary: undefined,
      }),
      resetScroll: false,
    })
  }

  const handleSecondaryChange = (e: string) => {
    navigate({
      search: (prev) => ({ ...prev, secondary: e, q: undefined }),
      resetScroll: false,
    })
  }

  return (
    <div className={'grid grid-cols-3 gap-4'}>
      <div className={'col-span-full sm:col-span-1'}>
        <Select
          value={primary || '754513c0-4454-4fa0-83fc-c31bfd3c0e17'}
          onValueChange={(e) => handlePrimaryChange(e)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent position="popper" popover="hint">
            <SelectGroup>
              <SelectLabel>Primary Category (Main category)</SelectLabel>
              {primaryCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {formattedCategoryName(category.label)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className={'col-span-full sm:col-span-1'}>
        <Await
          promise={deferredPromise}
          fallback={<Skeleton className={'h-10 w-full'} />}
        >
          {(data) => {
            return (
              <Select
                value={secondary || 'd5ac78e9-9937-489b-ac13-4f3a4692386b'}
                onValueChange={(e) => handleSecondaryChange(e)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a sub category" />
                </SelectTrigger>
                <SelectContent position="popper" popover="hint">
                  <SelectGroup>
                    <SelectLabel>Secondary Category (Sub-category)</SelectLabel>
                    {data.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {formattedCategoryName(category.label)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )
          }}
        </Await>
      </div>
      <div className={'col-span-full sm:col-span-1'}>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose order" />
          </SelectTrigger>
          <SelectContent position="popper" popover="hint">
            <SelectGroup>
              <SelectLabel>Choose order</SelectLabel>
              <SelectItem value="asc">Ascending (A-Z)</SelectItem>
              <SelectItem value="desc">Descending (Z-A)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
