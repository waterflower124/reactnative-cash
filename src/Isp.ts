import translate  from './translate'

export enum Isp {
  Other = <any> 'other',
  Bouygues = <any> 'bouygues',
  Facebook = <any> 'facebook',
  Free = <any> 'free',
  Gmail = <any> 'google',
  Orange = <any> 'orange',
  Outlook = <any> 'outlook',
  Sfr = <any> 'sfr',
  Yahoo = <any> 'yahoo',
}

export function getIspIdentifier(isp: Isp): string {
  return isp.toString()
}

export function fromIspIdentifier(ispIdentifier: string): Isp {
  ispIdentifier = ispIdentifier.toLowerCase()

  if (Isp[ispIdentifier]) {
    return ispIdentifier as any
  }

  return ispIdentifier as any // This is only for unknown prodiders (aka other)
  // throw new Error(`unknown isp identifier "${ispIdentifier}"`)
}

export function getIspName(isp: Isp): string {
  return translate(`isp.${isp}`)
}
