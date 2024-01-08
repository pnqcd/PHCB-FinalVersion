const controller = {};
const moment = require('moment');
const pool = require("../../database/database");

controller.show = async (req, res) => {
    const client = await pool.connect();

    const editAdsQuery = client.query(`SELECT r.id, r."placeId", r."originId", r."adName", p."diaChi", p."khuVuc", r."adSize", r."adQuantity", r."expireDay", r."imagePath", r."publicImageId", r."liDoChinhSua" 
        FROM "Requesteditads" r JOIN "Places" p ON r."placeId" = p.id 
        ORDER BY r."createdAt" DESC`);

    const editPlaceQuery = client.query(`SELECT id, "placeId", "diaChi", "khuVuc", "loaiVT", "hinhThuc", "hinhAnh", "hinhAnhId", "quyHoach", "liDoChinhSua"
        FROM "Requesteditplaces" 
        ORDER BY "createdAt" DESC`);

    const adsLicenseQuery = client.query(`SELECT r.id, r."congTy", r."diaChiCongTy", r."dienThoai", r.email, r."placeId", p."diaChi", r."tenBangQuangCao", r."noiDungQC", r."kichThuoc", r."soLuong", r."hinhAnh", r."hinhAnhId", r."ngayBatDau", r."ngayKetThuc", r."tinhTrang"
        FROM "Requestads" r JOIN "Places" p ON r."placeId" = p.id
        ORDER BY r."createdAt" DESC`);

    try {
        const [editAdsResult, editPlaceResult, adsLicenseResult] = await Promise.all([editAdsQuery, editPlaceQuery, adsLicenseQuery]);

        res.locals.editAdsRequests = editAdsResult.rows.map((row) => ({
            ...row,
            expireDay: moment(row.expireDay).format('MM/DD/YYYY'),
        }));

        res.locals.editPlaceRequests = editPlaceResult.rows;

        res.locals.adsLicenseRequests = adsLicenseResult.rows
        .map((row) => ({
            ...row, 
            ngayBatDau: moment(row.ngayBatDau).format('MM/DD/YYYY'),
            ngayKetThuc: moment(row.ngayKetThuc).format('MM/DD/YYYY')
        }));

        res.render("PHCB-So/request", {layout: "PHCB-So/layout"});
    } catch (error) {
        console.log("Error: ", error);
    } finally {
        await client.release();
        // await client.end();
    }
};

controller.requestEditAds = async (req, res) => {
    const client = await pool.connect();

    let {id, originId, placeId, adNameRequest, adSizeRequest, adQuantityRequest, expireDayRequest, handleAdsEditRequest} = req.body;

    try {
        if (handleAdsEditRequest == "Phê duyệt") {
            const updateQuery = `UPDATE "Placedetails"
                                SET "placeId" = $1, "adName" = $2, "adSize" = $3, "adQuantity" = $4, "expireDay" = $5
                                WHERE id = $6`;
            await client.query(updateQuery, [
                placeId,
                adNameRequest,
                adSizeRequest,
                adQuantityRequest,
                expireDayRequest,
                originId
            ]);
            res.send("Đã cập nhật bảng QC!");
        } 

        // Delete handled request
        const deleteQuery = `
            DELETE FROM "Requesteditads"
            WHERE id = $1
        `;
        await client.query(deleteQuery, [id]);
        res.send('Xoá yêu cầu đã xử lý thành công');
    } catch (error) {
        // res.send("Lỗi rồi");
        console.error(error);
    } 
    finally {
        await client.release();
        // await client.end();
    }
}

controller.requestEditPlace = async (req, res) => {
    console.log("helloo");
    const client = await pool.connect();

    let {id, placeId, diaChiRequest, khuVucRequest, loaiVtRequest, hinhThucRequest, isQuyHoach, handlePlaceEditRequest, hinhAnh, hinhAnhId} = req.body;

    try {
        if (handlePlaceEditRequest == "Phê duyệt") {
            const updateQuery = `UPDATE "Places"
                                SET "diaChi" = $1, "khuVuc" = $2, "loaiVT" = $3, "hinhThuc" = $4, "quyHoach" = $5, "hinhAnh" = $6, "hinhAnhId" = $7
                                WHERE id = $8`;
            await client.query(updateQuery, [
                diaChiRequest,
                khuVucRequest,
                loaiVtRequest,
                hinhThucRequest,
                isQuyHoach ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH",
                hinhAnh,
                hinhAnhId,
                placeId
            ]);
            res.send("Đã cập nhật điểm đặt!");
        } 

        // Delete handled request
        const deleteQuery = `
            DELETE FROM "Requesteditplaces"
            WHERE id = $1
        `;
        await client.query(deleteQuery, [id]);
        res.send('Xoá yêu cầu đã xử lý thành công');
    } catch (error) {
        // res.send("Lỗi rồi");
        console.error(error);
    } finally {
        await client.release();
        // await client.end();
    }
}

controller.showOriginPlaceDetail = async (req, res) => {
    let client;

    try {
        const { placeId } = req.query;
        if (placeId) {
            client = await pool.connect();
            const placeResult = await client.query(`SELECT * FROM "Places" WHERE id = $1`, [placeId]);
            const originPlace = placeResult.rows;
            res.json({ originPlace });
        }

        const { requestId } = req.query;
        if (requestId) {
            client = await pool.connect();
            const requestResult = await client.query(`SELECT * FROM "Requesteditplaces" WHERE id = $1`, [requestId]);
            const requestPlace = requestResult.rows;
            res.json({ requestPlace });
        }
    } catch (error) {
        res.status(500).json({ error });
        console.error("Error: ", error);
    } finally {
        if (client) {
            await client.release();
            // await client.end();
        }
    }
}

controller.showOriginAdsDetail = async (req, res) => {
    let client;

    try {
        const { adsId } = req.query;
        if (adsId) {
            client = await pool.connect();
            const results = await client.query(`SELECT d."adName", p."diaChi", p."khuVuc", d."adSize", d."adQuantity", d."expireDay" 
                        FROM "Placedetails" d JOIN "Places" p ON d."placeId" = p.id 
                        WHERE d.id = $1`, [adsId]);
            let formattedResults = results.rows.map(row => ({
                ...row,
                expireDay: moment(row.expireDay).format("MM/DD/YYYY")
            }));
            res.json({ originAds: formattedResults });
        }

        const { requestId } = req.query;
        if (requestId) {
            client = await pool.connect();
            const results = await client.query(`SELECT r."adName", p."diaChi", p."khuVuc", r."adSize", r."adQuantity", r."expireDay" 
                        FROM "Requesteditads" r JOIN "Places" p ON r."placeId" = p.id 
                        WHERE r.id = $1`, [requestId]);
            let formattedResults = results.rows.map(row => ({
                ...row,
                expireDay: moment(row.expireDay).format("MM/DD/YYYY")
            }));
            res.json({ requestAds: formattedResults });
        }
    } catch (error) {
        res.status(500).json({ error });
        console.error("Error: ", error);
    } finally {
        if (client) {
            await client.release();
            // await client.end();
        }
    }
}

controller.approveAds = async (req, res) => {
    let {id, placeId, tenBangQuangCao, kichThuoc, soLuong, ngayKetThuc} = req.body;

    let client;

    try {
        client = await pool.connect();

        const insertQuery = `INSERT INTO "Placedetails" ("placeId", "adName", "adSize", "adQuantity", "expireDay", "createdAt", "updatedAt")
                            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
        await client.query(insertQuery, [placeId, tenBangQuangCao, kichThuoc, soLuong, ngayKetThuc]);
        
        const updateQuery = `UPDATE "Requestads"
                            SET "tinhTrang" = $1
                            WHERE id = $2`;
        await client.query(updateQuery, ["Đã phê duyệt", id]);
        // res.send("Đã cập nhật điểm đặt!");

        // res.send("Đã phê duyệt yêu cầu cấp phép bảng QC");
        res.redirect("/PHCB-So/yeu-cau");
    } catch (error) {
        res.status(500).send("Lỗi phê duyệt");
        console.error("Error: ", error);
    } finally {
        if (client) {
            await client.release();
            // await client.end();
        }
    }
}

controller.notApproveAds = async (req, res) => {
    let { id } = req.body;
    const client = await pool.connect();
    try {
        const updateQuery = `UPDATE "Requestads"
                            SET "tinhTrang" = $1
                            WHERE id = $2`;
        await client.query(updateQuery, ["Không phê duyệt", id]);
        res.send("Đã không phê duyệt");
    } catch (error) {
        console.error(error);
    } finally {
        await client.release();
        // await client.end();
    }
}

// route middleware to ensure user is logged in 
controller.isLoggedIn = async (req, res, next) => {
    if (req.user) {
        res.locals.user = req.user;
        if (req.user.isDepartment)
            next();
        else res.redirect('/');
    } else {
        res.redirect(`/login?reqUrl=${req.originalUrl}`);
    }
}

module.exports = controller;