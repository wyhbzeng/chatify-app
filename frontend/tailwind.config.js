import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        border: "border 4s linear infinite", // 保留最初的border动画
        "glow-pulse": "glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite", // 保留最初的呼吸发光动画
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" }, // 保留原border关键帧
        },
        "glow-pulse": { // 保留原glow-pulse关键帧
          "0%, 100%": {
            boxShadow: "0 0 6px rgba(6, 182, 212, 0.4), 0 0 10px rgba(6, 182, 212, 0.2)"
          },
          "50%": {
            boxShadow: "0 0 12px rgba(6, 182, 212, 0.8), 0 0 20px rgba(6, 182, 212, 0.4)"
          }
        }
      },
    },
  },
  plugins: [
    require("daisyui") // 只保留daisyUI插件，移除自定义按钮样式的插件
  ],
};