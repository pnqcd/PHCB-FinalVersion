document.addEventListener("DOMContentLoaded", function () {
  let searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    let searchText = searchInput.value.toLowerCase();
    let tableRows = document.querySelectorAll("tbody tr");
    tableRows.forEach((row) => {
      let rowText = row.textContent.toLowerCase();
      if (rowText.includes(searchText)) {
        row.style.display = ""; // Show the row if it matches the search
      } else {
        row.style.display = "none"; // Hide the row if it doesn't match
      }
    });
  });
});

let editWardEle = document.querySelector("#editWardModal");
if (editWardEle) {
  editWardEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#wardNameEdit").focus();
  });
}

let addWardEle = document.querySelector("#addWardModal");
if (addWardEle) {
  addWardEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#wardName").focus();
  });
}

let addPlaceEle = document.querySelector("#addPlaceModal")
if (addPlaceEle) {
  addPlaceEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#diaChi").focus();
  });
}

let editPlaceEle = document.querySelector("#editPlaceModal");
if (editPlaceEle) {
  editPlaceEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#diaChiEdit").focus();
  });
}

let addAdsEle = document.querySelector("#addAdsModal");
if (addAdsEle) {
  addAdsEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#adName").focus();
  });
}

let editAdsEle = document.querySelector("#editAdsModal");
if (editAdsEle) {
  editAdsEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#adNameEdit").focus();
  });
}

let addAdstypeEle = document.querySelector("#addAdstypeModal");
if (addAdstypeEle) {
  addAdstypeEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#adstypeName").focus();
  });
}

let editAdstypeEle = document.querySelector("#editAdstypeModal");
if (editAdstypeEle) {
  editAdstypeEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#adstypeNameEdit").focus();
  });
}

let addReporttypeEle = document.querySelector("#addReporttypeModal");
if (addReporttypeEle) {
  addReporttypeEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#reporttypeName").focus();
  });
}

let editReporttypeEle = document.querySelector("#editReporttypeModal");
if (editReporttypeEle) {
  editReporttypeEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#reporttypeNameEdit").focus();
  });
}

let addAccountEle = document.querySelector("#addAccountModal");
if (addAccountEle) {
  addAccountEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#username").focus();
  });
}

document.querySelectorAll(".user-delete-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let id = e.target.dataset.id;
    const options = {
      title: "Xác nhận xoá",
      type: "danger",
      btnOkText: "Xoá",
      btnCancelText: "Thoát",
      onConfirm: () => {
        deleteUser(id);
      },
      onCancel: () => {
        // console.log("Cancel");
      },
    };
    const {el, content, options: confirmedOptions, } = bs5dialog.confirm("Bạn chắc chắn muốn xoá người dùng này?", options);
  });
});

document.querySelectorAll(".ward-delete-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let id = e.target.dataset.id;
    const options = {
      title: "Xác nhận xoá",
      type: "danger",
      btnOkText: "Xoá",
      btnCancelText: "Thoát",
      onConfirm: () => {
        // console.log("Confirm");
        // console.log(id);
        deleteWard(id);
      },
      onCancel: () => {
        // console.log("Cancel");
      },
    };
    const {
      el,
      content,
      options: confirmedOptions,
    } = bs5dialog.confirm("Bạn chắc chắn muốn xoá phường này?", options);
  });
});

document.querySelectorAll(".place-delete-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let id = e.target.dataset.id;
    let hinhAnhId=e.target.dataset.hinhAnhId;
    const options = {
      title: "Xác nhận xoá",
      type: "danger",
      btnOkText: "Xoá",
      btnCancelText: "Thoát",
      onConfirm: () => {
        // console.log("Confirm");
        // console.log(id);
        
        deletePlace(id,hinhAnhId);
      },
      onCancel: () => {
        // console.log("Cancel");
      },
    };
    const {
      el,
      content,
      options: confirmedOptions,
    } = bs5dialog.confirm("Bạn chắc chắn muốn xoá địa điểm này?", options);
  });
});

document.querySelectorAll(".ads-delete-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let id = e.target.dataset.id;
    const options = {
      title: "Xác nhận xoá",
      type: "danger",
      btnOkText: "Xoá",
      btnCancelText: "Thoát",
      onConfirm: () => {
        // console.log("Confirm");
        // console.log(id);
        deleteAds(id);
      },
      onCancel: () => {
        // console.log("Cancel");
      },
    };
    const {
      el,
      content,
      options: confirmedOptions,
    } = bs5dialog.confirm("Bạn chắc chắn muốn xoá bảng QC này?", options);
  });
});

document.querySelectorAll(".adstype-delete-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let id = e.target.dataset.id;
    const options = {
      title: "Xác nhận xoá",
      type: "danger",
      btnOkText: "Xoá",
      btnCancelText: "Thoát",
      onConfirm: () => {
        // console.log("Confirm");
        // console.log(id);
        deleteAdstype(id);
      },
      onCancel: () => {
        // console.log("Cancel");
      },
    };
    const {
      el,
      content,
      options: confirmedOptions,
    } = bs5dialog.confirm("Bạn chắc chắn muốn xoá loại hình QC này?", options);
  });
});

document.querySelectorAll(".reporttype-delete-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let id = e.target.dataset.id;
    const options = {
      title: "Xác nhận xoá",
      type: "danger",
      btnOkText: "Xoá",
      btnCancelText: "Thoát",
      onConfirm: () => {
        // console.log("Confirm");
        // console.log(id);
        deleteReporttype(id);
      },
      onCancel: () => {
        // console.log("Cancel");
      },
    };
    const {
      el,
      content,
      options: confirmedOptions,
    } = bs5dialog.confirm("Bạn chắc chắn muốn xoá hình thức báo cáo này?", options);
  });
});

document.querySelectorAll(".account-delete-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let id = e.target.dataset.id;
    const options = {
      title: "Xác nhận xoá",
      type: "danger",
      btnOkText: "Xoá",
      btnCancelText: "Thoát",
      onConfirm: () => {
        // console.log("Confirm");
        // console.log(id);
        deleteAccount(id);
      },
      onCancel: () => {
        // console.log("Cancel");
      },
    };
    const {
      el,
      content,
      options: confirmedOptions,
    } = bs5dialog.confirm("Bạn chắc chắn muốn xoá tài khoản?", options);
  });
});

function showEditWardModal(btn) {
  document.querySelector("#idWard").value = btn.dataset.id;
  document.querySelector("#wardNameEdit").value = btn.dataset.wardName;
  document.querySelector("#districtNameEdit").value = btn.dataset.districtName;
  document.querySelector("#zipCodeEdit").value = btn.dataset.zipCode;
  document.querySelector("#populationEdit").value = btn.dataset.population;
}

function showEditPlaceModal(btn) {
  console.log(btn.dataset);
  document.querySelector("#idPlace").value = btn.dataset.id;
  document.querySelector("#diaChiEdit").value = btn.dataset.diaChi;
  document.querySelector("#khuVucEdit").value = btn.dataset.khuVuc;
  document.querySelector("#loaiVTEdit").value = btn.dataset.loaiVt;
  document.querySelector("#hinhThucEdit").value = btn.dataset.hinhThuc;
  document.querySelector("#quyHoachEdit").checked = btn.dataset.quyHoach == "ĐÃ QUY HOẠCH" ? true : false;
  document.querySelector("#longitudeEdit").value = btn.dataset.longitude;
  document.querySelector("#latitudeEdit").value = btn.dataset.latitude;
  document.querySelector("#hinhAnhKhuVucEdit").src = btn.dataset.hinhAnh;
  document.querySelector("#imgPlaceIdEdit").value = btn.dataset.hinhAnhId;
}

function showEditAdsModal(btn) {
  document.querySelector("#idAds").value = btn.dataset.id;
  document.querySelector("#adNameEdit").value = btn.dataset.adName;
  document.querySelector("#diaChiAdsEdit").value = btn.dataset.diaChi;
  document.querySelector("#adSizeEdit").value = btn.dataset.adSize;
  document.querySelector("#adQuantityEdit").value = btn.dataset.adQuantity;
  document.querySelector("#expireDayEdit").value = btn.dataset.expireDay;
}

function showEditAdstypeModal(btn) {
  document.querySelector("#idAdstype").value = btn.dataset.id;
  document.querySelector("#adstypeNameEdit").value = btn.dataset.name;
}

function showEditReporttypeModal(btn) {
  document.querySelector("#idReporttype").value = btn.dataset.id;
  document.querySelector("#reporttypeNameEdit").value = btn.dataset.name;
}

function showRequestEditAdsModal(btn) {
  document.querySelector("#idAdsEditRequest").value = btn.dataset.id;
  document.querySelector("#placeIdAdsEditRequest").value = btn.dataset.placeId;
  document.querySelector("#originIdAdsEditRequest").value = btn.dataset.originId;
  document.querySelector("#adNameRequestEdit").value = btn.dataset.adName;
  document.querySelector("#diaChiAdsRequestEdit").value = btn.dataset.diaChi;
  document.querySelector("#khuVucAdsRequestEdit").value = btn.dataset.khuVuc;
  document.querySelector("#adSizeRequestEdit").value = btn.dataset.adSize;
  document.querySelector("#adQuantityRequestEdit").value = btn.dataset.adQuantity;
  document.querySelector("#expireDayRequestEdit").value = btn.dataset.expireDay;
  document.querySelector("#liDoRequestEditAds").value = btn.dataset.liDoChinhSua;
}

function showRequestEditPlaceModal(btn) {
  document.querySelector("#idPlaceEditRequest").value = btn.dataset.id;
  document.querySelector("#placeIdPlaceEditRequest").value = btn.dataset.placeId;
  document.querySelector("#diaChiRequestEdit").value = btn.dataset.diaChi;
  document.querySelector("#khuVucRequestEdit").value = btn.dataset.khuVuc;
  document.querySelector("#loaiVtRequestEdit").value = btn.dataset.loaiVt;
  document.querySelector("#hinhThucRequestEdit").value = btn.dataset.hinhThuc;
  document.querySelector("#quyHoachRequestEdit").checked = btn.dataset.quyHoach == "ĐÃ QUY HOẠCH" ? true : false;
  document.querySelector("#liDoRequestEditPlace").value = btn.dataset.liDoChinhSua;
}

function showRequestLicenseAdsModal(btn) {
  document.querySelector("#idAdsLicenseRequest").value = btn.dataset.id;
  document.querySelector("#placeIdAdsLicenseRequest").value = btn.dataset.placeId;
  document.querySelector("#congTy").value = btn.dataset.congTy;
  document.querySelector("#diaChiCongTy").value = btn.dataset.diaChiCongTy;
  document.querySelector("#dienThoaiCT").value = btn.dataset.dienThoai;
  document.querySelector("#emailCT").value = btn.dataset.email;
  document.querySelector("#diaChiQC").value = btn.dataset.diaChi;
  document.querySelector("#noiDungQC").value = btn.dataset.noiDung;
  document.querySelector("#tenBangQuangCao").value = btn.dataset.tenBangQuangCao;
  document.querySelector("#kichThuocQC").value = btn.dataset.kichThuoc;
  document.querySelector("#soLuongQC").value = btn.dataset.soLuong;
  document.querySelector("#ngayBatDau").value = btn.dataset.ngayBatDau;
  document.querySelector("#ngayKetThuc").value = btn.dataset.ngayKetThuc;
  document.querySelector("#licenseState").value = btn.dataset.tinhTrang;

  if (btn.dataset.hinhAnh) document.querySelector('#hinhAnhBQC img').src = hinhAnh;
  
  // if approved then disable button 
  if (btn.dataset.tinhTrang != "Chờ phê duyệt") {
    document.querySelectorAll(".btn-phe-duyet").forEach((button) => {
      button.disabled = true;
    })
  }
}

async function notAproveAds(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("requestLicenseAdsForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/yeu-cau/not-approve-ads', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  location.reload();
}

function showEditUserModal(btn) {
  document.querySelector("#id").value = btn.dataset.id;
  document.querySelector("#usernameEdit").value = btn.dataset.username;
  document.querySelector("#firstNameEdit").value = btn.dataset.firstName;
  document.querySelector("#lastNameEdit").value = btn.dataset.lastName;
  document.querySelector("#mobileEdit").value = btn.dataset.mobile;
  document.querySelector("#isAdminEdit").checked = btn.dataset.isAdmin == "true" ? true : false;
}

async function editWard(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("editWardForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/danh-sach/wards', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  location.reload();
}

async function editPlace(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("editPlaceForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/danh-sach/places', {
    method: "PUT",
    body:formData,
  });

  location.reload();
}

async function editAds(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("editAdsForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/danh-sach/ads', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  location.reload();
}

async function editAdstype(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("editAdstypeForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/danh-sach/adstype', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  location.reload();
}

async function editReporttype(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("editReporttypeForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/danh-sach/reporttype', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  location.reload();
}

async function editUser(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("editUserForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/users', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  location.reload();
}

async function deleteUser(id) {
  let res = await fetch(`/users/${id}`, {
    method: "DELETE",
  });

  location.reload();
}

async function deleteWard(id) {
  let res = await fetch(`/danh-sach/wards/${id}`, {
    method: "DELETE",
  });

  location.reload();
}

async function deletePlace(id,hinhAnhId) {
  let res = await fetch(`/danh-sach/places/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ hinhAnhId: hinhAnhId }),
  });

  location.reload();
}

async function deleteAds(id) {
  let res = await fetch(`/danh-sach/ads/${id}`, {
    method: "DELETE",
  });

  location.reload();
}

async function deleteAdstype(id) {
  let res = await fetch(`/danh-sach/adstype/${id}`, {
    method: "DELETE",
  });

  location.reload();
}

async function deleteReporttype(id) {
  let res = await fetch(`/danh-sach/reporttype/${id}`, {
    method: "DELETE",
  });

  location.reload();
}

async function deleteAccount(id) {
  let res = await fetch(`/tai-khoan/${id}`, {
    method: "DELETE",
  });

  location.reload();
}

function openCustomDown(elm) {
  if (elm.parentElement.querySelector('.customDown').style.display === "none")
      elm.parentElement.querySelector('.customDown').style.display = "block";
  else
      elm.parentElement.querySelector('.customDown').style.display = "none";
}

function openViewWardDetail(elm, wardName, districtName, zipCode, population, imagePath) {
  // let div = document.createElement('div');
  // div.classList.add('modal-backdrop', 'fade', 'show');
  // document.body.appendChild(div);

  // let ancElm = elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal');
  // ancElm.classList.add('show');
  // elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal.detail-ward').style.display = "block";
  let modal = document.querySelector("#viewWardDetailModal");

  modal.querySelector('.detail-card :nth-child(1) span').textContent = wardName + ", " + districtName;
  modal.querySelector('.detail-card :nth-child(3) .span-content').textContent = zipCode;
  modal.querySelector('.detail-card :nth-child(4) .span-content').textContent = population;

  if (imagePath) modal.querySelector('img').src = imagePath;
}

// function closeViewWardDetail(elm) {
//   elm.closest('.modal.detail-ward').classList.remove('show');
//   elm.closest('.modal.detail-ward').style.display = "none";
//   document.querySelector('.modal-backdrop.fade.show').remove();
// }

function openViewPlaceDetail(elm, diaChi, khuVuc, loaiVT, hinhThuc, quyHoach, hinhAnh) {
  // let div = document.createElement('div');
  // div.classList.add('modal-backdrop', 'fade', 'show');
  // document.body.appendChild(div);

  // let ancElm = elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal');
  // ancElm.classList.add('show');
  // elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal.detail-place').style.display = "block";
  let modal = document.querySelector("#viewPlaceDetailModal");

  modal.querySelector('.detail-card :nth-child(1) span').textContent = diaChi + ", " + khuVuc;
  modal.querySelector('.detail-card :nth-child(3) .span-content').textContent = loaiVT;
  modal.querySelector('.detail-card :nth-child(4) .span-content').textContent = hinhThuc;
  modal.querySelector('.detail-card :nth-child(5) span').textContent = quyHoach;

  if (hinhAnh) modal.querySelector('img').src = hinhAnh;
}

// function closeViewPlaceDetail(elm) {
//   elm.closest('.modal.detail-place').classList.remove('show');
//   elm.closest('.modal.detail-place').style.display = "none";
//   document.querySelector('.modal-backdrop.fade.show').remove();
// }

function openViewAdsDetail(elm, adName, diaChi, khuVuc, adSize, adQuantity, expireDay, imagePath) {
  // let div = document.createElement('div');
  // div.classList.add('modal-backdrop', 'fade', 'show');
  // document.body.appendChild(div);

  // let ancElm = elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal');
  // ancElm.classList.add('show');
  // elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal.detail-ads').style.display = "block";
  let modal = document.querySelector("#viewAdsDetailModal");

  modal.querySelector('.detail-card :nth-child(1) span').textContent = adName;
  modal.querySelector('.detail-card :nth-child(2) .span-content').textContent = diaChi + ", " + khuVuc;
  modal.querySelector('.detail-card :nth-child(3) .span-content').textContent = adSize;
  modal.querySelector('.detail-card :nth-child(4) .span-content').textContent = adQuantity;
  modal.querySelector('.detail-card :nth-child(5) .span-content').textContent = expireDay;

  if (imagePath) modal.querySelector('img').src = imagePath;
}

// function closeViewAdsDetail(elm) {
//   elm.closest('.modal.detail-ads').classList.remove('show');
//   elm.closest('.modal.detail-ads').style.display = "none";
//   document.querySelector('.modal-backdrop.fade.show').remove();
// }

// Disable ward input if user is District officer
function disableWardInput() {
  let chucVuEle = document.querySelector("#chucVu");
  let wardUnitEle = document.querySelector("#wardUnit");

  if (chucVuEle.value === "Cán bộ quận")
    wardUnitEle.disabled = true;
  else wardUnitEle.disabled = false;
}

// Check username existed 
function checkUsernameExisted(event) {
  event.preventDefault();

  let usernameElm = document.querySelector("#username");
  let username = usernameElm.value;

  fetch('/tai-khoan/checkUsernameWhenAddAccount?username=' + encodeURIComponent(username))
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        usernameElm.setCustomValidity('Tên đăng nhập đã tồn tại');
      } else {
        usernameElm.setCustomValidity('');
      }
    })
    .catch(error => console.error(error));
}

// Show origin place details if checked 
function showOriginPlaceDetail(elm, event) {
  event.preventDefault();

  if (elm.checked == true) { // show origin details
    let placeId = document.querySelector("#placeIdPlaceEditRequest").value;
    fetch('/yeu-cau/showOriginPlaceDetail?placeId=' + encodeURIComponent(placeId))
      .then(response => response.json())
      .then(data => {
        document.querySelector("#diaChiRequestEdit").value = data.originPlace[0].diaChi;
        document.querySelector("#khuVucRequestEdit").value = data.originPlace[0].khuVuc;
        document.querySelector("#loaiVtRequestEdit").value = data.originPlace[0].loaiVT;
        document.querySelector("#hinhThucRequestEdit").value = data.originPlace[0].hinhThuc;
        document.querySelector("#quyHoachRequestEdit").checked = data.originPlace[0].quyHoach == "ĐÃ QUY HOẠCH" ? true : false;
      })
      .catch(error => console.error(error));
  } else { // show requested details
    let id = document.querySelector("#idPlaceEditRequest").value;
    fetch('/yeu-cau/showOriginPlaceDetail?requestId=' + encodeURIComponent(id))
      .then(response => response.json())
      .then(data => {
        document.querySelector("#diaChiRequestEdit").value = data.requestPlace[0].diaChi;
        document.querySelector("#khuVucRequestEdit").value = data.requestPlace[0].khuVuc;
        document.querySelector("#loaiVtRequestEdit").value = data.requestPlace[0].loaiVT;
        document.querySelector("#hinhThucRequestEdit").value = data.requestPlace[0].hinhThuc;
        document.querySelector("#quyHoachRequestEdit").checked = data.requestPlace[0].quyHoach == "ĐÃ QUY HOẠCH" ? true : false;
      })
      .catch(error => console.error(error));
  }
}

// Show origin ads details if checked 
function showOriginAdsDetail(elm, event) {
  event.preventDefault();

  if (elm.checked == true) { // show origin details
    let placeId = document.querySelector("#originIdAdsEditRequest").value;
    fetch('/yeu-cau/showOriginAdsDetail?adsId=' + encodeURIComponent(placeId))
      .then(response => response.json())
      .then(data => {
        document.querySelector("#adNameRequestEdit").value = data.originAds[0].adName;
        document.querySelector("#diaChiAdsRequestEdit").value = data.originAds[0].diaChi;
        document.querySelector("#khuVucAdsRequestEdit").value = data.originAds[0].khuVuc;
        document.querySelector("#adSizeRequestEdit").value = data.originAds[0].adSize;
        document.querySelector("#adQuantityRequestEdit").value = data.originAds[0].adQuantity;
        document.querySelector("#expireDayRequestEdit").value = data.originAds[0].expireDay;
      })
      .catch(error => console.error(error));
  } else { // show requested details
    let id = document.querySelector("#idAdsEditRequest").value;
    fetch('/yeu-cau/showOriginAdsDetail?requestId=' + encodeURIComponent(id))
      .then(response => response.json())
      .then(data => {
        document.querySelector("#adNameRequestEdit").value = data.requestAds[0].adName;
        document.querySelector("#diaChiAdsRequestEdit").value = data.requestAds[0].diaChi;
        document.querySelector("#khuVucAdsRequestEdit").value = data.requestAds[0].khuVuc;
        document.querySelector("#adSizeRequestEdit").value = data.requestAds[0].adSize;
        document.querySelector("#adQuantityRequestEdit").value = data.requestAds[0].adQuantity;
        document.querySelector("#expireDayRequestEdit").value = data.requestAds[0].expireDay;
      })
      .catch(error => console.error(error));
  }
}

// Check valid date 
function checkValidDate(elm, event) {
  event.preventDefault();

  const inputDate = elm.value;
  const isValidDate = moment(inputDate, 'MM/DD/YYYY', true).isValid();

  if (!isValidDate) {
    elm.setCustomValidity('Ngày không hợp lệ');
  } else {
    elm.setCustomValidity('');
  }
}

async function requestEditAds(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("requestEditAdsForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/yeu-cau/request-edit-ads', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  location.reload();
}

async function requestEditPlace(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("requestEditPlaceForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/yeu-cau/request-edit-place', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  location.reload();
}

function fetchWardsByDistrict(district) {
  fetch('/tai-khoan/wardsByDistrict?district=' + district)
    .then(response => response.json())
    .then(data => {
      const wardUnit = document.getElementById('wardUnit');
      wardUnit.innerHTML = '';

      data.forEach(ward => {
        const option = document.createElement('option');
        option.value = ward.wardName;
        option.text = ward.wardName;
        wardUnit.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching wards:', error);
    });
}

function autoSelectWards() {
  const selectedDistrict = document.getElementById('districtUnit').value;
  fetchWardsByDistrict(selectedDistrict);
}

// Tính sẵn số lượng report trước và lưu vào mảng 
// gọi nhiều lần sẽ bị lỗi Too Many Requests
async function fetchAllReportsFromDatabase() {
  try {
    const response = await fetch('/thong-ke/all-reports');
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const apiKey = 'ynWfufabHmDYZyjIEMBK7fPyoxCd_l8vcgyiuu9PXYU';
let reportCountListLoc = {};
let reportCountListAds = {};
async function countReports() {
  try {
    const allReports = await fetchAllReportsFromDatabase();

    let isDup = {};
    let dupName = {};
    // let reportCountList = {};

    for (let report of allReports) {
      let key = `${report.lat}-${report.lng}`;
      if (!isDup[key]) {
        let { city, district } = await getCityAndDistrict(report.lat, report.lng);
        // console.log(district, city);
        let name = `${district}-${city}`;
        dupName[key] = name;

        if (report.adbannerreportid)
          reportCountListAds[name] = (reportCountListAds[name] || 0) + 1;
        else reportCountListLoc[name] = (reportCountListLoc[name] || 0) + 1;

        isDup[key] = 1;
      } else {
        if (report.adbannerreportid)
          reportCountListAds[dupName[key]]++;
        else reportCountListLoc[dupName[key]]++;
        
      }
    }

    // return reportCountList;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getCityAndDistrict(lat, lng) {
  let url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat}%2C${lng}&lang=vi-VN&apiKey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    const city = data.items[0].address.city;
    const district = data.items[0].address.district;

    // console.log(city, district);
    return { city, district };
  } catch (error) {
    console.error('Error getting city and district:', error);
    throw error;
  }
}

countReports();

async function getNumberReport(ward, district) {
  let countLoc = reportCountListLoc[`${ward}-${district}`];
  let countAds = reportCountListAds[`${ward}-${district}`];
  if (!countLoc) countLoc = 0;
  if (!countAds) countAds = 0;
  // console.log(count);
  return { countLoc, countAds };
  // let address = ward + ', ' + district;
  // try {
  //   const response = await fetch('/thong-ke/all-reports?address=' + address);
  //   const data = await response.json();
  //   return data.length;
  // } catch (error) {
  //   console.error('Error fetching reports:', error);
  //   throw error;
  // }
}

async function displayHandleMethod(district) {
  let allReports = await fetchAllReportsFromDatabase();
  filteredReports = allReports.filter(report => {
    // console.log(report.id);
    let addressParts = report.reportlocation.split(',');
    let reportDistrict = addressParts[addressParts.length - 1].trim();
    return reportDistrict == district;
  });
  // console.log(filteredReports);

  let tbody = document.querySelector('#reportsTable tbody');
  tbody.innerHTML = '';

  filteredReports.forEach(report => {
    let row = document.createElement('tr');
    row.innerHTML = `
      <td style="cursor: pointer; max-width: 160px; overflow: hidden; text-overflow: ellipsis;">
        <div class="d-flex px-2">
          <div>
            <img src="${report.imagepath1 ? report.imagepath1 : '/assets/img/ads/ads.jpeg'}" class="avatar avatar-sm me-3 border-radius-lg" alt="spotify">
          </div>
          <div class="my-auto">
            <h6 class="mb-0 text-sm">${report.typeofreport}</h6>
          </div>
        </div>
      </td>
      <td style="overflow: hidden; text-overflow: ellipsis;">
        <span class="text-xs text-secondary font-weight-bold mb-0">${report.reportcontent}</span>
      </td>
      <td>
        <span class="text-sm text-secondary font-weight-bold">${report.handlemethod ? report.handlemethod : 'Chưa xử lý'}</span>
      </td>
    `;

    tbody.appendChild(row);
  });
}

statisticByDistrict(null);

function statisticByDistrict(elm) {
  let district = elm ? elm.textContent : "Quận 1";
  let wards = [];
  let locTotal = [];
  let adsTotal = [];

  displayHandleMethod(district);

  fetch('/tai-khoan/wardsByDistrict?district=' + district)
    .then(response => response.json())
    .then(data => {
      // let wardList = document.getElementById('wardList');
      // wardList.innerHTML = '';
      
      let promiseNum = [];
      data.forEach(ward => {
        // const button = document.createElement('button');
        // button.textContent = ward.wardName;
        // console.log(ward.wardName);
        // button.classList.add("dropdown-item");
        // wardList.appendChild(button);
        wards.push(ward.wardName);
        promiseNum.push(getNumberReport(ward.wardName, district));
      });

      Promise.all(promiseNum)
        .then(results => {
          results.forEach((result, index) => {
            let { countLoc, countAds } = result;
            // console.log(countLoc, countAds);
            locTotal.push(countLoc);
            adsTotal.push(countAds);
          });

          barChart(wards, district, locTotal, adsTotal);
        })
        .catch(error => {
          console.error('Error getting count:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching wards:', error);
    });

}

let canvas = document.querySelector("#reportChart");
let ctx = canvas.getContext('2d');
let myChart = null;

function barChart(wards, district, locTotal, adsTotal) {
  // Chart number of reports 
  if (myChart) {
    myChart.destroy();
  }
  // console.log(wards, total)
  let data = {
    labels: wards,
    datasets: [
      {
        label: 'Báo cáo địa điểm',
        data: locTotal,
        backgroundColor: '#4BC0C0',
      },
      {
        label: 'Báo cáo bảng quảng cáo', 
        data: adsTotal,
        backgroundColor: '#FF6484',
      }
    ]
  }

  let options = {
    type: 'bar',
    data: data,
    options: {
      plugins: {
          title: {
              display: true,
              text: `Số lượng báo cáo của ${district}`,
              font: {
                family: 'Playfair Display, sans-serif',
                // style: 'italic',
                size: 22
              },
              padding: {
                  top: 10,
                  bottom: 20
              }
          },
          legend:{
            display:true,
            // position:'right',
          },
      }
    },
  }

  myChart = new Chart(ctx, options);
}

