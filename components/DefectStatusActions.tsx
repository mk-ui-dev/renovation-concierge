'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  defectId: string;
  status: 'open' | 'fixed' | 'approved' | string;
  mode: 'admin' | 'client';
};

export default function DefectStatusActions({ defectId, status, mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (nextStatus: 'open' | 'fixed' | 'approved') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/defects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: defectId, status: nextStatus }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || 'Failed to update defect');
      }

      router.refresh();
    } catch (e: any) {
      setError(e?.message || 'Failed to update defect');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'approved') {
    return null;
  }

  const canMarkFixed = mode === 'admin' && status === 'open';
  const canApprove = (mode === 'admin' || mode === 'client') && status === 'fixed';

  return (
    <div className="mt-4 flex items-center gap-3">
      {canMarkFixed && (
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus('fixed')}
          className="px-3 py-1.5 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Mark fixed
        </button>
      )}

      {canApprove && (
        <button
          type="button"
          disabled={loading}
          onClick={() => updateStatus('approved')}
          className="px-3 py-1.5 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
        >
          Approve
        </button>
      )}

      {mode === 'client' && status === 'open' && (
        <span className="text-xs text-gray-500">Waiting for concierge to fix</span>
      )}

      {mode === 'client' && status === 'fixed' && (
        <span className="text-xs text-gray-500">Fixed — please approve</span>
      )}

      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
