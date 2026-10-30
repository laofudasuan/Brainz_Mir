import React from 'react';
import { Link } from 'react-router-dom';
import KnowledgeGraph from '../components/animation/KnowledgeGraph';
import useDocumentTitle from '../components/useDocumentTitle';

const notes = [
  ['空间穿梭', '点击任意节点，相机将平滑过渡到该节点，突出显示其相关连接，让您聚焦于特定知识领域。'],
  ['力导向布局', '使用3D力导向算法自动布局，关联节点相互靠近，形成层次清晰的空间结构，便于理解知识关联。'],
  ['分类可视化', '不同类型的节点使用不同颜色标识，直观区分概念、算法、数据结构、应用场景等知识类型。'],
];

function KnowledgeGraphPage() {
  useDocumentTitle('知识图谱');
  return (
    <div className="page">
      <nav className="crumbs" aria-label="返回"><Link to="/algorithms"><span className="arrow arrow--back" aria-hidden="true">←</span> 算法小屋</Link></nav>
      <header className="page-intro">
        <p className="eyebrow">算法小屋 · 知识图谱</p>
        <h1>3D 知识图谱可视化</h1>
        <p>交互式探索算法与数据结构的关联关系，通过空间穿梭体验知识的层次结构。</p>
        <p className="status-line"><span className="status-pill">搭建中</span>内容还没做，先搭了个框架。</p>
      </header>

      <section className="kg-window" aria-labelledby="kg-title">
        <div className="kg-window-head">
          <h2 id="kg-title">算法知识网络</h2>
          <p>这个3D知识图谱展示了不同算法类别、具体算法、数据结构以及它们之间的关联关系。点击任意节点可以进行空间穿梭，聚焦查看相关知识。</p>
        </div>
        <div className="kg-canvas">
          <KnowledgeGraph />
        </div>
      </section>

      <div className="kg-notes">
        {notes.map(([title, text], index) => (
          <section key={title} className="kg-note rise" style={{ '--i': index }}>
            <h3><span>{String(index + 1).padStart(2, '0')}</span>{title}</h3>
            <p>{text}</p>
          </section>
        ))}
      </div>

      <p className="data-note">
        <strong>数据说明：</strong>当前知识图谱使用模拟数据展示。在实际应用中，数据将从Neo4j图数据库获取，支持更复杂的查询和动态数据更新。
      </p>
    </div>
  );
}

export default KnowledgeGraphPage;
