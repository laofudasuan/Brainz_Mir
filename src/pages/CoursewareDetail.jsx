import React, { useState, useEffect, lazy, Suspense, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import { headingComponents, tableComponents, listComponents, imageComponents, boxWithTagComponent, CodeBlock, Problem, CollapsibleComponent } from '../data/courseware/markdownConfig.jsx';
import ReactFlow, { Background, ReactFlowProvider, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/reactflow-overrides.css';
import CoursewareNode from '../components/flow/CoursewareNode.jsx';
import LabelNode from '../components/flow/LabelNode.jsx';
import Loading from '../components/Loading';
import useDocumentTitle from '../components/useDocumentTitle';

const nodeTypes = { courseware: CoursewareNode, label: LabelNode };
const EDGE_COLOR = '#8A7C66';
// 课件页文件名（如 Basic/Binary-Search.mdx）只取最后一段作为按钮文字
const pageLabel = (value) => String(value).split('/').pop().replace(/[-_]+/g, ' ');

const CoursewareDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseware, setCourseware] = useState(null);
  useDocumentTitle(courseware?.title || '算法课件');
 
  // Exit animation variants
  const [exitVariants, setExitVariants] = useState({ opacity: 0 });
  const [enterVariants, setEnterVariants] = useState(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('courseware-exit-rect');
      if (saved) {
        const rect = JSON.parse(saved);
        // Calculate the translation needed to move the center of the screen to the center of the rect
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = centerX - window.innerWidth / 2;
        const y = centerY - window.innerHeight / 2;
        
        setExitVariants({
          opacity: 0,
          scale: 0,
          x,
          y,
          transition: { duration: 1.0, ease: "easeInOut" }
        });
        setEnterVariants({ opacity: 0, scale: 0, x, y });
      }
    } catch (e) {
      console.error('Failed to parse exit rect', e);
    }
  }, []);

  const [pageComponents, setPageComponents] = useState([]);
  const [pageAttributes, setPageAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [toc, setToc] = useState([]); // 存储目录信息
  const [showToc, setShowToc] = useState(false); // 控制目录显示/隐藏
  const contentRef = useRef(null);
  const tocRef = useRef(null);
  const [mapMode, setMapMode] = useState(false);
  const [mapNodes, setMapNodes, onNodesChange] = useNodesState([]);
  const [mapEdges, setMapEdges, onEdgesChange] = useEdgesState([]);
  const [pages, setPages] = useState([]);
  const [combinedMode, setCombinedMode] = useState(false);
  const [combinedComponents, setCombinedComponents] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // 组件加载时隐藏Navbar
  useEffect(() => {
    // 添加类到body或html来隐藏Navbar
    document.body.classList.add('hide-navbar');
    
    // 组件卸载时移除类
    return () => {
      document.body.classList.remove('hide-navbar');
    };
  }, []);
  
  // 使用Vite的import.meta.glob预加载可能的文件
  const coursewareFiles = import.meta.glob('../data/courseware/*.mdx', { eager: false });
  const coursewareJsonFiles = import.meta.glob('../data/courseware/*.json', { eager: false });
  const pageFiles = import.meta.glob('../data/courseware/pages/**/*.mdx', { eager: false });

  // 提取页面中的标题信息，构建目录
  const extractHeadingsFromPage = (pageIndex) => {
    // 这里会在页面渲染后通过DOM操作提取标题
    setTimeout(() => {
      const pageContent = contentRef.current;
      if (!pageContent) return;

      const headings = pageContent.querySelectorAll('h1, h2, h3, h4');
      const tocItems = [];

      headings.forEach(heading => {
        // 获取标题级别
        const level = parseInt(heading.tagName.charAt(1));
        
        // 获取标题文本
        const text = heading.textContent.trim();
        
        // 为标题生成ID（如果没有的话）
        if (!heading.id) {
          heading.id = `heading-${pageIndex}-${tocItems.length}`;
        }
        
        tocItems.push({
          id: heading.id,
          text,
          level,
          pageIndex
        });
      });

      // 更新目录状态
      setToc(prevToc => {
        const newToc = [...prevToc];
        newToc[pageIndex] = tocItems;
        return newToc;
      });
    }, 1000); // 增加延迟确保页面渲染完成
  };

  // 滚动到指定标题
  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 从子页面返回主页
  const goBackToMainPage = () => {
    setCombinedMode(false);
    setShowOverlay(false);
  };

  const performExport = async (expandAll) => {
    if (!contentRef.current) return;
    setIsExporting(true);
    
    // 给UI一点时间渲染loading
    await new Promise(r => setTimeout(r, 100));
    
    try {
      const source = contentRef.current;
      const toggles = Array.from(source.querySelectorAll('[data-collapsible-toggle]'));
      
      toggles.forEach(t => { 
        const isOpen = !!t.nextElementSibling;
        if (expandAll) {
          if (!isOpen) t.click(); 
        } else {
          if (isOpen) t.click();
        }
      });
      
      const wait = (ms) => new Promise(r => setTimeout(r, ms));
      
      await wait(500); // 等待展开动画
      
      const clone = source.cloneNode(true);
      Array.from(clone.querySelectorAll('[data-code-block="true"]')).forEach(wrapper => {
        try {
          const grid = wrapper.querySelector('.grid');
          if (!grid) return;
          const children = Array.from(grid.children || []);
          const codeLines = [];
          for (let i = 1; i < children.length; i += 2) {
            const codeCell = children[i];
            const txt = (codeCell && codeCell.textContent) ? codeCell.textContent.replace(/\u200b/g, '') : '';
            codeLines.push(txt);
          }
          const pre = clone.ownerDocument.createElement('pre');
          pre.style.whiteSpace = 'pre-wrap';
          pre.style.wordBreak = 'break-word';
          const code = clone.ownerDocument.createElement('code');
          code.textContent = codeLines.join('\n');
          pre.appendChild(code);
          wrapper.replaceWith(pre);
        } catch {}
      });
      Array.from(clone.querySelectorAll('[data-vis]')).forEach(el => el.remove());
      const htmlContent = clone.innerHTML;
      
      let iframe = document.getElementById('print-iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'print-iframe';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
      }
      
      const fileTitle = (pageAttributes[currentPage]?.title || courseware?.title || id) + '.pdf';
      const style = `
        @page { size: A4; margin: 16mm; }
        * { animation: none !important; transition: none !important; }
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Noto Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #111827; }
        h1 { font-size: 24px; margin: 16px 0; }
        h2 { font-size: 20px; margin: 14px 0; }
        h3 { font-size: 18px; margin: 12px 0; }
        h4 { font-size: 16px; margin: 10px 0; }
        p, li { font-size: 14px; line-height: 1.6; }
        pre, code { white-space: pre-wrap; word-break: break-word; }
        img { max-width: 100%; height: auto; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; }
        .katex { font-size: 1em; }
        [data-vis] { display: none !important; }
      `;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${fileTitle}</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" crossorigin="anonymous"><script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" crossorigin="anonymous"></script><style>${style}</style></head><body>${htmlContent}</body></html>`);
      doc.close();
      
      await new Promise((resolve) => {
        const checkLoaded = () => {
          if (iframe.contentWindow.katex && iframe.contentWindow.renderMathInElement) {
            try {
              iframe.contentWindow.renderMathInElement(iframe.contentDocument.body, {
                delimiters: [
                  {left: "$$", right: "$$", display: true},
                  {left: "$", right: "$", display: false}
                ],
                throwOnError: false
              });
              
              // 等待字体加载完成
              if (iframe.contentDocument.fonts) {
                iframe.contentDocument.fonts.ready.then(() => {
                  setTimeout(() => resolve(), 500);
                });
              } else {
                setTimeout(() => resolve(), 1000);
              }
            } catch (e) {
              console.error(e);
              resolve();
            }
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        const timeout = setTimeout(() => {
          console.warn('Print iframe timeout');
          resolve();
        }, 15000);
        iframe.onload = () => {
          clearTimeout(timeout);
          checkLoaded();
        };
        setTimeout(checkLoaded, 500);
      });
      
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (err) {
      console.error('导出失败:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const renderCombinedPages = async () => {
    try {
      const comps = [];
      const attrs = [];
      for (const p of pages) {
        if (!p?.path) continue;
        let matchedPath = null;
        for (const path in pageFiles) {
          if (path.endsWith(`/${p.path}`)) {
            matchedPath = path;
            break;
          }
        }
        if (matchedPath && pageFiles[matchedPath]) {
          try {
            const mod = await pageFiles[matchedPath]();
            comps.push(mod.default);
            attrs.push(mod.frontmatter || mod.attributes || {});
          } catch {
            comps.push(() => <div className="text-center py-12 bg-red-50 rounded-lg">页面加载失败</div>);
            attrs.push({});
          }
        }
      }
      setCombinedComponents(comps);
      setPageAttributes(attrs);
      setCombinedMode(true);
      setShowOverlay(true);
      setPageComponents([]);
      setCurrentPage(0);
      setToc(new Array(comps.length));
    } catch {}
  };

  useEffect(() => {
    const loadCourseware = async () => {
      try {
        const jsonPath = `../data/courseware/${id}.json`;
        if (coursewareJsonFiles[jsonPath]) {
          const jsonModule = await coursewareJsonFiles[jsonPath]();
          const data = jsonModule.default || jsonModule;
          const meta = {
            title: data.title,
            description: data.description,
            author: data.author,
            createdAt: data.createdAt,
            cover: data.cover
          };
          setCourseware({ id, ...meta });
          const nodes = [];
          const edges = [];
          const pageList = Array.isArray(data.pages) ? data.pages : [];
          setPages(pageList);
          for (let i = 0; i < pageList.length; i++) {
            const pageDef = pageList[i];
            const label = pageDef.id || pageDef.title || `页面 ${i + 1}`;
            const nodeId = String(pageDef.id || `page-${i}`);
            nodes.push({
              id: nodeId,
              type: 'courseware',
              position: { x: pageDef.x || 0, y: pageDef.y || 0 },
              data: { label, path: pageDef.path || null, link: pageDef.link || null },
              draggable: false,
              className: 'courseware-node'
            });
          }
          // 处理锚点节点（仅用于连接边，不显示）
          if (Array.isArray(data.anchor)) {
            data.anchor.forEach((anchor, idx) => {
              const anchorId = anchor.id || `anchor-${idx}`;
              nodes.push({
                id: anchorId,
                type: 'label', // 使用label类型但不显示
                position: { x: anchor.x || 0, y: anchor.y || 0 },
                data: { label: '', kind: 'anchor' },
                draggable: false,
                hidden: false,
                style: { width: 1, height: 1, padding: 0, margin: 0, border: 'none', opacity: 0 }
              });
            });
          }
          if (Array.isArray(data.annotation)) {
            data.annotation.forEach((ann, idx) => {
              nodes.push({
                id: `annotation-${idx}`,
                type: 'label',
                position: { x: ann.x || 0, y: ann.y || 0 },
                data: { 
                  label: ann.text, 
                  kind: 'annotation',
                  fontSize: ann.fontSize,
                  color: ann.color
                },
                draggable: false,
                className: 'label-node'
              });
            });
          }
          if (data.metaPositions?.title) {
            nodes.push({
              id: 'meta-title',
              type: 'label',
              position: { x: data.metaPositions.title.x || 0, y: data.metaPositions.title.y || 0 },
              data: { label: meta.title || id, kind: 'title' },
              draggable: false,
              className: 'label-node'
            });
          }
          if (data.metaPositions?.description) {
            nodes.push({
              id: 'meta-description',
              type: 'label',
              position: { x: data.metaPositions.description.x || 0, y: data.metaPositions.description.y || 0 },
              data: { label: meta.description || '', kind: 'description' },
              draggable: false,
              className: 'label-node'
            });
          }
          (Array.isArray(data.edges) ? data.edges : []).forEach((e, idx) => {
            const s = String(e.source);
            const t = String(e.target);
            edges.push({
              id: `${s}-${t}-${idx}`,
              source: s,
              target: t,
              sourceHandle: e.sourceSide || null,
              targetHandle: e.targetSide || null,
              label: e.label || undefined,
              style: { stroke: EDGE_COLOR, strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_COLOR }
            });
          });
          setPageComponents([]);
          setPageAttributes([]);
          setToc([]);
          setMapNodes(nodes);
          setMapEdges(edges);
          setMapMode(true);
        } else if (coursewareFiles[`../data/courseware/${id}.mdx`]) {
          const coursewareModule = await coursewareFiles[`../data/courseware/${id}.mdx`]();
          const meta = coursewareModule.frontmatter || coursewareModule.attributes || {};
          setCourseware({ id, ...meta });
          if (Array.isArray(meta.pages)) {
            setPages(meta.pages.map((p, i) => ({ id: String(p).replace(/\.mdx$/,'') || `页面 ${i+1}`, path: p })));
            setPageComponents([]);
            setPageAttributes([]);
            setToc([]);
            setMapMode(false);
          } else {
            setPageComponents([coursewareModule.default]);
            setPageAttributes([meta]);
            setToc(new Array(1));
            setMapMode(false);
          }
        } else {
          setError(new Error('课件文件不存在'));
        }
      } catch (err) {
        console.error('加载课件失败:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseware();
  }, [id]);

  const onNodeClick = async (_e, node) => {
    if (node.id === 'meta-title' || node.id === 'meta-description') return;
    if (node?.data?.link) {
      const url = `/courseware/${node.data.link}`;
      try {
        window.open(url, '_blank', 'noopener');
      } catch {
        navigate(url);
      }
      return;
    }
    if (!node?.data?.path) return;
    try {
      const el = document.querySelector(`.react-flow__node[data-id="${node.id}"]`);
      if (el && el.getBoundingClientRect) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = centerX - window.innerWidth / 2;
        const y = centerY - window.innerHeight / 2;
        setExitVariants({ opacity: 0, scale: 0, x, y, transition: { duration: 1.0, ease: "easeInOut" } });
        setEnterVariants({ opacity: 0, scale: 0, x, y });
        try { sessionStorage.setItem('courseware-exit-rect', JSON.stringify(rect)); } catch {}
      }
    } catch {}
    let matchedPath = null;
    for (const path in pageFiles) {
      if (path.endsWith(`/${node.data.path}`)) {
        matchedPath = path;
        break;
      }
    }
    if (!matchedPath || !pageFiles[matchedPath]) return;
    try {
      const mod = await pageFiles[matchedPath]();
      setPageComponents([mod.default]);
      setPageAttributes([mod.frontmatter || mod.attributes || {}]);
      setToc(new Array(1));
      setCombinedMode(false);
      setShowOverlay(true);
      setCurrentPage(0);
    } catch {}
  };

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }), []);


  // 当页面改变时提取标题
  useEffect(() => {
    if (showOverlay && pageComponents[currentPage]) {
      extractHeadingsFromPage(currentPage);
    }
  }, [currentPage, showOverlay, pageComponents]);

  // 返回课件列表页面
  const goBackToCoursewareList = () => {
    navigate('/courseware');
  };

  if (loading) {
    return (
      <div className="page">
        <Loading label="正在打开课件…" block />
      </div>
    );
  }

  if (error || !courseware) {
    return (
      <div className="page lost">
        <h1 className="page-title">课件不存在或已被删除</h1>
        <p className="lead">链接可能有误，可以回到课件地图重新找找。</p>
        <div className="hero-actions">
          <button type="button" onClick={goBackToCoursewareList} className="btn btn-primary">
            <span className="arrow arrow--back" aria-hidden="true">←</span> 返回课件列表
          </button>
        </div>
      </div>
    );
  }

 

  // 始终渲染导航页，子页面以叠加层形式展示
  return (
    <div className="cw-detail">
      <div className="w-full h-full">
        <div className="float-bar">
          <button type="button" onClick={goBackToCoursewareList} className="float-btn" aria-label="返回课件地图">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="label">课件地图</span>
          </button>
          <button type="button" onClick={renderCombinedPages} className="float-btn" aria-label="合并渲染全部页面">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="2.5" />
              <path d="M8 9h8M8 13h8M8 17h5" />
            </svg>
            <span className="label">全部页面</span>
          </button>
        </div>
        {mapMode ? (
          <motion.div
            className="w-full h-full max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.76, ease: [0.22, 0.61, 0.36, 1] }}
            variants={containerVariants}
          >
            <div className="w-full h-full overflow-hidden relative">
              <ReactFlowProvider>
                <ReactFlow
                  nodes={mapNodes}
                  edges={mapEdges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                  minZoom={0.2}
                  maxZoom={4}
                  proOptions={{ hideAttribution: true }}
                >
                  <Background color="#D8CDBA" variant="dots" gap={18} size={1.2} />
                </ReactFlow>
              </ReactFlowProvider>
            </div>
          </motion.div>
        ) : (
          <div className="cw-intro">
            <motion.div
              className="cw-intro-inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="eyebrow">算法课件</p>
              <h1>{courseware.title || '未命名课件'}</h1>
              {courseware.description && courseware.description !== courseware.title && <p className="cw-intro-desc">{courseware.description}</p>}
              <div className="cw-intro-meta">
                <span>作者：{courseware.author || '未知'}</span>
                <span>创建时间：{courseware.createdAt || '未知'}</span>
              </div>
              {pages.length === 0 && <p className="empty-note">这份课件暂时还没有可以打开的页面。</p>}
              <div className="cw-pages">
                {pages.map((p, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={async () => {
                      if (!p?.path) return;
                      let matchedPath = null;
                      for (const path in pageFiles) {
                        if (path.endsWith(`/${p.path}`)) { matchedPath = path; break; }
                      }
                      if (!matchedPath || !pageFiles[matchedPath]) return;
                      try {
                        const mod = await pageFiles[matchedPath]();
                        setPageComponents([mod.default]);
                        setPageAttributes([mod.frontmatter || mod.attributes || {}]);
                        setToc(new Array(1));
                        setCombinedMode(false);
                        setShowOverlay(true);
                        setCurrentPage(0);
                      } catch {}
                    }}
                    className="cw-page-btn"
                  >
                    <b>{String(index + 1).padStart(2, '0')}</b>{p.id ? pageLabel(p.id) : `页面 ${index + 1}`}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showExportOptions && (
          <motion.div
            key="export-options"
            className="dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExportOptions(false)}
            onKeyDown={e => { if (e.key === 'Escape') setShowExportOptions(false); }}
          >
            <motion.div
              className="dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="export-title"
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 4, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 id="export-title">导出选项</h3>
              <p>是否展开所有折叠内容？</p>
              <div className="dialog-actions">
                <button
                  type="button"
                  autoFocus
                  onClick={() => {
                    setShowExportOptions(false);
                    performExport(true);
                  }}
                  className="btn btn-primary"
                >
                  是 (展开所有)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportOptions(false);
                    performExport(false);
                  }}
                  className="btn btn-quiet"
                >
                  否 (隐藏所有)
                </button>
                <button
                  type="button"
                  onClick={() => setShowExportOptions(false)}
                  className="btn"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {isExporting && (
          <motion.div
            key="exporting"
            className="dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="dialog">
              <Loading label="导出中..." />
            </div>
          </motion.div>
        )}
        {showOverlay && (
          <motion.div
            key="overlay"
            className="cw-overlay"
            initial={enterVariants || { opacity: 0 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0, transition: { duration: 1.0, ease: "easeInOut" } }}
            exit={exitVariants}
          >
            <div className="float-bar float-bar--left">
              <button
                type="button"
                onClick={() => setShowToc(v => !v)}
                className="float-btn toc-toggle"
                aria-label="切换目录"
                aria-expanded={showToc}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 6h16M4 12h10M4 18h16" />
                </svg>
                <span className="label">目录</span>
              </button>
            </div>
            <div className="float-bar">
              <button
                type="button"
                onClick={goBackToMainPage}
                className="float-btn"
                aria-label="返回地图"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span className="label">返回地图</span>
              </button>
              <button
                type="button"
                onClick={() => setShowExportOptions(true)}
                className="float-btn"
                aria-label="导出 PDF"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
                </svg>
                <span className="label">导出 PDF</span>
              </button>
            </div>

            {showToc && (
              <div ref={tocRef} className="cw-toc">
                <div className="cw-toc-head">目录</div>
                {toc[currentPage] && toc[currentPage].length > 0 ? (
                  <ul>
                    {toc[currentPage].map((item, index) => (
                      <li key={index} className={`toc-l${Math.min(item.level, 4)}`}>
                        <button type="button" onClick={() => scrollToHeading(item.id)}>
                          {item.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="cw-toc-empty">暂无目录信息</p>
                )}
              </div>
            )}

            <div className="cw-overlay-scroll">
              <div className="cw-sheet-wrap">
                <div
                  ref={contentRef}
                  className="relative overflow-hidden w-full h-full"
                >
                  {combinedMode ? (
                    <div className="w-full h-full">
                      {combinedComponents.map((Comp, idx) => (
                        <div key={idx} className="cw-sheet">
                          <Suspense fallback={<Loading label="正在渲染内容..." block />}>
                            {React.createElement(Comp, { 
                              components: { 
                                ...headingComponents, 
                                ...tableComponents, 
                                ...listComponents, 
                                ...imageComponents,
                                BoxWithTag: boxWithTagComponent,
                                pre: CodeBlock,
                                Problem,
                                CollapsibleComponent
                              } 
                            })}
                          </Suspense>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentPage}
                        className="w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.65, 0.05, 0.36, 1] }}
                      >
                        {pageComponents[currentPage] && (
                          <div className="cw-sheet">
                            <Suspense fallback={<Loading label="正在渲染内容..." block />}>
                              {React.createElement(pageComponents[currentPage], { 
                                components: { 
                                  ...headingComponents, 
                                  ...tableComponents, 
                                  ...listComponents, 
                                  ...imageComponents,
                                  BoxWithTag: boxWithTagComponent,
                                  pre: CodeBlock,
                                  Problem,
                                  CollapsibleComponent
                                } 
                              })}
                            </Suspense>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursewareDetail;
