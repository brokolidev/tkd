export interface ISettings {
  id: number
  organizationName: string
  email: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
  maximumClassSize: number
  absentAlert: number
  paymentAlert: number
}

export interface IUpdateSetting {
  organizationName?: string
  email?: string
  street?: string
  city?: string
  province?: string
  postalCode?: string
  country?: string
  maximumClassSize?: number
  absentAlert?: number
  paymentAlert?: number
}
