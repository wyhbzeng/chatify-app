// src/components/weighing/WeighingTopNav.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WeighingTopNav = () => {
  const navigate = useNavigate();
  
  // 数字时钟状态
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // 按钮基础样式（保留所有发光/hover效果）
  const baseBtnStyle = {
    padding: '0.25rem 0.75rem',
    fontSize: '0.875rem',
    color: 'white',
    backgroundImage: 'linear-gradient(to right, #051a3a, #0a2a5a)',
    border: '1px solid #06b6d4',
    borderRadius: '6px',
    boxShadow: '0 0 8px rgba(6, 182, 212, 0.6), 0 0 12px rgba(6, 182, 212, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 10,
    animation: 'glow-pulse 2s infinite',
  };

  // hover 状态逻辑不变
  const [hoveredBtn, setHoveredBtn] = React.useState('');
  const handleMouseEnter = (btnName) => setHoveredBtn(btnName);
  const handleMouseLeave = () => setHoveredBtn('');

  const getBtnStyle = (btnName) => {
    if (hoveredBtn === btnName) {
      return {
        ...baseBtnStyle,
        backgroundImage: 'linear-gradient(to right, #06b6d4, #22d3ee)',
        color: '#0a1a30',
        borderColor: '#22d3ee',
        boxShadow: '0 0 15px rgba(6, 182, 212, 0.9), 0 0 25px rgba(6, 182, 212, 0.6)',
        transform: 'translateY(-2px)',
      };
    }
    return baseBtnStyle;
  };

  // 动态添加动画和渐变边框样式
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes glow-pulse {
        0%, 100% {
          box-shadow: 0 0 8px rgba(6, 182, 212, 0.6), 0 0 12px rgba(6, 182, 212, 0.3);
        }
        50% {
          box-shadow: 0 0 12px rgba(6, 182, 212, 0.8), 0 0 20px rgba(6, 182, 212, 0.5);
        }
      }

      @keyframes border-rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes blink-color {
        0%, 100% {
          background: linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%);
          box-shadow: 0 0 8px rgba(6, 182, 212, 0.8);
        }
        50% {
          background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
        }
      }

      .title-container {
        position: relative;
        padding: 0.5rem 2rem;
        background: rgba(5, 26, 58, 0.8);
        border-radius: 8px;
        overflow: hidden;
      }

      .title-container::before {
        content: '';
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        background: conic-gradient(
          from 0deg,
          transparent 0%,
          #06b6d4 5%,
          #67e8f9 15%,
          #06b6d4 25%,
          transparent 100%
        );
        border-radius: 11px;
        animation: border-rotate 4s linear infinite;
        z-index: -1;
        box-shadow: 0 0 15px rgba(6, 182, 212, 0.8);
      }

      .title-container::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        right: 2px;
        bottom: 2px;
        background: rgba(5, 26, 58, 0.9);
        border-radius: 6px;
        z-index: -1;
      }

      .blink-left {
        animation: blink-color 1.5s infinite;
      }

      .blink-right {
        animation: blink-color 1.5s infinite 0.75s;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // 数字时钟定时器
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 格式化时间为 HH:MM:SS
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    // 最外层容器
    <div 
      style={{ 
        position: 'relative',
        marginBottom: '1rem',
        overflow: 'hidden',
        backgroundColor: '#0a1a30', // 整体背景色统一
        borderBottom: '1px solid rgba(6, 182, 212, 0.3)',
      }}
    >
      {/* 核心：顶部背景条（整合标题+折线+小方块+按钮，横向排列） */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '60px', // 稍微加高，容纳按钮
          background: 'linear-gradient(90deg, #051a3a 0%, #0a2a5a 50%, #051a3a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', // 左侧标题，右侧按钮
          padding: '0 1rem',
        }}
      >
        {/* 左侧：数字时钟 + 两条圆润台阶式折线 + 平行四边形小方块 */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* 数字时钟（电子表样式） */}
          <div 
            style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#67e8f9',
              textShadow: '0 0 8px rgba(6, 182, 212, 0.6)',
              margin: 0,
              fontFamily: "'Courier New', monospace", // 等宽字体，模拟电子表
              letterSpacing: '0.1em', // 增加字符间距，更像电子表
            }}
          >
            {formatTime(currentTime)}
          </div>

          {/* ========== 核心修正：从标题栏右上角开始的圆润折线 ========== */}
          <svg 
            width="240" 
            height="40" 
            viewBox="0 0 240 40" 
            style={{
              position: 'absolute',
              top: 0,
              left: '240px', // 移动到标题栏右侧
              zIndex: 5,
              overflow: 'visible',
            }}
          >
            {/* 第一条圆润折线（外层，稍粗） */}
            <path 
              d="M 0 0 L 120 0 Q 140 0 140 20 L 240 20" 
              stroke="rgba(6, 182, 212, 0.3)" 
              strokeWidth="2" 
              fill="none" 
            />
            {/* 第二条圆润折线（内层，更细更淡，与第一条平行） */}
            <path 
              d="M 5 0 L 125 0 Q 145 0 145 20 L 245 20" 
              stroke="rgba(6, 182, 212, 0.2)" 
              strokeWidth="1" 
              fill="none" 
            />
          </svg>

          {/* 平行四边形小方块（在折线内部，整体前移5px，添加闪烁动画） */}
          <div 
            style={{
              display: 'flex',
              gap: '12px',
              position: 'absolute',
              top: '8px',
              left: '245px', // 从250px前移5px，避免与线重叠
              zIndex: 6,
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="blink-left"
                style={{
                  width: '16px',
                  height: '8px',
                  transform: 'skewX(-25deg)', // 平行四边形
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        </div>

        {/* 中间：系统标题（跑圈高亮轮线边框，整体左移100px） */}
        <div
          style={{
            position: 'absolute',
            left: 'calc(50% - 100px)', // 整体左移100px
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 7, // 层级高于折线和小方块
          }}
        >
          <div className="title-container">
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#ff4d4f', // 红色标题
                textShadow: '0 0 8px rgba(255, 77, 79, 0.6)',
                margin: 0,
              }}
            >
              物联网称重交易管理系统
            </h1>
          </div>
        </div>

        {/* 右侧：对称折线 + 对称平行四边形小方块 + 按钮区域 */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* 右侧对称折线（与左侧折线对称，整体向左移动避免重叠） */}
          <svg 
            width="240" 
            height="40" 
            viewBox="0 0 240 40" 
            style={{
              position: 'absolute',
              top: 0,
              right: '500px', // 调整位置避免与按钮重叠
              zIndex: 5,
              overflow: 'visible',
            }}
          >
            {/* 第一条圆润折线（外层，稍粗） */}
            <path 
              d="M 240 0 L 120 0 Q 100 0 100 20 L 0 20" 
              stroke="rgba(6, 182, 212, 0.3)" 
              strokeWidth="2" 
              fill="none" 
            />
            {/* 第二条圆润折线（内层，更细更淡，与第一条平行） */}
            <path 
              d="M 235 0 L 115 0 Q 95 0 95 20 L -5 20" 
              stroke="rgba(6, 182, 212, 0.2)" 
              strokeWidth="1" 
              fill="none" 
            />
          </svg>

          {/* 右侧对称平行四边形小方块（与左侧对称，skewX为正25度，添加闪烁动画） */}
          <div 
            style={{
              display: 'flex',
              gap: '12px',
              position: 'absolute',
              top: '8px',
              right: '505px', // 与左侧left:245px对称，避免与线重叠
              zIndex: 6,
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="blink-right"
                style={{
                  width: '16px',
                  height: '8px',
                  transform: 'skewX(25deg)', // 与左侧-25度对称
                  opacity: 0.7,
                }}
              />
            ))}
          </div>

          {/* 按钮区域（和标题同一行） */}
          <div 
            style={{ 
              display: 'flex', 
              gap: '1rem',
              alignItems: 'center',
              zIndex: 10, // 按钮层级高于折线
            }}
          >
            <button
              style={getBtnStyle('home')}
              onMouseEnter={() => handleMouseEnter('home')}
              onMouseLeave={() => handleMouseLeave('home')}
              onClick={() => navigate('/')}
            >
              首页
            </button>
            <button
              style={getBtnStyle('maintain')}
              onMouseEnter={() => handleMouseEnter('maintain')}
              onMouseLeave={() => handleMouseLeave('maintain')}
              onClick={() => navigate('/data-maintenance')}
            >
              数据维护
            </button>
            <button
              style={getBtnStyle('statistics')}
              onMouseEnter={() => handleMouseEnter('statistics')}
              onMouseLeave={() => handleMouseLeave('statistics')}
              onClick={() => navigate('/statistics')}
            >
              统计查询
            </button>
            <button
              style={getBtnStyle('settings')}
              onMouseEnter={() => handleMouseEnter('settings')}
              onMouseLeave={() => handleMouseLeave('settings')}
              onClick={() => navigate('/settings')}
            >
              功能设置
            </button>
            <span style={{ 
              fontSize: '0.875rem', 
              color: '#a5f3fc',
            }}>
              用户身份：管理员
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeighingTopNav;