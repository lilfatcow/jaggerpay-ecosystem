import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database } from 'lucide-react';

interface DatabaseNodeData {
  label: string;
  table: string;
}

export const DatabaseNode = memo(({ data }: { data: DatabaseNodeData }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-200">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center">
        <Database className="w-4 h-4 text-blue-500 mr-2" />
        <div>
          <div className="font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">{data.table}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

DatabaseNode.displayName = 'DatabaseNode';