import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // 上传状态锁

  const fileInputRef = useRef(null);

  // 核心修复：上传File对象（不是Base64），适配MinIO上传逻辑
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 校验文件类型
    if (!file.type.startsWith('image/')) {
      toast.error("请选择jpg/png等图片格式！");
      return;
    }

    setIsUploading(true);
    try {
      // 1. 本地预览（体验优化）
      const previewUrl = URL.createObjectURL(file);
      setSelectedImg(previewUrl);

      // 2. 构建FormData（文件上传标准格式）
      const formData = new FormData();
      formData.append("profilePic", file); // 字段名和后端 upload.single('profilePic') 对应

      // 3. 调用更新头像接口
      const updatedUser = await updateProfile(formData);
      
      // 4. 成功后更新为MinIO的正式URL（刷新不丢失）
      setSelectedImg(updatedUser.profilePic);
      toast.success("头像更新成功！");
    } catch (error) {
      console.error("头像上传失败:", error);
      toast.error("头像更新失败：" + (error.response?.data?.message || "网络错误"));
      // 失败回滚：恢复原头像
      setSelectedImg(authUser.profilePic || "/avatar.png");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => !isUploading && fileInputRef.current.click()}
              disabled={isUploading}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">
                  {isUploading ? "上传中..." : "Change"}
                </span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>

            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {/* LOGOUT BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
            disabled={isUploading}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
            disabled={isUploading}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;