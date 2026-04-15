import type { Request, Response } from 'express';
import { productService } from '../services/product.service.js';

export const productsController = {
  async list(req: Request, res: Response) {
    try {
      const result = await productService.list(req.query as never);
      res.json({ success: true, data: result });
    } catch (err) {
      console.error('[products.list]', err);
      res.json({ success: true, data: { products: [], total: 0, page: 1, pageSize: 20, totalPages: 0 } });
    }
  },

  async featured(_req: Request, res: Response) {
    try {
      const products = await productService.getFeatured();
      res.json({ success: true, data: products });
    } catch (err) {
      console.error('[products.featured]', err);
      res.json({ success: true, data: [] });
    }
  },

  async getBySlug(req: Request, res: Response) {
    const product = await productService.getBySlug(req.params.slug);
    res.json({ success: true, data: product });
  },

  async related(req: Request, res: Response) {
    try {
      const product = await productService.getById(req.params.id);
      const related = await productService.getRelated(product.id, product.categoryId);
      res.json({ success: true, data: related });
    } catch {
      res.json({ success: true, data: [] });
    }
  },

  async create(req: Request, res: Response) {
    const product = await productService.create(req.body);
    res.status(201).json({ success: true, data: product });
  },

  async update(req: Request, res: Response) {
    const product = await productService.update(req.params.id, req.body);
    res.json({ success: true, data: product });
  },

  async delete(req: Request, res: Response) {
    await productService.delete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  },

  async addImage(req: Request, res: Response) {
    const image = await productService.addImage(req.params.id, req.body);
    res.status(201).json({ success: true, data: image });
  },

  async deleteImage(req: Request, res: Response) {
    await productService.deleteImage(req.params.imageId);
    res.json({ success: true, message: 'Image removed' });
  },

  async adjustInventory(req: Request, res: Response) {
    const { delta } = req.body as { delta: number };
    const product = await productService.adjustInventory(req.params.id, delta);
    res.json({ success: true, data: product });
  },
};
