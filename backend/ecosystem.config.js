module.exports = {
    apps: [
      {
        name: "ox-api",           // ชื่อของแอปพลิเคชัน
        script: "./app.js",       // ไฟล์ที่ใช้รันแอปพลิเคชัน
        watch: true,              // เปิดใช้งานการดูการเปลี่ยนแปลงของไฟล์
        env: {
          NODE_ENV: "development", // สภาพแวดล้อมการพัฒนา
        },
        env_production: {
          NODE_ENV: "production",  // สภาพแวดล้อมการโปรดักชัน
        }
      }
    ]
  }
  