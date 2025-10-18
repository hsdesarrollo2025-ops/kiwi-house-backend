'use strict';

module.exports = async ({ strapi }) => {
  const existing = await strapi.db
    .query('api::tax-category.tax-category')
    .findMany({ select: ['id'] });

  if (existing.length > 0) {
    strapi.log.info('Seed tax-categories: registros ya existentes, sin cambios.');
    return;
  }

  const categories = [
    {
      code: 'A', grossIncomeLimit: 8992597.87, surfaceLimit: 'Hasta 30 m²',
      electricityLimit: 'Hasta 3330 Kw', rentLimit: 2091301.83, maxUnitPrice: 536767.47,
      servicesTax: 4182.60, goodsTax: 4182.60, sipaContribution: 13663.17,
      healthContribution: 19239.97, servicesAmount: 37085.74, goodsAmount: 37085.74,
    },
    {
      code: 'B', grossIncomeLimit: 13175201.52, surfaceLimit: 'Hasta 45 m²',
      electricityLimit: 'Hasta 5000 Kw', rentLimit: 2091301.83, maxUnitPrice: 536767.47,
      servicesTax: 7946.95, goodsTax: 7946.95, sipaContribution: 15029.49,
      healthContribution: 19239.97, servicesAmount: 42216.41, goodsAmount: 42216.41,
    },
    {
      code: 'C', grossIncomeLimit: 18473166.15, surfaceLimit: 'Hasta 60 m²',
      electricityLimit: 'Hasta 6700 Kw', rentLimit: 2858112.50, maxUnitPrice: 536767.47,
      servicesTax: 13663.17, goodsTax: 12547.81, sipaContribution: 16532.44,
      healthContribution: 19239.97, servicesAmount: 49435.58, goodsAmount: 48320.22,
    },
    {
      code: 'D', grossIncomeLimit: 22934610.05, surfaceLimit: 'Hasta 85 m²',
      electricityLimit: 'Hasta 10000 Kw', rentLimit: 2858112.50, maxUnitPrice: 536767.47,
      servicesTax: 22307.22, goodsTax: 20773.60, sipaContribution: 18185.68,
      healthContribution: 22864.90, servicesAmount: 63357.80, goodsAmount: 61824.18,
    },
    {
      code: 'E', grossIncomeLimit: 26977793.60, surfaceLimit: 'Hasta 110 m²',
      electricityLimit: 'Hasta 13000 Kw', rentLimit: 3624923.17, maxUnitPrice: 536767.47,
      servicesTax: 41826.04, goodsTax: 33181.99, sipaContribution: 20004.25,
      healthContribution: 27884.02, servicesAmount: 89714.31, goodsAmount: 81070.26,
    },
    {
      code: 'F', grossIncomeLimit: 33809379.57, surfaceLimit: 'Hasta 150 m²',
      electricityLimit: 'Hasta 16500 Kw', rentLimit: 3624923.17, maxUnitPrice: 536767.47,
      servicesTax: 58835.29, goodsTax: 43220.24, sipaContribution: 22004.67,
      healthContribution: 32066.63, servicesAmount: 112906.59, goodsAmount: 97291.54,
    },
    {
      code: 'G', grossIncomeLimit: 40431835.35, surfaceLimit: 'Hasta 200 m²',
      electricityLimit: 'Hasta 20000 Kw', rentLimit: 4322023.77, maxUnitPrice: 536767.47,
      servicesTax: 107074.65, goodsTax: 53537.32, sipaContribution: 30806.54,
      healthContribution: 34576.19, servicesAmount: 172457.38, goodsAmount: 118920.05,
    },
    {
      code: 'H', grossIncomeLimit: 61344853.64, surfaceLimit: 'Hasta 200 m²',
      electricityLimit: 'Hasta 20000 Kw', rentLimit: 6273905.49, maxUnitPrice: 536767.47,
      servicesTax: 306724.27, goodsTax: 153362.13, sipaContribution: 43129.16,
      healthContribution: 41547.19, servicesAmount: 391400.62, goodsAmount: 238038.48,
    },
    {
      code: 'I', grossIncomeLimit: 68664410.05, surfaceLimit: 'Hasta 200 m²',
      electricityLimit: 'Hasta 20000 Kw', rentLimit: 6273905.49, maxUnitPrice: 536767.47,
      servicesTax: 609963.03, goodsTax: 243985.21, sipaContribution: 60380.82,
      healthContribution: 51306.61, servicesAmount: 721650.46, goodsAmount: 355672.64,
    },
    {
      code: 'J', grossIncomeLimit: 78632948.76, surfaceLimit: 'Hasta 200 m²',
      electricityLimit: 'Hasta 20000 Kw', rentLimit: 6273905.49, maxUnitPrice: 536767.47,
      servicesTax: 731955.63, goodsTax: 292782.26, sipaContribution: 84533.15,
      healthContribution: 57580.51, servicesAmount: 874069.29, goodsAmount: 434895.92,
    },
    {
      code: 'K', grossIncomeLimit: 94805682.90, surfaceLimit: 'Hasta 200 m²',
      electricityLimit: 'Hasta 20000 Kw', rentLimit: 6273905.49, maxUnitPrice: 536767.47,
      servicesTax: 1024737.89, goodsTax: 341579.30, sipaContribution: 118346.41,
      healthContribution: 65806.30, servicesAmount: 1208890.60, goodsAmount: 525732.01,
    },
  ];

  await strapi.db.query('api::tax-category.tax-category').createMany({ data: categories });
  strapi.log.info('Seed tax-categories: 11 registros insertados correctamente.');
};

