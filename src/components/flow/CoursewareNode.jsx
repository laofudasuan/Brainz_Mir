import React from 'react';
import { Handle, Position } from 'reactflow';
import { CATEGORY_COLORS } from '../../constants/categories.js';

function CoursewareNode({ data }) {
  const color = CATEGORY_COLORS && data?.category ? CATEGORY_COLORS[data.category] : null;
  return (
    <>
      <Handle id="top" type="source" position={Position.Top} isConnectable={false} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle id="right" type="source" position={Position.Right} isConnectable={false} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle id="bottom" type="source" position={Position.Bottom} isConnectable={false} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle id="left" type="source" position={Position.Left} isConnectable={false} style={{ opacity: 0, pointerEvents: 'none' }} />

      <Handle id="top" type="target" position={Position.Top} isConnectable={false} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle id="right" type="target" position={Position.Right} isConnectable={false} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle id="bottom" type="target" position={Position.Bottom} isConnectable={false} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle id="left" type="target" position={Position.Left} isConnectable={false} style={{ opacity: 0, pointerEvents: 'none' }} />

      {/* 外观在 src/styles/reactflow-overrides.css：圆点是分类色，右上角的小图标说明点击后会打开页面或另一份课件 */}
      <div className="cw-node" style={color ? { '--dot': color } : undefined}>
        {color && <span className="cw-node-dot" aria-hidden="true" />}
        {data?.link && (
          <span className="cw-node-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <path d="M15 3h6v6" />
              <path d="M10 14L21 3" />
            </svg>
          </span>
        )}
        {data?.path && (
          <span className="cw-node-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.2-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5z" />
            </svg>
          </span>
        )}
        <div>{data?.label}</div>
      </div>
    </>
  );
}

export default CoursewareNode;
