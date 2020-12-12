export function override (container: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const baseType = Object.getPrototypeOf(container)
  if (!(propertyKey in baseType)) {
    throw new Error(`Method ${propertyKey} of ${container.constructor.name} does not override any base class method`)
  }
}
