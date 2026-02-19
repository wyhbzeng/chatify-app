import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
// 新增：导入称重相关页面
import AppSelectionPage from "./pages/AppSelectionPage";
import WeighingHomePage from "./pages/weighing/WeighingHomePage";
import WeighingRecordsPage from "./pages/weighing/WeighingRecordsPage";

import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 加载中显示 loader
  if (isCheckingAuth) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <Routes>
        {/* 核心修改：已登录跳转到应用选择页，未登录跳转到登录页 */}
        <Route path="/" element={authUser ? <AppSelectionPage /> : <Navigate to="/login" />} />
        
        {/* 原有路由保持不变 */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        
        {/* 聊天系统路由 */}
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        
        {/* 新增：称重系统路由 */}
        <Route path="/weighing" element={authUser ? <WeighingHomePage /> : <Navigate to="/login" />} />
        <Route path="/weighing/records" element={authUser ? <WeighingRecordsPage /> : <Navigate to="/login" />} />
      </Routes>

      {/* 提示框组件 */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          error: {
            duration: 5000,
          }
        }}
      />
    </div>
  );
}

export default App;