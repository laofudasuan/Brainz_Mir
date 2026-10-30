import React, { useState, useRef, useEffect } from 'react';
import TwoDArrayVisualization from '../../components/visualizations/TwoDArrayVisualization.jsx';
import DemoStage from '../../components/DemoStage.jsx';

const TwoDArrayVisualizationPage = () => {
  const matrixVizRef = useRef(null);
  const [currentAction, setCurrentAction] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [initialMatrix, setInitialMatrix] = useState(null);

  // 初始化一个默认的矩阵数据
  useEffect(() => {
    const defaultMatrix = [
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 0],
      [0, 1, 0, 1, 1],
      [1, 0, 1, 0, 1],
      [0, 0, 1, 1, 0]
    ];
    setInitialMatrix(defaultMatrix);
  }, []);

  // 演示二维数组操作
  const demonstrateMatrixOperations = async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentAction('初始化矩阵');

    // 等待一段时间
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 创建一个示例矩阵数据
    const sampleMatrix = Array(rows).fill(null).map(() => Array(cols).fill(0));

    // 加载初始矩阵
    setCurrentAction('加载初始矩阵数据');
    matrixVizRef.current?.loadMatrix(sampleMatrix);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 设置特定元素
    setCurrentAction('设置元素: (1, 1) = 1');
    matrixVizRef.current?.setElement(1, 1, 1);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setCurrentAction('设置元素: (2, 3) = 1');
    matrixVizRef.current?.setElement(2, 3, 1);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setCurrentAction('设置元素: (4, 0) = 1');
    matrixVizRef.current?.setElement(4, 0, 1);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 高亮特定单元格
    setCurrentAction('高亮单元格: (1, 1)');
    matrixVizRef.current?.highlightCell(1, 1, '#FFD700');
    await new Promise(resolve => setTimeout(resolve, 1000));

    setCurrentAction('高亮单元格: (2, 3)');
    matrixVizRef.current?.highlightCell(2, 3, '#FFD700');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 构建一个新的矩阵（例如邻接矩阵样式）
    setCurrentAction('构建新的邻接矩阵');
    matrixVizRef.current?.clearAllHighlights();
    const adjacencyMatrix = [
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 0],
      [0, 1, 0, 1, 1],
      [1, 0, 1, 0, 1],
      [0, 0, 1, 1, 0]
    ];
    matrixVizRef.current?.loadMatrix(adjacencyMatrix);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 逐步高亮对角线
    setCurrentAction('高亮对角线元素');
    for (let i = 0; i < Math.min(rows, cols); i++) {
      matrixVizRef.current?.highlightCell(i, i, '#4CAF50');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await new Promise(resolve => setTimeout(resolve, 1000));

    setCurrentAction('演示完成');
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsAnimating(false);
  };

  // 重置演示
  const resetDemo = () => {
    if (matrixVizRef.current) {
      matrixVizRef.current.clearMatrix();
      matrixVizRef.current.clearAllHighlights();
    }
    setCurrentAction('');
    setIsAnimating(false);
  };

  // 重新渲染矩阵（当行列数改变时）
  const handleSizeChange = () => {
    resetDemo();
    // 重新渲染会自动使用新的rows和cols值
  };

  return (
    <div className="viz-demo">
      <header className="viz-demo-head">
        <p className="eyebrow">交互可视化</p>
        <h1>二维数组可视化演示</h1>
      </header>

      <section className="panel" aria-labelledby="matrix-ops">
        <h2 className="panel-title" id="matrix-ops">操作演示</h2>
        <div className="control-row">
          <button type="button" onClick={demonstrateMatrixOperations} disabled={isAnimating} className="btn btn-primary">
            {isAnimating ? '演示中...' : '开始演示'}
          </button>
          <button type="button" onClick={resetDemo} className="btn btn-danger">
            重置
          </button>
        </div>

        <p className="current-action" role="status">
          当前操作: <span>{currentAction || '等待开始'}</span>
        </p>

        <div className="control-row">
          <label className="field-inline">
            行数:
            <input
              type="number"
              value={rows}
              onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="10"
              className="field field--num"
              disabled={isAnimating}
            />
          </label>
          <label className="field-inline">
            列数:
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="10"
              className="field field--num"
              disabled={isAnimating}
            />
          </label>
          <button type="button" onClick={handleSizeChange} disabled={isAnimating} className="btn btn-quiet btn-small">
            应用大小
          </button>
        </div>
      </section>

      <section className="panel" aria-labelledby="matrix-stage">
        <h2 className="panel-title" id="matrix-stage">矩阵可视化</h2>
        <DemoStage label="矩阵图示">
          <TwoDArrayVisualization
            ref={matrixVizRef}
            width={400}
            height={400}
            rows={rows}
            cols={cols}
            initialData={initialMatrix}
          />
        </DemoStage>
        <p className="explain-title">说明：</p>
        <ul className="explain">
          <li>浅蓝色格子是已经写入的元素，格子里的数字就是它的值</li>
          <li>黄色高亮表示当前操作的单元格</li>
          <li>绿色高亮用于特殊标记（如对角线）</li>
        </ul>
      </section>
    </div>
  );
};

// 添加静态属性供列表页面读取
TwoDArrayVisualizationPage.title = '二维数组可视化';
TwoDArrayVisualizationPage.description = '动态展示二维数组操作';

export default TwoDArrayVisualizationPage;
