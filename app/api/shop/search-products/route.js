// /app/api/search/route.ts
import { NextResponse } from 'next/server';
import { esClient } from '@/elastic/elasticClient';

export async function POST(req) {
  const { query, organizationId, categoryId, page, limit } = await req.json();

  const from = (page - 1) * limit;

  try {

    const filters = [
        { term: { organization_id: organizationId } },
        { term: { active: true } }
      ];
  
      if (categoryId) {
        filters.push({ term: { category_id: categoryId } });
      }

    const result = await esClient.search({
      index: 'products',
      from,
      size: limit,
      query: {
        bool: {
          must: {
            multi_match: {
              query,
              fields: ['name^3', 'description', 'sku', 'category.name'],
              fuzziness: 'AUTO',
            },
          },
          filter: filters
        }
      }
    });

    const hits = result.hits.hits.map(hit => hit._source);

    return NextResponse.json({
      data: hits,
      page,
      limit,
      total: result.hits.total.value,
      totalPages: Math.ceil(result.hits.total.value / limit),
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
