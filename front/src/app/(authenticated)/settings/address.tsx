'use client'

import { Input } from '@/components/input'
import { Listbox, ListboxLabel, ListboxOption } from '@/components/listbox'
import { getCountries } from '@/data'

interface AddressProps {
  street: string
  city: string
  province: string
  postalCode: string
  country: string
  onChange: (field: string, value: string) => void
}

export function Address({ street, city, province, postalCode, country, onChange }: AddressProps) {
  let countries = getCountries()
  const selectedCountry = countries.find((c) => c.name === country) || countries[0]

  return (
    <div className="grid grid-cols-2 gap-6">
      <Input
        aria-label="Street Address"
        className="col-span-2"
        name="address"
        placeholder="Street Address"
        value={street}
        onChange={(e) => onChange('street', e.target.value)}
      />
      <Input
        aria-label="City"
        name="city"
        value={city}
        onChange={(e) => onChange('city', e.target.value)}
        className="col-span-2"
      />
      <Listbox
        aria-label="Region"
        name="province"
        placeholder="Region"
        value={province}
        onChange={(value) => onChange('province', value)}
      >
        {selectedCountry.regions.map((region) => (
          <ListboxOption key={region} value={region}>
            <ListboxLabel>{region}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
      <Input
        aria-label="Postal code"
        name="postal_code"
        placeholder="Postal Code"
        value={postalCode}
        onChange={(e) => onChange('postalCode', e.target.value)}
      />
      <Listbox aria-label="Country" name="country" value={country} onChange={(value) => onChange('country', value)}>
        {countries.map((c) => (
          <ListboxOption key={c.name} value={c.name}>
            <ListboxLabel>{c.name}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
    </div>
  )
}
