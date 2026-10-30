import React, { useRef, useState } from 'react';
import LinkedListVisualization from '../../components/visualizations/LinkedListVisualization.jsx';
import DemoStage from '../../components/DemoStage.jsx';

const LinkedListVisualizationPage = () => {
  const linkedListVizRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  // 操作无法完成时的提示写在页面里，代替打断操作的 alert 弹窗
  const [notice, setNotice] = useState('');
  const [listStatus, setListStatus] = useState({
    size: 0,
    head: null,
    isEmpty: true
  });

  // 更新链表状态显示
  const updateListStatus = () => {
    if (linkedListVizRef.current) {
      setListStatus({
        size: linkedListVizRef.current.size(),
        head: linkedListVizRef.current.peek(),
        isEmpty: linkedListVizRef.current.isEmpty()
      });
    }
  };

  // 处理头部添加
  const handleAddToHead = () => {
    if (inputValue.trim() !== '' && linkedListVizRef.current) {
      const success = linkedListVizRef.current.addToHead(inputValue.trim());
      if (success) {
        setInputValue('');
        setNotice('');
        updateListStatus();
      } else {
        setNotice('链表已满，无法添加更多元素！');
      }
    }
  };

  // 处理尾部添加
  const handleAddToTail = () => {
    if (inputValue.trim() !== '' && linkedListVizRef.current) {
      const success = linkedListVizRef.current.addToTail(inputValue.trim());
      if (success) {
        setInputValue('');
        setNotice('');
        updateListStatus();
      } else {
        setNotice('链表已满，无法添加更多元素！');
      }
    }
  };

  // 处理指定位置插入
  const handleInsertAt = () => {
    if (inputValue.trim() !== '' && inputIndex !== '' && linkedListVizRef.current) {
      const index = parseInt(inputIndex, 10);
      if (isNaN(index)) {
        setNotice('请输入有效的索引值！');
        return;
      }

      const success = linkedListVizRef.current.insertAt(index, inputValue.trim());
      if (success) {
        setInputValue('');
        setInputIndex('');
        setNotice('');
        updateListStatus();
      } else {
        setNotice('插入失败，请检查索引是否有效！');
      }
    }
  };

  // 处理头部删除
  const handleRemoveFromHead = () => {
    if (linkedListVizRef.current && !linkedListVizRef.current.isEmpty()) {
      linkedListVizRef.current.removeFromHead();
      setNotice('');
      updateListStatus();
    } else {
      setNotice('链表为空，无法删除！');
    }
  };

  // 处理尾部删除
  const handleRemoveFromTail = () => {
    if (linkedListVizRef.current && !linkedListVizRef.current.isEmpty()) {
      linkedListVizRef.current.removeFromTail();
      setNotice('');
      updateListStatus();
    } else {
      setNotice('链表为空，无法删除！');
    }
  };

  // 处理指定位置删除
  const handleRemoveAt = () => {
    if (inputIndex !== '' && linkedListVizRef.current) {
      const index = parseInt(inputIndex, 10);
      if (isNaN(index)) {
        setNotice('请输入有效的索引值！');
        return;
      }

      const result = linkedListVizRef.current.removeAt(index);
      if (result !== null) {
        setInputIndex('');
        setNotice('');
        updateListStatus();
      } else {
        setNotice('删除失败，请检查索引是否有效！');
      }
    }
  };

  // 处理搜索
  const handleSearch = () => {
    if (searchValue.trim() !== '' && linkedListVizRef.current) {
      const index = linkedListVizRef.current.search(searchValue.trim());
      setSearchResult(index);
    }
  };

  // 处理清空链表
  const handleClear = () => {
    if (linkedListVizRef.current) {
      linkedListVizRef.current.clear();
      setNotice('');
      updateListStatus();
      setSearchResult(null);
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  // 预设链表示例
  const handlePresetExample = (type) => {
    if (linkedListVizRef.current) {
      let exampleList = [];

      switch(type) {
        case 'numbers':
          exampleList = [1, 2, 3, 4, 5];
          break;
        case 'letters':
          exampleList = ['A', 'B', 'C', 'D', 'E'];
          break;
        case 'mixed':
          exampleList = [10, 'X', 20, 'Y', 30];
          break;
        default:
          exampleList = [];
      }

      linkedListVizRef.current.setList(exampleList);
      setNotice('');
      updateListStatus();
      setSearchResult(null);
    }
  };

  return (
    <div className="viz-demo">
      <header className="viz-demo-head">
        <p className="eyebrow">交互可视化</p>
        <h1>链表(Linked List)可视化</h1>
      </header>

      {/* 链表状态和操作区域 */}
      <section className="panel" aria-labelledby="list-ops">
        <h2 className="panel-title" id="list-ops">链表操作</h2>

        {/* 输入区域 */}
        <div className="control-grid">
          <label className="field-label">
            元素值：
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddToTail)}
              placeholder="输入节点值"
              className="field"
            />
          </label>
          <label className="field-label">
            索引（用于插入/删除）：
            <input
              type="text"
              value={inputIndex}
              onChange={(e) => setInputIndex(e.target.value)}
              placeholder="输入索引值"
              className="field"
            />
          </label>
        </div>

        {/* 添加操作按钮 */}
        <div className="control-row">
          <button type="button" onClick={handleAddToHead} className="btn btn-quiet" disabled={inputValue.trim() === ''}>
            添加到头 (Add to Head)
          </button>
          <button type="button" onClick={handleAddToTail} className="btn btn-primary" disabled={inputValue.trim() === ''}>
            添加到尾 (Add to Tail)
          </button>
          <button type="button" onClick={handleInsertAt} className="btn btn-quiet" disabled={inputValue.trim() === '' || inputIndex === ''}>
            插入到位置 (Insert At)
          </button>
        </div>

        {/* 删除操作按钮 */}
        <div className="control-row">
          <button type="button" onClick={handleRemoveFromHead} className="btn btn-quiet" disabled={listStatus.isEmpty}>
            删除头部 (Remove from Head)
          </button>
          <button type="button" onClick={handleRemoveFromTail} className="btn btn-quiet" disabled={listStatus.isEmpty}>
            删除尾部 (Remove from Tail)
          </button>
          <button type="button" onClick={handleRemoveAt} className="btn btn-quiet" disabled={listStatus.isEmpty || inputIndex === ''}>
            删除指定位置 (Remove At)
          </button>
          <button type="button" onClick={handleClear} className="btn btn-danger">
            清空 (Clear)
          </button>
        </div>

        {notice && <p className="notice notice--warn" role="alert">{notice}</p>}

        {/* 搜索功能 */}
        <div className="control-row">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleSearch)}
            placeholder="搜索元素"
            aria-label="搜索元素"
            className="field field--grow"
          />
          <button type="button" onClick={handleSearch} className="btn btn-quiet" disabled={searchValue.trim() === ''}>
            搜索 (Search)
          </button>
        </div>

        {/* 搜索结果显示 */}
        {searchResult !== null && (
          <p className={searchResult >= 0 ? 'notice' : 'notice notice--warn'} role="status">
            {searchResult >= 0 ?
              `找到元素 "${searchValue}"，位于索引 ${searchResult}` :
              `未找到元素 "${searchValue}"`
            }
          </p>
        )}

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

        {/* 链表状态信息 */}
        <div className="status-grid" role="status">
          <span>链表长度: <b>{listStatus.size}</b></span>
          <span>头节点值: <b>{listStatus.head !== null ? listStatus.head : '链表为空'}</b></span>
          <span>链表状态: <b>{listStatus.isEmpty ? '空' : '非空'}</b></span>
        </div>
      </section>

      {/* 链表可视化组件 */}
      <section className="panel" aria-labelledby="list-stage">
        <h2 className="panel-title" id="list-stage">链表可视化</h2>
        <DemoStage label="链表图示">
          <LinkedListVisualization
            ref={linkedListVizRef}
            radius={100}
            maxSize={5}
          />
        </DemoStage>
      </section>

      {/* 链表说明 */}
      <section className="panel" aria-labelledby="list-notes">
        <h2 className="panel-title" id="list-notes">链表说明</h2>
        <ul className="explain">
          <li>链表是一种线性数据结构，每个元素（节点）包含数据和指向下一个节点的引用</li>
          <li>绿色标记表示头节点(Head)，琥珀色标记表示尾节点(Tail)</li>
          <li>添加操作：可以在头部、尾部或指定位置添加新节点</li>
          <li>删除操作：可以删除头部、尾部或指定位置的节点</li>
          <li>搜索操作：查找指定值的节点位置</li>
          <li>链表满时无法继续添加节点，链表为空时无法删除节点</li>
        </ul>
      </section>
    </div>
  );
};

// 添加静态属性供列表页面读取
LinkedListVisualizationPage.title = '链表可视化';
LinkedListVisualizationPage.description = '可视化展示链表的基本操作和特性';

export default LinkedListVisualizationPage;
