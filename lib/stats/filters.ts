/**
 * Filters
 * @link https://plausible.io/docs/stats-api#filtering
 */
export type Filters = Record<
  string,
  FilterValue | { operation?: FilterOp; value: FilterValue }
>

export type FilterOp = '==' | '!='

export type FilterValue = string | string[]

const prepareFilterValue = (value: FilterValue) =>
  Array.isArray(value) ? value.join('|') : value

export const convertFiltersToString = (filters: Filters): string =>
  Object.entries(filters)
    .map(([key, filter]) => {
      let op: FilterOp = '=='
      let value = ''

      if (Array.isArray(filter) || typeof filter === 'string') {
        value = prepareFilterValue(filter)
      } else {
        value = prepareFilterValue(filter.value)

        if (filter.operation) {
          op = filter.operation
        }
      }

      return `${key}${op}${value}`
    })
    .join(';')
