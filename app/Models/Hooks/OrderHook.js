'use strict'

const OrderHook = (exports = module.exports = {})

OrderHook.updateValues = async (model) => {
  model.$sideLoaded.subtotal = await model.items().getSum('subtotal')
  model.qty_items = await model.items().getSum('quantity')
  model.$sideLoaded.discount = await model.discounts().getSum('discount')
  model.total = model.$sideLoaded.subtotal - model.$sideLoaded.discount
}

OrderHook.updateCollectionValues = async (models) => {
  const modelCollectionPromise = models.map((model) =>
    OrderHook.updateValues(model)
  )
  await Promise.all(modelCollectionPromise)
}
