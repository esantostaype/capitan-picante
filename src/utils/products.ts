import { Product, SelectedVariants } from '@/interfaces'

export const formatOrderId = ( number: number, length: number ) => {
  const numberStr = number.toString()
  const zerosToAdd = Math.max(0, length - numberStr.length)
  const formattedNumber = '0'.repeat(zerosToAdd) + numberStr
  return formattedNumber
}

export const getVariantPrice = ( product: Product, selectedVariantWithPrice: SelectedVariants ): number => {
  const variation = product.variations.find(variation =>
    Object.entries(selectedVariantWithPrice).every(([key, value]) =>
      variation.name === key && variation.options.some( option => option.name === value )
    )
  )

  if ( variation ) {
    const selectedOption = variation.options.find(option => option.name === selectedVariantWithPrice[ variation.name ])
    return selectedOption ? selectedOption.price || 0 : product.price
  }

  return product.price
}

export const generateUniqueId = (
  productId: string, 
  allVariants?: Record<string, string>, 
  additionals?: Record<string, number>,
  notes?: string
): string => {
  
  const variationPart = Object.entries( allVariants || '')
    .map(([, value]) => `${value}`.toLowerCase().replace(/\s+/g, '-'))
    .join('-');

  const additionalsPart = Object.entries( additionals || '' )
    .map(([key, value]) => `${key}`.toLowerCase().replace(/\s+/g, '-') + (value > 1 ? `-${value}` : ''))
    .join('-');

  const notesPart = notes ? notes.toLowerCase().replace(/\s+/g, '-') : ''
    
  const combinedId = [productId, variationPart, additionalsPart, notesPart]
    .filter(part => part)
    .join('-');

  return combinedId
}

export const orderVariants = (
  originalOrder: { name: string }[], 
  variations: Record<string, string>
): Record<string, string> => {
  return Object.keys(variations)
    .sort((a, b) => {
      const indexA = originalOrder.findIndex(variation => variation.name === a)
      const indexB = originalOrder.findIndex(variation => variation.name === b)
      return indexA - indexB
    })
    .reduce((acc, key) => {
      acc[key] = variations[key]
      return acc
    }, {} as Record<string, string>)
}

export const getMinVariantPrice = ( product: Product ): number | undefined => {
  const minVariantPrice = product?.variations
    .flatMap(variation => variation?.options.map(option => option?.price))
    .reduce((min, price) => price! < min! ? price : min, Infinity)

  return minVariantPrice !== Infinity ? minVariantPrice : product.price
}