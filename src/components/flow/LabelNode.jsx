import React from 'react';
import { Handle, Position } from 'reactflow';

function LabelNode({ data }) {
  const kind = data?.kind || 'title';
  const base = {
    position: 'relative',
    textAlign: 'center',
    overflow: 'visible',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    pointerEvents: 'none'
  };

  const handles = (
    <>
      <Handle id="top" type="target" position={Position.Top} isConnectable={false} style={{ opacity: 0 }} />
      <Handle id="right" type="target" position={Position.Right} isConnectable={false} style={{ opacity: 0 }} />
      <Handle id="bottom" type="target" position={Position.Bottom} isConnectable={false} style={{ opacity: 0 }} />
      <Handle id="left" type="target" position={Position.Left} isConnectable={false} style={{ opacity: 0 }} />

      <Handle id="top" type="source" position={Position.Top} isConnectable={false} style={{ opacity: 0 }} />
      <Handle id="right" type="source" position={Position.Right} isConnectable={false} style={{ opacity: 0 }} />
      <Handle id="bottom" type="source" position={Position.Bottom} isConnectable={false} style={{ opacity: 0 }} />
      <Handle id="left" type="source" position={Position.Left} isConnectable={false} style={{ opacity: 0 }} />
    </>
  );

  if (kind === 'title') {
    // 与小站标题一致：衬线、墨色，下方一小段虎斑色水平线
    const titleStyle = {
      fontFamily: 'var(--font-serif)',
      fontSize: 42,
      fontWeight: 600,
      letterSpacing: 2,
      lineHeight: 1.3,
      color: 'var(--ink)',
      paddingBottom: 12,
      backgroundImage: 'linear-gradient(var(--tiger), var(--tiger))',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '56px 3px',
      backgroundPosition: '50% 100%'
    };
    return (
      <div style={{ ...base, ...titleStyle }}>
        {handles}
        {data?.label}
      </div>
    );
  }

  if (kind === 'annotation') {
    const annotationStyle = {
      fontSize: data.fontSize || 14,
      color: data.color || 'var(--ink-2)',
      fontWeight: 500,
      textAlign: 'left'
    };
    return (
      <div style={{ ...base, ...annotationStyle }}>
        {handles}
        {data?.label}
      </div>
    );
  }

  const descStyle = { fontSize: 18, fontWeight: 400, lineHeight: 1.85, color: 'var(--ink-2)', maxWidth: 520, textAlign: 'left' };
  return (
    <div style={{ ...base, ...descStyle }}>
      {handles}
      {data?.label}
    </div>
  );
}

export default LabelNode;
