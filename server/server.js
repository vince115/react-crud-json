// server.js
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes'); // 確保路徑正確
const app = express();

app.use(cors()); // 啟用 CORS 中間件，允許跨域請求
app.use(express.json()); // 解析 JSON 請求

// 使用路由，并添加 /api 前缀
app.use('/api', apiRoutes);

// 監聽端口
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
