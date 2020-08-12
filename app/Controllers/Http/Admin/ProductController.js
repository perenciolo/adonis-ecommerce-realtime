'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {object} ctx.pagination
   */
  async index({ request, response, pagination }) {
    const title = request.input('title')
    const query = Product.query()

    if (title) {
      query.where('name', 'ILIKE', `%${title}%`)
    }

    const products = await query.paginate(pagination.page, pagination.limit)
    return response.json(products)
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      const { name, description, price, image_id: imageId } = request.all()
      const product = await Product.create({
        name,
        description,
        price,
        image_id: imageId
      })
      return response.status(201).json(product)
    } catch (error) {
      return response.status(400).json({
        message: 'Error creating product with given data'
      })
    }
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)
    return response.send(product)
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)
    try {
      const { name, description, price, image_id: imageId } = request.all()
      product.merge({ name, description, price, image_id: imageId })
      await product.save()
      return response.json(product)
    } catch (error) {
      return response.status(400).json({
        message: 'Error updating product with given data'
      })
    }
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)
    try {
      await product.delete()
      return response.status(204).json()
    } catch (error) {
      return response.status(500).json({
        message: 'It was not possible to delete this product, please try again'
      })
    }
  }
}

module.exports = ProductController
