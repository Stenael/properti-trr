const express = require("express");
const cors = require("cors");
const db = require("./db");

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const app = express();

app.use(cors());
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./auth");
// const sharp = require("sharp");

app.use("/uploads", express.static("uploads"));
const multer = require("multer");
const path = require("path");

const axios = require("axios");
const fs = require("fs");
const QRCode = require("qrcode");

const kodeLoket = "IDM202601270915367B9347";
const apiKey = "50002dd7d79242d884181a3c901dc7ea";
const clientSecret = "d642740b-1e1b-482c-8e5f-40d2fc18120d";

const merchantId = "936005032250000138";
const subMerchantId = "25062500000002";
const storeId = "ID2025414603006";

async function getToken() {
  const { data } = await axios.post(
    "https://trr08-api.rukuntetangga.net/qris-loket-grup/get_token.php",
    {
      kodeLoket,
      apiKey,
      clientSecret,
    },
  );
  return data.token;
}
app.get("/", (req, res) => {
  res.send("Backend berhasil berjalan!");
});

app.post("/register", (req, res) => {
  const { username, password, name, city, phone_number, email } = req.body;
  db.query(
    "SELECT * FROM akuns WHERE username=?",
    [username],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (result.length > 0) {
        return res.status(400).json({ message: "Error" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        "INSERT INTO akuns (username, password, name, city, phone_number, email, exclusive) VALUES (?, ?, ?, ?, ?, ?, 0)",
        [username, hashedPassword, name, city, phone_number, email],
        (err) => {
          if (err)
            return res.status(500).json({ message: "Error registering user" });
          res.status(201).json({ message: "User registered successfully" });
        },
      );
    },
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM akuns WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (result.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "4h",
      });
      res.json({ message: "Login successful", token });
    },
  );
});

app.post("/logout", (req, res) => {
  res.json({ message: "Logout successful (JWT)" });
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
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage,
});

// const compressImages = async (req, res, next) => {
//   if (!req.files?.length) {
//     return next();
//   }

//   try {
//     for (const file of req.files) {
//       const filePath = path.join(__dirname, "uploads", file.filename);

//       console.log(filePath);

//       const buffer = await sharp(filePath)
//         .rotate()
//         .resize({
//           width: 1600,
//           withoutEnlargement: true,
//         })
//         .jpeg({
//           quality: 75,
//           mozjpeg: true,
//         })
//         .toBuffer();

//       await fs.promises.writeFile(filePath, buffer);
//     }

//     next();

//     next();
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Gagal mengompres gambar",
//     });
//   }
// };

app.post(
  "/promotion",
  authenticateToken,
  upload.array("images", 10),
  //  (req, res, next) => {
  //   console.log(req.files);
  //   next();
  // },
  // compressImages,
  (req, res) => {
    if (!req.files || req.files.length > 10) {
      return res.status(400).json({
        message: "Maksimal upload 10 gambar.",
      });
    }
    const {
      name,
      address,
      village,
      district,
      building,
      priceType,
      price,
      pricePerMeter,
      length,
      width,
      luasTanah,
      luasBangunan,
      listrik,
      type,
      kt,
      ktPlus,
      km,
      kmPlus,
      sertifikat,
      deskripsi,
      created_at,
      status,
    } = req.body;
    const imagePaths = req.files.map((file) => file.filename);
    db.query(
      `INSERT INTO properties
      (
        userId,
        name,
        address,
        village,
        district,
        building,
        price_type,
        price,
        price_perMeter,
        length,
        width,
        luasTanah,
        luasBangunan,
        listrik,
        type,
        kt,
        kt_plus,
        km,
        km_plus,
        sertifikat,
        images,
        deskripsi,
        created_at,
        status
      )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,Now(),0)`,
      [
        req.userId,
        name,
        address,
        village,
        district,
        building,
        priceType,
        price || null,
        pricePerMeter || null,
        length,
        width,
        luasTanah,
        luasBangunan,
        listrik,
        type,
        kt,
        ktPlus || 0,
        km,
        kmPlus || 0,
        sertifikat,
        JSON.stringify(imagePaths),
        deskripsi,
        created_at,
        status,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Gagal menyimpan data",
          });
        }
        res.json({
          message: "Berhasil menambah properti",
        });
      },
    );
  },
);

app.delete("/properties/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT images FROM properties WHERE id=? AND userId=?", [
        id,
        req.userId,
      ]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Properti tidak ditemukan",
      });
    }
    const images = JSON.parse(rows[0].images);

    images.forEach((image) => {
      const imagePath = path.join(__dirname, "uploads", image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await db
      .promise()
      .query("DELETE FROM properties WHERE id=? AND userId=?", [
        id,
        req.userId,
      ]);

    res.json({
      message: "Properti berhasil dihapus",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

app.put(
  "/property/:id",
  authenticateToken,
  upload.array("images", 10),
  // compressImages,
  (req, res) => {
    const {
      name,
      address,
      village,
      district,
      building,
      priceType,
      price,
      pricePerMeter,
      length,
      width,
      luasTanah,
      luasBangunan,
      listrik,
      type,
      kt,
      ktPlus,
      km,
      kmPlus,
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
        if (req.files && req.files.length > 0) {
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
            price_type=?,
            price=?,
            price_perMeter=?,
            length=?,
            width=?,
            luasTanah=?,
            luasBangunan=?,
            listrik=?,
            type=?,
            kt=?,
            kt_plus=?,
            km=?,
            km_plus=?,
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
            priceType,
            price,
            pricePerMeter,
            length,
            width,
            luasTanah,
            luasBangunan,
            listrik,
            type,
            kt,
            ktPlus,
            km,
            kmPlus,
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
          },
        );
      },
    );
  },
);

app.get("/properties", authenticateToken, (req, res) => {
  db.query(
    `
    SELECT
      properties.*,
      akuns.name AS ownerName,
      akuns.city AS ownerCity,
      akuns.phone_number,
      akuns.exclusive,
      CASE
        WHEN akuns.exclusive = 1 THEN 0
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
    },
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
    },
  );
});

app.put("/properties/:id/sold", authenticateToken, (req, res) => {
  db.query(
    `
    UPDATE properties
    SET soldStatus = 1
    WHERE id = ? AND userId = ?
    `,
    [req.params.id, req.userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal mengubah status properti",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Properti tidak ditemukan",
        });
      }

      res.json({
        message: "Properti berhasil ditandai sebagai laku",
      });
    },
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
    WHERE properties.soldStatus = 0
    AND (akuns.exclusive = 1
          OR DATEDIFF(NOW(), properties.created_at) < 30)
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
    },
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
    WHERE properties.type = 'Dijual' AND properties.soldStatus = 0
    AND (akuns.exclusive = 1
        OR DATEDIFF(NOW(), properties.created_at) < 30)
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
    },
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
    WHERE properties.type = 'Disewa' AND properties.soldStatus = 0
    AND (akuns.exclusive = 1
        OR DATEDIFF(NOW(), properties.created_at) < 30)
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
    },
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
    },
  );
});

app.get("/exclusive", authenticateToken, (req, res) => {
  db.query(
    "SELECT id, name, exclusive FROM akuns WHERE id=?",
    [req.userId],
    (err, result) => {
      if (err) return res.sendStatus(500);

      res.json(result[0]);
    },
  );
});

app.post("/payment/generate-qris", authenticateToken, async (req, res) => {
  try {
    const { amount, propertyId } = req.body;
    const token = await getToken();
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    const partner_ref_no = `PROP${Date.now()}${random}`.slice(0, 25);
    const paymentAmount = Number(amount).toFixed(2);
    const { data } = await axios.post(
      "https://trr08-api.rukuntetangga.net/qris-loket-grup/generate_qris.php",
      {
        amount: paymentAmount,
        partner_ref_no,
        bankCode: "BMRI",
        bankAccount: "1400025570020",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    await query(
      `
    INSERT INTO payments
    (user_id, property_id, partner_ref_no, amount, status)
    VALUES (?,?,?,?,?)
    `,
      [req.userId, propertyId, partner_ref_no, amount, "PENDING"],
    );
    console.log(JSON.stringify(data, null, 2));
    console.log(partner_ref_no);
    console.log(partner_ref_no.length);
    console.log(typeof data);
    console.log(data.qrContent);
    const qr = JSON.parse(data.response.body);

    const qrImage = await QRCode.toDataURL(qr.qrContent);

    res.json({
      qrImage,
      partner_ref_no,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({
      message: "Generate QR gagal",
    });
  }
});

app.get(
  "/payment/query/:partner_ref_no",
  authenticateToken,
  async (req, res) => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        "https://trr08-api.rukuntetangga.net/qris-loket-grup/query_qris.php",
        {
          kodeLoket,
          apiKey,
          clientSecret,
          partner_ref_no: req.params.partner_ref_no,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(JSON.stringify(data, null, 2));

      const result = JSON.parse(data.response.body);

      if (result.responseData?.qrisStatus === "PAID") {
        await query(
          `
      UPDATE payments
      SET
          status='PAID'
      WHERE partner_ref_no=?
      `,
          [req.params.partner_ref_no],
        );

        await query(
          `
      UPDATE properties
      SET
          created_at=NOW(),
          status=0
      WHERE id=(
          SELECT property_id
          FROM payments
          WHERE partner_ref_no=?
      )
      `,
          [req.params.partner_ref_no],
        );
      }

      res.json(result);
    } catch (err) {
      console.log(err.response?.data || err.message);

      res.status(500).json({
        message: "Query pembayaran gagal",
      });
    }
  },
);

app.post("/payment/callback", async (req, res) => {
  const { partner_ref_no, qrisStatus } = req.body;

  if (qrisStatus === "PAID") {
    await query(
      `
    UPDATE payments
    SET status='PAID'
    WHERE partner_ref_no=?
    `,
      [partner_ref_no],
    );

    await query(
      `
    UPDATE properties
    SET status=0
    WHERE id=(
        SELECT property_id
        FROM payments
        WHERE partner_ref_no=?
    )
    `,
      [partner_ref_no],
    );
  }
  res.sendStatus(200);
});

app.get("/profile", authenticateToken, (req, res) => {
  db.query(
    `
    SELECT
      id,
      username,
      name,
      city,
      phone_number,
      email,
      exclusive
    FROM akuns
    WHERE id = ?
    `,
    [req.userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Server Error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "User tidak ditemukan",
        });
      }

      res.json(result[0]);
    },
  );
});

app.put("/profile", authenticateToken, (req, res) => {
  const { name, phone_number, email, city } = req.body;

  db.query(
    `
    UPDATE akuns
    SET
      name=?,
      phone_number=?,
      email=?,
      city=?
    WHERE id=?
    `,
    [name, phone_number, email, city, req.userId],
    (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Gagal mengupdate profile",
        });
      }

      res.json({
        message: "Profile berhasil diperbarui",
      });
    },
  );
});

app.post("/profile/check-password", authenticateToken, (req, res) => {
  db.query(
    "SELECT password FROM akuns WHERE id=?",
    [req.userId],
    async (err, result) => {
      if (err) return res.sendStatus(500);

      const match = await bcrypt.compare(req.body.password, result[0].password);

      if (!match) {
        return res.status(400).json({
          message: "Password lama salah.",
        });
      }

      res.json({
        message: "OK",
      });
    },
  );
});

app.put("/profile/change-password", authenticateToken, async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  db.query(
    "UPDATE akuns SET password=? WHERE id=?",
    [hash, req.userId],
    (err) => {
      if (err) return res.sendStatus(500);

      res.json({
        message: "Password berhasil diubah.",
      });
    },
  );
});

const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
