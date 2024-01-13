import { type Filters, convertFiltersToString } from '../../stats/filters'

describe('Filters', () => {
  const filters: Filters = {
    'visit:browser': 'Firefox',
    'visit:country': {
      operation: '!=',
      value: ['FR', 'DE'],
    },
  }

  it('convert filters to string', async () => {
    const raw = convertFiltersToString(filters)

    expect(raw).toEqual('visit:browser==Firefox;visit:country!=FR|DE')
  })
})
