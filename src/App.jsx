import React, { useEffect, useRef, useState } from 'react';

// 统一的按钮组件 (支持左右侧不同朝向) 
const SciFiButton = ({ children, active, className = '', offset = '0px', dir = 'left' }) => {
  // 根据左右侧决定切角方向
  const clipClass = dir === 'left' 
    ? '[clip-path:polygon(15px_0,100%_0,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%,0_15px)]'
    : '[clip-path:polygon(0_0,calc(100%-15px)_0,100%_15px,100%_100%,15px_100%,0_calc(100%-15px))]';

  // 根据左右侧决定投影方向：左侧按钮投影向右下，右侧按钮投影向左下
  const shadowClass = dir === 'left'
    ? 'drop-shadow-[15px_10px_10px_rgba(255,255,255,0.08)]'
    : 'drop-shadow-[-15px_10px_10px_rgba(255,255,255,0.08)]';

  return (
    <div
      style={{ transform: `translateX(${offset})` }}
      className={`
        relative flex items-center justify-between h-[60px] min-w-[180px] px-5 text-base font-bold tracking-widest cursor-pointer transition-all duration-300 ease-out
        backdrop-blur-md rounded-sm ${clipClass} ${shadowClass}
        hover:-translate-y-2 hover:brightness-110
        ${active 
          ? 'bg-gradient-to-r from-white/90 to-gray-200 text-black border-l-4 border-[#fcd116] shadow-[0_0_25px_rgba(252,209,22,0.4)] scale-105' 
          : 'bg-black/60 text-gray-300 border border-white/10 hover:border-[#fcd116] hover:bg-white/10'
        }
        ${className}
      `}
    >
      <span>{children}</span>
      {/* 右侧小箭头装饰 */}
      <span className={`text-[10px] ${active ? 'text-black' : 'text-[#fcd116]'} opacity-70`}>⫸</span>
      
      {/* 激活时的发光圆点 */}
      {active && <div className="absolute -left-1 w-2 h-2 bg-[#fcd116] rounded-full shadow-[0_0_8px_#fcd116]"></div>}
    </div>
  );
};

export default function App() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
      const rotateY = -1 + (x * 10); 
      const rotateX = 1 - (y * 10);  
      containerRef.current.style.transform = `perspective(1400px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(0)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-screen h-screen relative flex justify-center items-center scanline-effect overflow-hidden bg-black">
      
      {/* 1. 背景层 */}
      <div className="fixed inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}bg.jpg`} 
          alt="background" 
          className="w-full h-full object-cover opacity-30"
          style={{ 
            transform: `scale(1.05) translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`, 
            transition: 'transform 0.1s ease-out' 
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-90"></div>
      </div>

      {/* 2. 核心 3D 容器 */}
      <div 
        ref={containerRef} 
        className="relative w-[1400px] h-[850px] transition-transform duration-75 ease-out z-10"
        style={{ transformStyle: 'preserve-3d', transform: 'perspective(1400px) rotateY(-1deg) rotateX(1deg)' }}
      >
        
        {/* --- 顶部装饰性状态栏 --- 修改为 left-[120px] --- */}
        <div className="absolute top-[40px] left-[120px] flex gap-8 items-center text-[12px] font-mono text-gray-400">
          <div className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">SETTINGS <span className="text-[#fcd116]">01</span></div>
          <div className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">MAILBOX <span className="text-[#fcd116]">12</span></div>
          <div className="text-[#fcd116] animate-pulse">SYSTEM WARNING: CORE_LEVEL_LOW</div>
        </div>

        {/* --- 右上角：新闻/系统面板 --- */}
        <div className="absolute top-[30px] right-[50px] w-[320px] bg-black/80 border-t-2 border-[#fcd116] p-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] [clip-path:polygon(0_0,100%_0,100%_80%,90%_100%,0_100%)]">
           <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
              <span className="text-[10px] font-black text-[#fcd116] tracking-tighter uppercase">Breaking News / Up-to-date</span>
              <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                 <span className="text-[9px] text-gray-400">LIVE</span>
              </div>
           </div>
           <div className="relative h-12 overflow-hidden">
              <div className="text-white font-bold text-lg leading-tight tracking-tight italic">
                 <div className="animate-[pulse_1.5s_infinite]">TERMINUS_EST: UNKNOWN SIGNAL DETECTED</div>
              </div>
              <div className="absolute bottom-0 right-0 text-[10px] font-mono text-gray-500">v2.4.1_SECURE</div>
           </div>
           <div className="mt-3 flex gap-0.5">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`h-1 w-2 ${i % 3 === 0 ? 'bg-[#fcd116]' : 'bg-white/10'}`}></div>
              ))}
           </div>
        </div>

        {/* --- 左侧菜单 --- */}
        <div className="absolute left-[30px] top-1/2 -translate-y-1/2 flex flex-col gap-5 z-20">
          <SciFiButton offset="60px" active>博客主页</SciFiButton>
          <SciFiButton offset="25px" active>文章分类</SciFiButton>
          <SciFiButton offset="0px" active>寻访项目</SciFiButton>
          <SciFiButton offset="25px" active>好友中心</SciFiButton>
          <SciFiButton offset="60px" active>留言板块</SciFiButton>
        </div>

        {/* --- 右侧菜单 --- */}
        <div className="absolute right-[30px] top-1/2 -translate-y-1/2 flex flex-col gap-5 z-20 items-end">
          <SciFiButton dir="right" offset="-60px" active>行动手册</SciFiButton>
          <SciFiButton dir="right" offset="-25px" active>通行证</SciFiButton>
          <SciFiButton dir="right" offset="0px" active>地区建设</SciFiButton>
          <SciFiButton dir="right" offset="-25px" active>装备加工</SciFiButton>
          <SciFiButton dir="right" offset="-60px" active>档案资料</SciFiButton>
        </div>

        {/* --- 中央雷达核心区 --- */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] flex justify-center items-center">
          
          <div className="absolute w-full h-full rounded-full overflow-hidden z-0 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
             <img 
               src={`${import.meta.env.BASE_URL}image.png`}
               alt="Radar" 
               className="w-full h-full object-cover opacity-50 mix-blend-screen"
             />
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_85%)]"></div>
          </div>

          <div className="absolute w-full h-full rounded-full border border-white z-10 pointer-events-none opacity-40"></div>
          <div className="absolute w-[98%] h-[98%] rounded-full border-[2px] border-dashed border-white animate-[spin_60s_linear_infinite] z-10 opacity-30"></div>
          <div className="absolute w-[85%] h-[85%] rounded-full bg-[conic-gradient(from_0deg,transparent_60%,rgba(252,209,22,0.1)_95%,rgba(252,209,22,0.4)_100%)] animate-[spin_3.5s_linear_infinite] border border-[#fcd116]/10 z-10"></div>
          
          <div className="absolute w-[80%] h-[1px] bg-white/10 z-10"></div>
          <div className="absolute h-[80%] w-[1px] bg-white/10 z-10"></div>

          <div className="z-20 absolute flex flex-col items-center animate-[bounce_5s_ease-in-out_infinite]">
             <div className="text-[#fcd116] text-xs font-mono mb-2 tracking-[0.5em] opacity-50">TARGET_LOCKED</div>
             <div className="text-[#fcd116]/90 text-lg font-mono tracking-widest border border-[#fcd116]/30 px-8 py-3 bg-black/80 backdrop-blur-xl transform -skew-x-12 rounded-sm shadow-[0_0_30px_rgba(252,209,22,0.1)] transition-transform hover:scale-110 cursor-pointer">
                [ BLOG_CORE_UNIT ]
             </div>
          </div>

          <div className="absolute bottom-[100px] flex flex-col items-center bg-black/70 px-10 py-4 rounded-xl border border-white/10 backdrop-blur-2xl z-20 shadow-2xl">
             <h2 className="text-2xl tracking-[0.3em] font-light text-white/90">O.M.V. 帝江号</h2>
             <div className="flex items-center gap-3 text-[#00d2ff] mt-2">
               <span className="w-2 h-2 bg-[#00d2ff] rounded-full animate-pulse"></span>
               <span className="text-xs tracking-tighter font-bold uppercase">Central Hub Level 02</span>
             </div>
          </div>
        </div>

        {/* --- 左下角：个人信息卡片 --- */}
        <div className="absolute left-[30px] bottom-[30px] w-[400px] h-[110px] bg-gradient-to-r from-[#111]/95 to-black/95 border border-white/10 rounded-lg backdrop-blur-2xl flex items-center p-3 z-30 transition-all hover:scale-105 hover:border-[#fcd116]/40 group shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-[50%] bg-[#fcd116] rounded-r shadow-[0_0_15px_#fcd116] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/10 rounded-xl flex justify-center items-center text-red-400 bg-black/60 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-2xl group">
             <span className="text-xl"> ⏻ </span>
             <div className="absolute -bottom-6 text-[8px] text-gray-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">LOGOUT</div>
          </div>
          <div className="w-[85px] h-[85px] rounded-lg border-2 border-white/5 relative overflow-hidden bg-gradient-to-br from-gray-800 to-black mx-4 shrink-0 shadow-inner">
            <img src={`${import.meta.env.BASE_URL}logo2.jpg`}  alt="avatar" className="w-full h-full object-cover scale-110"/>
            <div className="absolute top-0 left-0 w-5 h-5 bg-[#fcd116] [clip-path:polygon(0_0,100%_0,0_100%)] opacity-80"></div>
          </div>
          <div className="flex-1 flex flex-col justify-center h-full">
            <div className="flex justify-between items-end mb-1">
              <h3 className="text-2xl font-black tracking-widest text-white">Admin</h3>
              <div className="flex flex-col items-end leading-none">
                <span className="text-[9px] text-gray-400 mb-1 font-mono">AUTH_LEVEL</span>
                <span className="text-xs font-mono text-[#fcd116] bg-[#fcd116]/10 px-2 py-0.5 border border-[#fcd116]/20 rounded-sm">10 / 1360</span>
              </div>
            </div>
            <div className="flex items-baseline gap-4 mt-1">
              <span className="text-4xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">36</span>
              <span className="text-xs text-gray-500 font-mono tracking-[0.2em]">UID: 325114514</span>
            </div>
          </div>
        </div>

        {/* --- 底部品牌 LOGO --- */}
        <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
           <div className="flex gap-8 border-b border-[#fcd116] bg-black/40 px-12 py-3 rounded-full backdrop-blur-md mb-4 hover:border-[#fcd116]/50 transition-colors cursor-pointer group">
             <span className="text-gray-400 text-xs font-bold tracking-[0.3em] group-hover:text-[#fcd116] transition-colors">INDUSTRIAL PLAN</span>
             <div className="w-[1px] h-4 bg-white/10"></div>
             <span className="text-gray-400 text-xs font-bold tracking-[0.3em] group-hover:text-[#fcd116] transition-colors">BRIEFING.EXE</span>
           </div>
           <div className="text-center group cursor-default">
             <h1 className="text-4xl font-black tracking-[0.5em] text-white opacity-90 transition-all group-hover:tracking-[0.6em] group-hover:opacity-100" style={{fontFamily: 'Impact, sans-serif'}}>ENDFIELD</h1>
             <div className="flex items-center justify-center gap-4 mt-2">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#fcd116]"></div>
                <p className="text-[10px] tracking-[0.8em] text-[#fcd116] font-bold">INDUSTRIES</p>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#fcd116]"></div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}