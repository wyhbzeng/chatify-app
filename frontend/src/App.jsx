import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
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
    
    // 🔥 强制移除所有可能拦截输入的元素
    const fixInputBlock = () => {
      const toasterContainer = document.querySelector('[data-rht-toaster]');
      if (toasterContainer) {
        toasterContainer.style.pointerEvents = 'none';
        toasterContainer.style.zIndex = 'auto'; // 把它放到页面后面
      }
    };

    // 页面加载后立即执行
    fixInputBlock();
    // 延迟再执行一次，确保覆盖所有情况
    setTimeout(fixInputBlock, 100);
  }, [checkAuth]);

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
        <Route path="/" element={authUser ? <AppSelectionPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/weighing" element={authUser ? <WeighingHomePage /> : <Navigate to="/login" />} />
        <Route path="/weighing/records" element={authUser ? <WeighingRecordsPage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;