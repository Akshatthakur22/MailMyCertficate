import React from 'react';

export function EditorialColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="prose max-w-none text-gray-900">{children}</div>
    </div>
  );
}

export default EditorialColumn;
