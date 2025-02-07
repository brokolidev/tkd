'use client'

import { Input } from '@/components/input'
import { Listbox, ListboxLabel, ListboxOption } from '@/components/listbox'
import { getCountries } from '@/data'
import { useState } from 'react'

export function Address({ value, onChange }) {
  let countries = getCountries()
  let [country, setCountry] = useState(countries[0])

  return (
    <div className="grid grid-cols-2 gap-6">
      <Input
        aria-label="Street Address"
        className="col-span-2"
        name="address"
        placeholder="Street Address"
        value={value.street}
        onChange={(e) => onChange({ ...value, street: e.target.value })}
      />
      <Input aria-label="City" name="city" value={value.city} className="col-span-2" />
      <Listbox
        aria-label="Region"
        name="region"
        placeholder="Region"
        value={value.province}
        onChange={(province) => onChange({ ...value, province })}
      >
        {country.regions.map((region) => (
          <ListboxOption key={region} value={region}>
            <ListboxLabel>{region}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
      <Input
        aria-label="Postal code"
        name="postal_code"
        placeholder="Postal Code"
        value={value.postalCode}
        onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
      />
      <Listbox
        aria-label="Country"
        name="country"
        placeholder="Country"
        by="code"
        value={value.country}
        onChange={(country) => onChange({ ...value, country })}
        className="col-span-2"
      >
        {countries.map((country) => (
          <ListboxOption key={country.code} value={country}>
            <img className="w-5 sm:w-4" src={country.flagUrl} alt="" />
            <ListboxLabel>{country.name}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
    </div>
  )
}
