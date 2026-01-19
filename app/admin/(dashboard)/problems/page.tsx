// app/admin/problems/page.tsx
import { Suspense } from 'react';
import { ProblemsTable } from '@/components/admin/problems-table';
import { getAllProblemsForAdmin } from '@/lib/api';

interface PageProps {
  searchParams: Promise<{ 
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function AdminProblemsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const status = params.status || '';
  const search = params.search || '';

  const { problems, total } = await getAllProblemsForAdmin({
    page: currentPage,
    limit: 10,
    status,
    search,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">সমস্যা ম্যানেজমেন্ট</h1>
        <p className="text-gray-600 mt-1">সব সমস্যা দেখুন এবং পরিচালনা করুন</p>
      </div>

      {/* Table */}
      <Suspense fallback={<div>লোড হচ্ছে...</div>}>
        <ProblemsTable 
          problems={problems} 
          total={total}
          currentPage={currentPage}
          status={status}
          search={search}
        />
      </Suspense>
    </div>
  );
}