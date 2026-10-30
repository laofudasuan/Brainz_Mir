import React, { useRef, useState } from 'react';
import QueueVisualization from '../../components/visualizations/QueueVisualization.jsx';
import DemoStage from '../../components/DemoStage.jsx';

const QueueVisualizationPage = () => {
  const queueVizRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  // 操作无法完成时的提示写在页面里，代替打断操作的 alert 弹窗
  const [notice, setNotice] = useState('');
  const [queueStatus, setQueueStatus] = useState({
    size: 0,
    front: null,
    isEmpty: true
  });

  // 更新队列状态显示
  const updateQueueStatus = () => {
    if (queueVizRef.current) {
      setQueueStatus({
        size: queueVizRef.current.size(),
        front: queueVizRef.current.peek(),
        isEmpty: queueVizRef.current.isEmpty()
      });
    }
  };

  // 处理入队操作
  const handleEnqueue = () => {
    if (inputValue.trim() !== '' && queueVizRef.current) {
      const success = queueVizRef.current.enqueue(inputValue.trim());
      if (success) {
        setInputValue('');
        setNotice('');
        updateQueueStatus();
      } else {
        setNotice('队列已满，无法添加更多元素！');
      }
    }
  };

  // 处理出队操作
  const handleDequeue = () => {
    if (queueVizRef.current && !queueVizRef.current.isEmpty()) {
      queueVizRef.current.dequeue();
      setNotice('');
      updateQueueStatus();
    } else {
      setNotice('队列为空，无法出队！');
    }
  };

  // 处理清空队列
  const handleClear = () => {
    if (queueVizRef.current) {
      queueVizRef.current.clear();
      setNotice('');
      updateQueueStatus();
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEnqueue();
    }
  };

  // 预设队列示例
  const handlePresetExample = (type) => {
    if (queueVizRef.current) {
      let exampleQueue = [];

      switch(type) {
        case 'numbers':
          exampleQueue = [1, 2, 3, 4, 5];
          break;
        case 'letters':
          exampleQueue = ['A', 'B', 'C', 'D', 'E'];
          break;
        case 'mixed':
          exampleQueue = [10, 'X', 20, 'Y', 30];
          break;
        default:
          exampleQueue = [];
      }

      queueVizRef.current.setQueue(exampleQueue);
      setNotice('');
      updateQueueStatus();
    }
  };

  return (
    <div className="viz-demo">
      <header className="viz-demo-head">
        <p className="eyebrow">交互可视化</p>
        <h1>队列(Queue)可视化</h1>
      </header>

      {/* 队列状态和操作区域 */}
      <section className="panel" aria-labelledby="queue-ops">
        <h2 className="panel-title" id="queue-ops">队列操作</h2>

        <div className="control-row">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入元素值"
            aria-label="元素值"
            className="field field--grow"
          />
          <button type="button" onClick={handleEnqueue} className="btn btn-primary" disabled={inputValue.trim() === ''}>
            入队 (Enqueue)
          </button>
          <button type="button" onClick={handleDequeue} className="btn btn-quiet" disabled={queueStatus.isEmpty}>
            出队 (Dequeue)
          </button>
          <button type="button" onClick={handleClear} className="btn btn-danger">
            清空 (Clear)
          </button>
        </div>

        {notice && <p className="notice notice--warn" role="alert">{notice}</p>}

        {/* 预设示例 */}
        <div className="control-row">
          <span className="control-label">预设示例：</span>
          <button type="button" onClick={() => handlePresetExample('numbers')} className="btn btn-quiet btn-small">
            数字序列
          </button>
          <button type="button" onClick={() => handlePresetExample('letters')} className="btn btn-quiet btn-small">
            字母序列
          </button>
          <button type="button" onClick={() => handlePresetExample('mixed')} className="btn btn-quiet btn-small">
            混合序列
          </button>
        </div>

        {/* 队列状态信息 */}
        <div className="status-grid" role="status">
          <span>队列大小: <b>{queueStatus.size}</b></span>
          <span>队首元素: <b>{queueStatus.front !== null ? queueStatus.front : '队列为空'}</b></span>
          <span>队列状态: <b>{queueStatus.isEmpty ? '空' : '非空'}</b></span>
        </div>
      </section>

      {/* 队列可视化组件 */}
      <section className="panel" aria-labelledby="queue-stage">
        <h2 className="panel-title" id="queue-stage">队列可视化</h2>
        <DemoStage label="队列图示">
          <QueueVisualization
            ref={queueVizRef}
            height={100}
            maxSize={10}
          />
        </DemoStage>
      </section>

      {/* 队列说明 */}
      <section className="panel" aria-labelledby="queue-notes">
        <h2 className="panel-title" id="queue-notes">队列说明</h2>
        <ul className="explain">
          <li>队列是一种先进先出(FIFO)的数据结构</li>
          <li>元素从队尾(rear)入队，从队首(front)出队</li>
          <li>橙色标记表示队首元素，红色标记表示队尾元素</li>
          <li>入队操作：将新元素添加到队尾</li>
          <li>出队操作：移除并返回队首元素</li>
          <li>队列满时无法继续入队，队列为空时无法出队</li>
        </ul>
      </section>
    </div>
  );
};

// 添加静态属性供列表页面读取
QueueVisualizationPage.title = '队列可视化';
QueueVisualizationPage.description = '可视化展示队列的先进先出(FIFO)特性和基本操作';

export default QueueVisualizationPage;
