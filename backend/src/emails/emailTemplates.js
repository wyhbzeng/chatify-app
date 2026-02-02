export function createWelcomeEmailTemplate(name, clientURL) {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN"> <!-- 改为中文语言标识 -->
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>欢迎使用信使通讯</title> <!-- 中文标题 -->
      </head>
      <body style="font-family: 'Microsoft YaHei', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <img src="https://img.freepik.com/free-vector/hand-drawn-message-element-vector-cute-sticker_53876-118344.jpg?t=st=1741295028~exp=1741298628~hmac=0d076f885d7095f0b5bc8d34136cd6d64749455f8cb5f29a924281bafc11b96c&w=1480" alt="信使通讯标志" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: white; padding: 10px;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">欢迎使用信使通讯！</h1> <!-- 中文欢迎语 -->
        </div>
        <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <p style="font-size: 18px; color: #5B86E5;"><strong>你好 ${name}，</strong></p> <!-- 替换为中文问候 -->
          <p>非常高兴你加入我们的通讯平台！信使通讯能让你随时随地与亲友、同事进行实时沟通，不受地域限制。</p>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #36D1DC;">
            <p style="font-size: 16px; margin: 0 0 15px 0;"><strong>只需几步即可快速上手：</strong></p>
            <ul style="padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 10px;">设置你的个人头像</li>
              <li style="margin-bottom: 10px;">查找并添加联系人</li>
              <li style="margin-bottom: 10px;">开启首次对话</li>
              <li style="margin-bottom: 0;">分享照片、视频等更多内容</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href=${clientURL} style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">打开信使通讯</a> <!-- 中文按钮文字 -->
          </div>
          
          <p style="margin-bottom: 5px;">如果你在使用过程中需要帮助或有任何疑问，我们随时为你提供支持。</p>
          <p style="margin-top: 0;">祝你使用愉快！</p>
          
          <p style="margin-top: 25px; margin-bottom: 0;">此致<br>信使通讯团队</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© 2025 信使通讯 版权所有。</p>
          <p>
            <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">隐私政策</a>
            <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">服务条款</a>
            <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">联系我们</a>
          </p>
        </div>
      </body>
      </html>
      `;
  }