import { NextResponse } from 'next/server';

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type ApiDataResponse<Data> = {
  data: Data;
};

export type ApiPaginatedResponse<Data> = {
  data: Data[];
  meta: PaginationMeta;
};

export type ApiErrorResponse = {
  error: string;
  details?: unknown;
};

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  return {
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function ok<Data>(data: Data, status = 200) {
  return NextResponse.json<ApiDataResponse<Data>>({ data }, { status });
}

export function okPaginated<Data>(
  data: Data[],
  meta: PaginationMeta,
  status = 200,
) {
  return NextResponse.json<ApiPaginatedResponse<Data>>(
    { data, meta },
    { status },
  );
}

export function fail(error: string, status: number, details?: unknown) {
  return NextResponse.json<ApiErrorResponse>(
    details === undefined ? { error } : { error, details },
    { status },
  );
}
