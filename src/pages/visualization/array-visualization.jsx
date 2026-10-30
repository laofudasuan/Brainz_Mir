import React, { useState, useRef } from 'react';
import ArrayVisualization from '../../components/visualizations/ArrayVisualization.jsx';
import DemoStage from '../../components/DemoStage.jsx';

const ArrayVisualizationPage = () => {
  const arrayVizRef = useRef(null);
  const [currentAction, setCurrentAction] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // 演示数组操作
  const demonstrateArrayOperations = async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentAction('初始化数组');

    // 等待一段时间
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 添加元素
    setCurrentAction('添加元素: 在索引2处插入值42');
    arrayVizRef.current?.setElement(2, 42);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setCurrentAction('添加元素: 在索引5处插入值18');
    arrayVizRef.current?.setElement(5, 18);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setCurrentAction('添加元素: 在索引0处插入值73');
    arrayVizRef.current?.setElement(0, 73);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 修改元素
    setCurrentAction('修改元素: 将索引2的值改为99');
    arrayVizRef.current?.setElement(2, 99);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 删除元素
    setCurrentAction('删除元素: 移除索引5的值');
    arrayVizRef.current?.removeElement(5);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setCurrentAction('删除元素: 移除索引0的值');
    arrayVizRef.current?.removeElement(0);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setCurrentAction('演示完成');
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsAnimating(false);
  };

  // 重置演示
  const resetDemo = () => {
    // 清除所有元素
    for (let i = 0; i < 10; i++) {
      arrayVizRef.current?.removeElement(i);
    }
    setCurrentAction('');
    setIsAnimating(false);
  };

  return (
    <div className="viz-demo">
      <header className="viz-demo-head">
        <p className="eyebrow">交互可视化</p>
        <h1>数组可视化演示</h1>
      </header>

      <section className="panel" aria-labelledby="array-ops">
        <h2 className="panel-title" id="array-ops">操作演示</h2>
        <div className="control-row">
          <button type="button" onClick={demonstrateArrayOperations} disabled={isAnimating} className="btn btn-primary">
            {isAnimating ? '演示中...' : '开始演示'}
          </button>
          <button type="button" onClick={resetDemo} className="btn btn-danger">
            重置
          </button>
        </div>
        <p className="current-action" role="status">
          当前操作: <span>{currentAction || '等待开始'}</span>
        </p>
      </section>

      <section className="panel" aria-labelledby="array-stage">
        <h2 className="panel-title" id="array-stage">数组可视化</h2>
        <DemoStage label="数组图示">
          <ArrayVisualization
            ref={arrayVizRef}
            height={80}
            length={10}
          />
        </DemoStage>
      </section>
    </div>
  );
};

// 添加静态属性供列表页面读取
ArrayVisualizationPage.title = '数组可视化';
ArrayVisualizationPage.description = '动态展示数组';

export default ArrayVisualizationPage;
