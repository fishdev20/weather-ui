export interface LocationSummary {
  id: number
  name: string
  country?: string
  region?: string
  latitude: number
  longitude: number
  timezone?: string
}

export interface OpenMeteoGeocodeResponse {
  results?: Array<{
    id: number
    name: string
    country?: string
    admin1?: string
    latitude: number
    longitude: number
    timezone?: string
  }>
}
