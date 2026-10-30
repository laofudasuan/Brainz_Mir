// markdown标题渲染配置
// 此文件用于配置Markdown中不同级别的标题渲染格式
// 视觉样式（cw-*、tag-box、code-block 等类名）定义在 src/styles/workbench.css
import React from 'react';
import Problem from '../../components/Problem';

// H3标题计数器
let h3Counter = 0;

// H4标题计数器
let h4Counter = 0;

// 表格样式配置
export const tableConfig = {
  className: 'w-full border-collapse',
  th: {
    className: 'bg-gray-100 px-4 py-2 border border-gray-300 text-left font-semibold'
  },
  td: {
    className: 'px-4 py-2 border border-gray-300'
  }
};

// 列表样式配置
export const listConfig = {
  ul: {
    className: 'list-disc pl-6 my-4 space-y-2 marker:text-primary',
  },
  ol: {
    className: 'list-decimal pl-6 my-4 space-y-2 marker:text-tiger-ink',
  },
  li: {
    className: 'text-gray-800',
  }
};

// 列表组件配置
export const listComponents = {
  ul: (props) => {
    const { className, children } = props;
    const config = listConfig.ul;

    return (
      <ul className={`${config.className} ${className || ''}`}>
        {children}
      </ul>
    );
  },
  ol: (props) => {
    const { className, children } = props;
    const config = listConfig.ol;

    return (
      <ol className={`${config.className} ${className || ''}`}>
        {children}
      </ol>
    );
  },
  li: (props) => {
    const { className, children } = props;
    const config = listConfig.li;

    return (
      <li className={`${config.className} ${className || ''}`}>
        {children}
      </li>
    );
  }
};

export const imageComponents = {
  img: (props) => {
    const { title, alt, style, className, ...rest } = props;
    const parseSize = (raw) => {
      if (!raw) return null;
      const trimmed = String(raw).trim();
      const m =
        trimmed.match(/(?:^|\s)(?:w|width)\s*=\s*([0-9.]+)(px|%|rem|vw|vh)?(?:\s|$)/i) ||
        trimmed.match(/^(?:w|width)\s*:\s*([0-9.]+)(px|%|rem|vw|vh)?$/i) ||
        trimmed.match(/^([0-9.]+)(px|%|rem|vw|vh)$/i) ||
        trimmed.match(/^([0-9.]+)$/);
      if (!m) return null;
      const value = m[1];
      const unit = m[2] || (trimmed.includes('%') ? '%' : 'px');
      return `${value}${unit}`;
    };

    const width = parseSize(title);

    return (
      <img
        {...rest}
        className={`md-img ${className || ''}`}
        alt={alt || ''}
        loading="lazy"
        style={{
          display: 'block',
          margin: '16px auto',
          maxWidth: '100%',
          height: 'auto',
          width: width || undefined,
          ...style,
        }}
      />
    );
  },
};
export const headingConfig = {
  h1: {
    className: 'cw-h1',
    center: true
  },
  h2: {
    className: 'cw-h2',
    center: false
  },
  h3: {
    className: 'cw-h3',
    center: false
  },
  h4: {
    className: 'cw-h4',
    center: false
  },
  h5: {
    className: 'cw-h5',
    center: false
  },
  h6: {
    className: 'cw-h6',
    center: false
  }
};

// 配置React组件替换默认标题渲染
export const headingComponents = {
  h1: (props) => {
    const { className, children } = props;
    const config = headingConfig.h1;

    h3Counter = 0;
    h4Counter = 0;
    return (
      <div className={`${config.className} ${className || ''}`}>
        <h1 style={{ textAlign: config.center ? 'center' : 'left' }}>
          {children}
        </h1>
      </div>
    );
  },

  h2: (props) => {
    const { className, children } = props;
    const config = headingConfig.h2;

    h3Counter = 0;
    h4Counter = 0;
    return (
      <div className={`${config.className} ${className || ''}`}>
        <h2 style={{ textAlign: config.center ? 'center' : 'left' }}>
          {children}
        </h2>
        <div className="cw-h2-bar"></div>
      </div>
    );
  },

  h3: (props) => {
    const { className, children } = props;
    const config = headingConfig.h3;

    // 递增H3计数器，重置H4计数器
    h3Counter++;
    h4Counter = 0;

    // 获取带圈数字
    const getCircledNumber = (num) => {
      return `(${num})`;
    };

    return (
      <div className={`${config.className} ${className || ''}`}>
        <h3 style={{ textAlign: config.center ? 'center' : 'left' }}>
          <span className="cw-num">{getCircledNumber(h3Counter)}</span>
          {children}
        </h3>
      </div>
    );
  },

  h4: (props) => {
    const { className, children } = props;
    const config = headingConfig.h4;

    // 递增H4计数器
    h4Counter++;

    // 生成H4标题序号 (x.y 格式)
    const h4Number = `${h3Counter}-${h4Counter}`;

    return (
      <div className={`${config.className} ${className || ''}`}>
        <h4 style={{ textAlign: config.center ? 'center' : 'left' }}>
          <span className="cw-num">{h4Number}</span>
          {children}
        </h4>
      </div>
    );
  },

  h5: (props) => {
    const { className, children } = props;
    const config = headingConfig.h5;

    return (
      <div className={`${config.className} ${className || ''}`}>
        <h5 style={{ textAlign: config.center ? 'center' : 'left' }}>
          {children}
        </h5>
      </div>
    );
  },

  h6: (props) => {
    const { className, children } = props;
    const config = headingConfig.h6;

    return (
      <div className={config.className}>
        <h6 style={{ textAlign: config.center ? 'center' : 'left' }} className={className || undefined}>
          {children}
        </h6>
      </div>
    );
  }
};

// 带标签的框配置
export const boxWithTagConfig = {
  // 框的默认样式 - 宽度只包裹内容（与原先的 inline-block 一致），但作为独立的块排版
  box: {
    className: 'tag-box',
  },
  // 标签的默认样式 - 像书签一样压在边框上
  tag: {
    className: 'tag-box-label',
    defaultText: '提示'
  }
};

// 带标签的框组件配置
export const boxWithTagComponent = (props) => {
  const { className, children, tag } = props;
  const boxConfig = boxWithTagConfig.box;
  const tagConfig = boxWithTagConfig.tag;

  // 使用传入的标签文本或默认文本；只含空格的标签（如 tag=" "）表示不显示标签
  const tagText = tag || tagConfig.defaultText;

  return (
    <div className={`${boxConfig.className} ${className || ''}`}>
      {String(tagText).trim() && <span className={tagConfig.className}>{tagText}</span>}
      <div className="tag-box-body">{children}</div>
    </div>
  );
};

// 表格组件配置
export const tableComponents = {
  table: (props) => {
    const { className, children } = props;
    const config = tableConfig;

    return (
      <div className="md-table-wrap">
        <table className={`${config.className} ${className || ''}`}>
          {children}
        </table>
      </div>
    );
  },
  th: (props) => {
    const { className, children } = props;
    const config = tableConfig.th;

    return (
      <th className={`${config.className} ${className || ''}`}>
        {children}
      </th>
    );
  },
  td: (props) => {
    const { className, children } = props;
    const config = tableConfig.td;

    return (
      <td className={`${config.className} ${className || ''}`}>
        {children}
      </td>
    );
  }
};

// 折叠内容组件 - 默认隐藏内容，点击按钮后显示，不使用单独的配置对象
// 导出 PDF 时依赖 data-collapsible-toggle 及“展开内容紧跟在按钮后面”的结构
export const CollapsibleComponent = (props) => {
  // 使用React内部状态管理展开/折叠
  const [isOpen, setIsOpen] = React.useState(false);
  const { className, children, title = '点击展开' } = props;

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`cw-collapsible ${className || ''}`}>
      <button
        type="button"
        className="cw-toggle"
        onClick={toggleCollapse}
        aria-expanded={isOpen}
        data-collapsible-toggle="true"
      >
        <span>{title}</span>
        <span className="cw-toggle-icon" aria-hidden="true">▼</span>
      </button>
      {isOpen && (
        <div className="cw-collapse-body">
          {children}
        </div>
      )}
    </div>
  );
};

// 简易代码高亮与行号组件（覆盖 MDX 的 <pre> 渲染）
export const CodeBlock = (props) => {
  const child = props.children;
  const className = child?.props?.className || props.className || '';
  const meta = child?.props?.meta || props.meta || '';
  const metastring = child?.props?.metastring || props.metastring || '';
  const language = (className.match(/language-([\w+#-]+)/) || [])[1] || 'text';

  // 解析maxLines参数，默认为10
  const combinedMeta = `${className} ${meta} ${metastring}`;
  const maxLinesMatch = combinedMeta.match(/maxLines\s*(?:=|:)?\s*(\d+)/i);
  const maxLines = maxLinesMatch ? parseInt(maxLinesMatch[1], 10) : 10;

  const raw = (child?.props?.children || '').toString();
  const lines = raw.split('\n');
  const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const kw = [
    'auto','break','case','char','const','continue','default','do','double','else','enum','extern','float','for','goto','if','inline','int','long','register','restrict','return','short','signed','sizeof','static','struct','switch','typedef','union','unsigned','void','volatile','while','class','namespace','using','new','delete','public','private','protected','template','typename','this','virtual','operator','friend','bool'
  ];
  const kwRegex = new RegExp(`\\b(${kw.join('|')})\\b`, 'g');
  const numRegex = /(?<![\w])(?:0x[0-9a-fA-F]+|\d+(?:\.\d+)?)(?![\w])/g;
  const strRegex = /"(?:\\.|[^"])*"|'(?:\\.|[^'])*'/g;
  const oneLineCommentRegex = /\/\/.*$/;
  const blockStartRegex = /\/\*/;
  const blockEndRegex = /\*\//;
  let inBlockComment = false;

  const renderLine = (line) => {
    let html = escapeHtml(line);
    const placeholders = [];
    const addPlaceholder = (content) => {
      placeholders.push(content);
      return `___PH_${placeholders.length - 1}___`;
    };
    const restorePlaceholders = (text) => {
      return text.replace(/___PH_(\d+)___/g, (match, id) => placeholders[parseInt(id)]);
    };

    // handle block comments across lines
    if (inBlockComment) {
      const endIdx = html.search(blockEndRegex);
      if (endIdx >= 0) {
        const before = html.slice(0, endIdx + 2);
        const after = html.slice(endIdx + 2);
        html = addPlaceholder(`<span class="tok-comment">${before}</span>`) + after;
        inBlockComment = false;
      } else {
        return `<span class="tok-comment">${html}</span>`;
      }
    }

    // start of block comment
    if (!inBlockComment) {
      const startIdx = html.search(blockStartRegex);
      if (startIdx >= 0) {
        const endIdx = html.search(blockEndRegex);
        if (endIdx >= 0 && endIdx > startIdx) {
          const before = html.slice(0, startIdx);
          const middle = html.slice(startIdx, endIdx + 2);
          const after = html.slice(endIdx + 2);
          html = before + addPlaceholder(`<span class="tok-comment">${middle}</span>`) + after;
        } else {
          const before = html.slice(0, startIdx);
          const middle = html.slice(startIdx);
          html = before + addPlaceholder(`<span class="tok-comment">${middle}</span>`);
          inBlockComment = true;
          return restorePlaceholders(html);
        }
      }
    }

    // one-line comments
    const olc = html.match(oneLineCommentRegex);
    if (olc) {
      const idx = html.indexOf(olc[0]);
      const prefix = html.slice(0, idx);
      const comment = html.slice(idx);
      html = prefix + addPlaceholder(`<span class="tok-comment">${comment}</span>`);
    }

    // strings
    html = html.replace(strRegex, (m) => addPlaceholder(`<span class="tok-string">${m}</span>`));

    // numbers
    html = html.replace(numRegex, (m) => addPlaceholder(`<span class="tok-number">${m}</span>`));

    // keywords (only for C/C++)
    if (language.toLowerCase().includes('c')) {
      html = html.replace(kwRegex, (m) => addPlaceholder(`<span class="tok-keyword">${m}</span>`));
    }

    return restorePlaceholders(html);
  };

  return (
    <div className="code-block" data-code-block="true">
      <div className="code-block-lang">{language}</div>
      <div className="code-block-body">
        <div
          className="grid grid-cols-[48px_1fr]"
          style={lines.length > maxLines ? { maxHeight: `${maxLines * 1.5}rem`, overflowY: 'auto' } : {}}
        >
          {lines.map((line, idx) => (
            <React.Fragment key={idx}>
              <div className="code-ln">{idx + 1}</div>
              <div className="code-line">
                <span dangerouslySetInnerHTML={{ __html: renderLine(line) }} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

// 确保React被正确使用
if (typeof React === 'undefined') {
  console.error('React is not available. CollapsibleComponent requires React.');
}

export { Problem };

// 导出所有组件，方便在Markdown中使用
export default {
  // 标题相关
  headingConfig,
  headingComponents,
  // 列表相关
  listConfig,
  listComponents,
  // 表格相关
  tableConfig,
  tableComponents,
  // 带标签的框
  boxWithTagConfig,
  boxWithTagComponent,
  // 折叠内容组件
  CollapsibleComponent,
  // 代码块
  CodeBlock,
  // 题目组件
  Problem
};
