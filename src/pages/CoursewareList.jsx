import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, { MiniMap, Controls, Background, ReactFlowProvider, useNodesState, useEdgesState, useViewport, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import CoursewareNode from '../components/flow/CoursewareNode.jsx';
import '../styles/reactflow-overrides.css';
import { CATEGORY_COLORS } from '../constants/categories.js';
import Loading from '../components/Loading';
import useDocumentTitle from '../components/useDocumentTitle';

const nodeTypes = { courseware: CoursewareNode };
const EDGE_COLOR = '#8A7C66';
const calm = { duration: 0.36, ease: [0.22, 0.61, 0.36, 1] };
// 数据里缺省的占位文字不再展示给读者
const shown = (value, placeholder) => (value && value !== placeholder ? value : '');

const OverlayCards = ({ cards, onNavigate, onClose }) => {
  const { x, y, zoom } = useViewport();
  return (
    <AnimatePresence>
      {cards.map((card) => {
        const description = shown(card.data.description, '暂无描述');
        return (
          <motion.div
            key={card.id}
            initial={{ scale: 0.96, opacity: 0, y: 6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={calm}
            className="cw-card-anchor"
            style={{ left: (card.nodeX || 0) * zoom + (x || 0) - 170, top: (card.nodeY || 0) * zoom + (y || 0) - 100 }}
          >
            <div className="cw-card" role="group" aria-label={card.data.title}>
              <h3>{card.data.title}</h3>
              {description && description !== card.data.title && <p>{description}</p>}
              <dl className="cw-card-meta">
                <div><dt>作者</dt><dd>{card.data.author}</dd></div>
                <div><dt>时间</dt><dd>{card.data.createdAt}</dd></div>
              </dl>
              <div className="cw-card-actions">
                <button type="button" onClick={() => onClose(card.id)} className="btn btn-quiet btn-small">收起</button>
                <button type="button" onClick={() => onNavigate(card.id)} className="btn btn-primary btn-small">打开课件 <span className="arrow" aria-hidden="true">→</span></button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};

const CoursewareList = () => {
  useDocumentTitle('算法课件');
  const [coursewares, setCoursewares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapConfig, setMapConfig] = useState(null);
  const [openCards, setOpenCards] = useState([]);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'list' ? 'list' : 'map';

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const loadCoursewares = async () => {
      try {
        const jsonFiles = import.meta.glob('/src/data/courseware/*.json', { eager: true });
        const mdxFiles = import.meta.glob('/src/data/courseware/*.mdx', { eager: true });
        const mapById = {};
        Object.entries(jsonFiles).forEach(([filepath, module]) => {
          const id = filepath.split('/').pop().replace('.json', '');
          // 地图配置本身也在这个目录里，它不是一份课件
          if (id === 'courseware-map') return;
          const data = module.default || module;
          const title = data?.title || '未知标题';
          const description = data?.description || '暂无描述';
          const author = data?.author || '未知作者';
          const createdAt = data?.createdAt || '未知时间';
          const cover = data?.cover;
          mapById[id] = { id, title, description, author, createdAt, cover };
        });
        Object.entries(mdxFiles).forEach(([filepath, module]) => {
          const id = filepath.split('/').pop().replace('.mdx', '');
          if (mapById[id]) return;
          const title = module.attributes?.title || module.frontmatter?.title || '未知标题';
          const description = module.attributes?.description || module.frontmatter?.description || '暂无描述';
          const author = module.attributes?.author || module.frontmatter?.author || '未知作者';
          const createdAt = module.attributes?.createdAt || module.frontmatter?.createdAt || '未知时间';
          const cover = module.attributes?.cover || module.frontmatter?.cover;
          mapById[id] = { id, title, description, author, createdAt, cover };
        });
        setCoursewares(Object.values(mapById));
        const mapModule = await import('../data/courseware/courseware-map.json');
        setMapConfig(mapModule.default || mapModule);
      } catch (error) {
        console.error('加载内容数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCoursewares();
  }, []);

  useEffect(() => {
    if (!mapConfig) return;
    const nextNodes = (mapConfig.nodes || []).map((n) => {
      const label = (coursewares.find((c) => c.id === n.id)?.title) || n.id;
      return {
        id: n.id,
        type: 'courseware',
        position: { x: n.x, y: n.y },
        data: { label, category: n.category },
        draggable: false,
        className: 'courseware-node',
      };
    });
    const nextEdges = (mapConfig.edges || []).map((e, idx) => ({
      id: `${e.source}-${e.target}-${idx}`,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceSide || null,
      targetHandle: e.targetSide || null,
      label: e.label || undefined,
      style: { stroke: EDGE_COLOR, strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: EDGE_COLOR },
    }));
    setNodes(nextNodes);
    setEdges(nextEdges);
  }, [mapConfig, coursewares, setNodes, setEdges]);

  // 图例只列出地图上真正出现的分类；列表视图与地图收录同一批课件：
  // 地图上暂时没有内容的节点不列出，不在地图上的课件也保持原样，只能通过原链接访问。
  const groups = useMemo(() => {
    const byId = Object.fromEntries(coursewares.map((c) => [c.id, c]));
    const result = [];
    (mapConfig?.nodes || []).forEach((n) => {
      const item = byId[n.id];
      if (!item) return;
      const name = n.category || '其他';
      let group = result.find((g) => g.name === name);
      if (!group) {
        group = { name, color: CATEGORY_COLORS[name] || 'var(--ink-4)', items: [] };
        result.push(group);
      }
      group.items.push(item);
    });
    return result;
  }, [coursewares, mapConfig]);

  const onNodeClick = (_e, node) => {
    const data = coursewares.find((c) => c.id === node.id);
    if (!data) return;
    setOpenCards((prev) => {
      const exists = prev.find((c) => c.id === data.id);
      if (exists) {
        return prev.map((c) => (c.id === data.id ? { ...c, nodeX: node.position.x, nodeY: node.position.y } : c));
      }
      return [...prev, { id: data.id, data, nodeX: node.position.x, nodeY: node.position.y }];
    });
  };

  const switchView = (next) => {
    const nextParams = new URLSearchParams(params);
    if (next === 'list') nextParams.set('view', 'list');
    else nextParams.delete('view');
    setParams(nextParams, { replace: true });
  };

  const total = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="cw-shell">
      <div className="cw-bar">
        <div className="cw-bar-title">
          <h1>算法课件</h1>
          {!loading && <p className="cw-bar-hint">{total} 份课件 · {view === 'map' ? '拖动平移、滚轮或双指缩放，点一下课件看看简介' : '按分类排列，点开即可阅读'}</p>}
        </div>
        {!loading && groups.length > 0 && (
          <div className="cw-legend" aria-label="分类图例">
            {groups.map((g) => <span key={g.name} style={{ '--dot': g.color }}><i aria-hidden="true" />{g.name}<b>{g.items.length}</b></span>)}
          </div>
        )}
        <div className="segmented" role="group" aria-label="浏览方式">
          <button type="button" aria-pressed={view === 'map'} onClick={() => switchView('map')}>地图</button>
          <button type="button" aria-pressed={view === 'list'} onClick={() => switchView('list')}>列表</button>
        </div>
      </div>

      <div className="cw-stage">
        {loading ? (
          <Loading label="正在铺开课件地图…" block />
        ) : total === 0 ? (
          <div className="cw-empty"><p className="empty-note">暂无可用内容</p></div>
        ) : view === 'list' ? (
          <div className="cw-list">
            <div className="cw-list-inner">
              {groups.map((g) => (
                <section key={g.name} aria-labelledby={`cw-group-${g.name}`} style={{ '--dot': g.color }}>
                  <h2 className="cw-group-title" id={`cw-group-${g.name}`}><i aria-hidden="true" />{g.name}<b>{g.items.length}</b></h2>
                  <ul className="cw-items">
                    {g.items.map((c) => {
                      const description = shown(c.description, '暂无描述');
                      return (
                        <li key={c.id}>
                          <Link className="cw-item" to={`/courseware/${c.id}`}>
                            <span className="cw-item-title">{c.title}</span>
                            {description && description !== c.title && <span className="cw-item-desc">{description}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        ) : (
          <div className="cw-stage-inner">
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.2}
                maxZoom={4}
                proOptions={{ hideAttribution: true }}
              >
                <MiniMap
                  pannable
                  zoomable
                  ariaLabel="课件地图缩略图"
                  nodeColor={(n) => CATEGORY_COLORS[n.data?.category] || '#CDBFA9'}
                  nodeStrokeColor="#FFFDF8"
                  nodeBorderRadius={6}
                  maskColor="rgba(238, 231, 218, 0.62)"
                  style={{ right: 12, bottom: 12, width: 180, height: 120 }}
                />
                <Controls position="bottom-right" showInteractive={false} showZoom={true} showFitView={true} style={{ right: 16, bottom: 140 }} />
                <Background color="#D8CDBA" variant="dots" gap={18} size={1.2} />
              </ReactFlow>
              <OverlayCards
                cards={openCards}
                onNavigate={(id) => navigate(`/courseware/${id}`)}
                onClose={(id) => setOpenCards((prev) => prev.filter((c) => c.id !== id))}
              />
            </ReactFlowProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursewareList;
