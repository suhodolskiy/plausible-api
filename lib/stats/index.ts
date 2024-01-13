import { type Filters, convertFiltersToString } from './filters'

interface Config {
  apiUrl: string
  /**
   * Each request must be authenticated with an API key using the Bearer Token method.
   * You can obtain an API key for your account by going to your user settings page.
   */
  apiKey: string
}

/**
 * Metrics
 * @link https://plausible.io/docs/stats-api#metrics
 */
type Metric = 'visitors' | 'pageviews' | 'bounce_rate' | 'visit_duration'

interface AggregateOptions {
  metrics?: Metric[]
  period?: string
  compare?: string
  filters?: Filters
}

interface TimeseriesOptions {
  interval?: string
  period?: string
  metrics?: Metric[]
  filters?: Filters
}

interface BreakdownOptions {
  period?: string
  metrics?: Metric[]
  limit?: number
  page?: number
  filters?: Filters
}

type AggregateResult = Record<
  string,
  {
    value: string
  }
>

type TimeseriesResult = Array<{
  [key: string]: number | string
  date: string
}>

interface Results<T> {
  results: T
}

export class Stats {
  constructor(private config: Config) {}

  private request<T>(endpoint: string, params: URLSearchParams) {
    const headers = new Headers({
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.config.apiKey}`,
    })

    return fetch(
      `${this.config.apiUrl}/api/v1/${endpoint}?${params.toString()}`,
      {
        headers,
      }
    ).then((res) => {
      if (res.ok) {
        return res.json() as T | undefined
      }

      throw new Error(res.statusText)
    })
  }

  /**
   * Realtime Visitors (GET /api/v1/stats/realtime/visitors)
   * @link https://plausible.io/docs/stats-api#get-apiv1statsrealtimevisitors
   */
  async realtimeVisitors(siteId: string) {
    return await this.request<number>(
      `stats/realtime/visitors`,
      new URLSearchParams({ site_id: siteId })
    )
  }

  /**
   * Aggregate Stats (GET /api/v1/stats/aggregate)
   * @link https://plausible.io/docs/stats-api#get-apiv1statsaggregate
   */
  async aggregate(siteId: string, options?: AggregateOptions) {
    const params = new URLSearchParams({ site_id: siteId })

    if (options?.metrics) {
      params.append('metrics', options.metrics.join(','))
    }

    if (options?.period) {
      params.append('period', options.period)
    }

    if (options?.compare) {
      params.append('compare', options.compare)
    }

    if (options?.filters) {
      params.append('filters', convertFiltersToString(options.filters))
    }

    return await this.request<Results<AggregateResult>>(
      'stats/aggregate',
      params
    ).then((resp) => resp?.results)
  }

  /**
   * Timeseries Stats (GET /api/v1/stats/timeseries)
   * @link https://plausible.io/docs/stats-api#get-apiv1statsaggregate
   */
  async timeseries(siteId: string, options?: TimeseriesOptions) {
    const params = new URLSearchParams({ site_id: siteId })

    if (options?.metrics) {
      params.append('metrics', options.metrics.join(','))
    }

    if (options?.period) {
      params.append('period', options.period)
    }

    if (options?.interval) {
      params.append('interval', options.interval)
    }

    if (options?.filters) {
      params.append('filters', convertFiltersToString(options.filters))
    }

    return await this.request<Results<TimeseriesResult>>(
      'stats/timeseries',
      params
    ).then((resp) => resp?.results)
  }

  /**
   * Breakdown Stats (GET /api/v1/stats/breakdown)
   * @link https://plausible.io/docs/stats-api#get-apiv1statsbreakdown
   * @param property https://plausible.io/docs/stats-api#properties
   */
  async breakdown(
    siteId: string,
    property: string,
    options?: BreakdownOptions
  ) {
    const params = new URLSearchParams({
      site_id: siteId,
      property,
    })

    if (options?.metrics) {
      params.append('metrics', options.metrics.join(','))
    }

    if (options?.period) {
      params.append('period', options.period)
    }

    if (options?.limit) {
      params.append('limit', options.limit + '')
    }

    if (options?.page) {
      params.append('page', options.page + '')
    }

    if (options?.filters) {
      params.append('filters', convertFiltersToString(options.filters))
    }

    return await this.request('stats/breakdown', params)
  }
}
