import { Product } from '../types';

export const exportToCSV = (products: Product[], filename = 'gumsearch_export.csv') => {
  const headers = [
    'Name',
    'Creator',
    'Category',
    'Price',
    'Sales',
    'Revenue',
    'Rating',
    'Reviews',
    'Product URL',
    'Tags',
    'AI Gap Analysis'
  ];

  const rows = products.map(p => [
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.creator.replace(/"/g, '""')}"`,
    `"${p.category}"`,
    p.price,
    p.sales,
    p.revenue,
    p.rating,
    p.reviewCount,
    `"${p.productUrl}"`,
    `"${p.tags.join(', ')}"`,
    `"${p.aiInsights.replace(/"/g, '""')}"`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToJSON = (products: Product[], filename = 'gumsearch_export.json') => {
  const jsonContent = JSON.stringify(products, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
