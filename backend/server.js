const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require('./auth');

app.use('/uploads', express.static('uploads'));
const multer = require("multer");
const path = require("path");

const fs = require("fs");
app.get("/", (req, res) => {
    res.send("Backend berhasil berjalan!");
});

app.post('/register', (req, res) => {
  const { username, password, name, city, phone_number, email } = req.body;
  db.query('SELECT * FROM akuns WHERE username=?', [username], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (result.length > 0) {
      return res.status(400).json({ message: 'Error' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO akuns (username, password, name, city, phone_number, email) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, name, city, phone_number, email],
      (err) => {
        if (err) return res.status(500).json({ message: 'Error registering user' });
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM akuns WHERE username = ?', [username], async (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '4h',
    });
    res.json({ message: 'Login successful', token});
  });
});

app.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful (JWT)' });
});

app.get("/checklogin", authenticateToken, (req, res) => {
  res.json({
    loggedIn: true,
    userId: req.userId,
  });
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    cb(
      null,
      Date.now() +
      "-" +
      Math.round(Math.random() * 1E9) +
      path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

app.post(
  "/promotion",
  authenticateToken,
  upload.array("images", 20),
  (req, res) => {
    const {
      name,
      address,
      village,
      district,
      building,
      price,
      luasTanah,
      luasBangunan,
      listrik,
      type,
      kt,
      km,
      sertifikat,
      deskripsi,
      date,
      status
    } = req.body;
    const imagePaths = req.files.map(file => file.filename);
    db.query(
      `INSERT INTO properties
      (
        userId,
        name,
        address,
        village,
        district,
        building,
        price,
        luasTanah,
        luasBangunan,
        listrik,
        type,
        kt,
        km,
        sertifikat,
        images,
        deskripsi,
        date,
        status
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,Now(),0)`,
      [
        req.userId,
        name,
        address,
        village,
        district,
        building,
        price,
        luasTanah,
        luasBangunan,
        listrik,
        type,
        kt,
        km,
        sertifikat,
        JSON.stringify(imagePaths),
        deskripsi,
        date,
        status
      ],
      (err,result)=>{
        if(err){
          console.log(err);
          return res.status(500).json({
            message:"Gagal menyimpan data"
          });
        }
        res.json({
          message:"Berhasil menambah properti"
        });
      }
    );
  }
);

app.put(
  "/property/:id",
  authenticateToken,
  upload.array("images", 20),
  (req, res) => {
    const {
      name,
      address,
      village,
      district,
      building,
      price,
      luasTanah,
      luasBangunan,
      listrik,
      type,
      kt,
      km,
      sertifikat,
      deskripsi,
    } = req.body;

    db.query(
      "SELECT images FROM properties WHERE id=? AND userId=?",
      [req.params.id, req.userId],
      (err, result) => {
        if (err)
          return res.status(500).json({
            message: "Server Error",
          });

        if (result.length === 0)
          return res.status(404).json({
            message: "Properti tidak ditemukan",
          });

        let images = JSON.parse(result[0].images || "[]");

        // jika upload gambar baru
        if (req.files && req.files.length > 0) {

          // hapus gambar lama
          images.forEach((img) => {
            const filePath = path.join(__dirname, "uploads", img);

            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });

          images = req.files.map((file) => file.filename);
        }

        db.query(
          `
          UPDATE properties
          SET
            name=?,
            address=?,
            village=?,
            district=?,
            building=?,
            price=?,
            luasTanah=?,
            luasBangunan=?,
            listrik=?,
            type=?,
            kt=?,
            km=?,
            sertifikat=?,
            images=?,
            deskripsi=?
          WHERE id=? AND userId=?
          `,
          [
            name,
            address,
            village,
            district,
            building,
            price,
            luasTanah,
            luasBangunan,
            listrik,
            type,
            kt,
            km,
            sertifikat,
            JSON.stringify(images),
            deskripsi,
            req.params.id,
            req.userId,
          ],
          (err) => {
            if (err) {
              console.log(err);

              return res.status(500).json({
                message: "Gagal mengupdate properti",
              });
            }

            res.json({
              message: "Properti berhasil diperbarui",
            });
          }
        );
      }
    );
  }
);

app.get("/properties", authenticateToken, (req, res) => {
  db.query(
    `
    SELECT
      properties.*,
      akuns.name AS ownerName,
      akuns.city AS ownerCity,
      akuns.phone_number,
      CASE
        WHEN DATEDIFF(NOW(), properties.created_at) >= 30 THEN 1
        ELSE properties.status
      END AS status
    FROM properties
    JOIN akuns
      ON properties.userId = akuns.id
    WHERE properties.userId = ?
    ORDER BY properties.id DESC
    `,
    [req.userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengambil data",
        });
      }

      const data = result.map((item) => ({
        ...item,
        images: JSON.parse(item.images || "[]"),
        deskripsi: JSON.parse(item.deskripsi || "[]"),
      }));

      res.json(data);
    }
  );
});

app.put("/properties/:id/reactivate", authenticateToken, (req, res) => {
  db.query(
    `
    UPDATE properties
    SET
      created_at = NOW(),
      status = 0
    WHERE id = ? AND userId = ?
    `,
    [req.params.id, req.userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengaktifkan kembali promosi",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Properti tidak ditemukan",
        });
      }

      res.json({
        message: "Promosi berhasil diaktifkan kembali",
      });
    }
  );
});

app.get("/propertiesAll", (req, res) => {
  db.query(
    `SELECT
      properties.*,
      akuns.name AS ownerName,
      akuns.city AS ownerCity,
      akuns.phone_number
    FROM properties
    JOIN akuns
    ON properties.userId = akuns.id
    ORDER BY properties.id DESC
    LIMIT 3`,
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengambil data",
        });
      }

      const data = result.map((item) => ({
        ...item,
        images: JSON.parse(item.images || "[]"),
        deskripsi: JSON.parse(item.deskripsi || "[]"),
      }));

      res.json(data);
    }
  );
});

app.get("/properties/sale", (req, res) => {
  db.query(
    `SELECT
      properties.*,
      akuns.name AS ownerName,
      akuns.city AS ownerCity,
      akuns.phone_number
    FROM properties
    JOIN akuns
      ON properties.userId = akuns.id
    WHERE properties.type = 'Dijual'
    ORDER BY properties.id DESC`,
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengambil data",
        });
      }

      const data = result.map((item) => ({
        ...item,
        images: JSON.parse(item.images || "[]"),
        deskripsi: JSON.parse(item.deskripsi || "[]"),
      }));

      res.json(data);
    }
  );
});

app.get("/properties/rent", (req, res) => {
  db.query(
    `SELECT
      properties.*,
      akuns.name AS ownerName,
      akuns.city AS ownerCity,
      akuns.phone_number
    FROM properties
    JOIN akuns
      ON properties.userId = akuns.id
    WHERE properties.type = 'Disewa'
    ORDER BY properties.id DESC`,
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengambil data",
        });
      }

      const data = result.map((item) => ({
        ...item,
        images: JSON.parse(item.images || "[]"),
        deskripsi: JSON.parse(item.deskripsi || "[]"),
      }));

      res.json(data);
    }
  );
});

app.get("/property/:id", (req, res) => {
  db.query(
    `
    SELECT
      properties.*,
      akuns.name AS ownerName,
      akuns.city AS ownerCity,
      akuns.phone_number
    FROM properties
    JOIN akuns
      ON properties.userId = akuns.id
    WHERE properties.id = ?
    `,
    [req.params.id],
    (err, result) => {
      if (err)
        return res.status(500).json({
          message: "Server Error",
        });

      if (result.length === 0)
        return res.status(404).json({
          message: "Properti tidak ditemukan",
        });

      const item = result[0];

      res.json({
        ...item,
        images: JSON.parse(item.images || "[]"),
        deskripsi: JSON.parse(item.deskripsi || "[]"),
      });
    }
  );
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});