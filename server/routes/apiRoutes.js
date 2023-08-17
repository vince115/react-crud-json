// server/routes/apiRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// 处理 GET 请求，从 JSON 文件中读取数据
router.get("/data/", (req, res) => {
  const jsonFilePath = path.join(__dirname, "../data/users.json"); // 使用 path.join 来获取正确的文件路径
  const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
  const data = JSON.parse(jsonData);
  res.json(data);
});

// 处理 GET 请求，根据用户 ID 获取数据
router.get("/data/:id", (req, res) => {
  const userId = parseInt(req.params.id); // 从请求参数中获取用户 ID
  const jsonFilePath = path.join(__dirname, "../data/users.json");
  const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
  const data = JSON.parse(jsonData);

  // 根据用户 ID 查找对应的用户数据
  const user = data.find((user) => user.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// 处理 POST 请求，将数据写入 JSON 文件
router.post("/data/", (req, res) => {
  try {
    const jsonFilePath = path.join(__dirname, "../data/users.json");
    const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
    const data = JSON.parse(jsonData);
    // 获取已存在数据的最后一条记录的 id
    //console.log("newData", newData);
    const lastId = data.length > 0 ? data[data.length - 1].id : 0;
    console.log("lastId", lastId);
    // 使用最后一条记录的 id 加一作为新用户的 id
    //const newData = req.body;
    const newUserId = lastId + 1;
    const newData = {
      id: newUserId, // 为新用户分配唯一的 id 值
      username: req.body.username,
      email: req.body.email,
    };

    //newData.id = lastId + 1;

    data.push(newData);
    // 将数据写入 JSON 文件，并在 JSON.stringify 中传入 replacer 函数以控制属性顺序
    fs.writeFileSync(
      jsonFilePath,
      JSON.stringify(
        data,
        (key, value) => {
          if (key === "id") {
            return value; // 保留 id 的原始值
          }
          return value !== undefined ? value : null; // 删除值为 undefined 的属性
        },
        2
      )
    );
    res.json({ message: "Data added successfully" });
  } catch (error) {
    console.error("Error adding data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 处理 PUT 请求，将数据更新至 JSON 文件
router.put("/data/:id", (req, res) => {
  try {
    const userIdToUpdate = parseInt(req.params.id);
    const newUserData = req.body;

    const jsonFilePath = path.join(__dirname, "../data/users.json");
    const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
    const data = JSON.parse(jsonData);


    // 查找要更新的用户在数据数组中的索引
    const userIndexToUpdate = data.findIndex(
      (user) => user.id === userIdToUpdate
    );

    if (userIndexToUpdate === -1) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // 更新用户数据
    data[userIndexToUpdate] = {
      id: userIdToUpdate,
      username: newUserData.username,
      email: newUserData.email,
    };

    // 将数据写入 JSON 文件
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 处理 DELETE 请求，根据用户 ID 删除数据
router.delete("/data/:id", (req, res) => {
  try {
    const userIdToDelete = parseInt(req.params.id);
    const jsonFilePath = path.join(__dirname, "../data/users.json");
    const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
    const data = JSON.parse(jsonData);

    // 查找要删除的用户在数据数组中的索引
    const userIndexToDelete = data.findIndex(
      (user) => user.id === userIdToDelete
    );
    if (userIndexToDelete === -1) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // 从数据数组中删除用户
    data.splice(userIndexToDelete, 1);

    // 将数据写入 JSON 文件
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
