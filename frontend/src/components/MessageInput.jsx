import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, PlusIcon } from "lucide-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);
  const { sendMessage, isSoundEnabled } = useChatStore();

  // 清理预览URL，避免内存泄漏
  useEffect(() => {
    return () => {
      selectedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, [selectedImages]);

  // 选择图片（支持多选）
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // 验证文件类型
    const validFiles = files.filter(file => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      toast.error("Please select only image files");
      return;
    }

    // 生成预览并存储
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
  };

  // 移除选中的图片
  const removeImage = (index) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview); // 释放内存
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // 发送消息（文本 + 所有选中图片）
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && selectedImages.length === 0) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    // 依次发送每张图片和文本
    if (selectedImages.length > 0) {
      selectedImages.forEach(({ file }) => {
        sendMessage({
          text: text.trim(),
          imageFile: file,
        });
      });
    } else {
      sendMessage({
        text: text.trim(),
        imageFile: null,
      });
    }

    // 清空状态
    setText("");
    setSelectedImages(prev => {
      prev.forEach(img => URL.revokeObjectURL(img.preview));
      return [];
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-slate-900 border-t border-slate-700/50 shrink-0">
      {/* 图片预览区：横向滚动，不占用垂直空间 */}
      {selectedImages.length > 0 && (
        <div className="px-3 py-2 overflow-x-auto flex space-x-2 bg-slate-800/30">
          {selectedImages.map((img, index) => (
            <div key={index} className="relative flex-shrink-0">
              <img
                src={img.preview}
                alt={`Preview ${index + 1}`}
                className="w-16 h-16 object-cover rounded-lg border border-slate-700"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
                type="button"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 输入栏：自适应宽度，发送按钮固定 */}
      <div className="px-3 py-3 flex items-center space-x-2 w-full">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg p-2.5 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
        </button>

        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* 输入框自适应剩余宽度 */}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-3 px-4 text-yellow-400 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-base min-w-[100px]"
          placeholder="Type your message..."
        />

        {/* 发送按钮固定尺寸，始终可见 */}
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!text.trim() && selectedImages.length === 0}
          className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg p-2.5 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[50px] h-[50px] flex items-center justify-center"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default MessageInput;