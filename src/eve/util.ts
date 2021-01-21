export function isNumeric(n: any) : n is number {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isString(s: any): s is string {
  return typeof s === 'string' || s instanceof String
}

