let map_loaded = false;
var map;

let mapedit_loaded = false;
var mapedit;
function loadMap() {
  if (map) {
    map.dispose();
  }
  var platform = new H.service.Platform({
    apikey: "ynWfufabHmDYZyjIEMBK7fPyoxCd_l8vcgyiuu9PXYU"
  });
  
  var defaultLayers = platform.createDefaultLayers(
      {
          lg: 'vi'
      }
  );
  map = new H.Map(document.getElementById('chooseAddressOnMap'),
      defaultLayers.vector.normal.map, {
      center: { lat: 10.76316473604989, lng: 106.68238541539267 },
      zoom: 14.5,
      pixelRatio: window.devicePixelRatio || 1
  });
  if (map) {
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener('resize', () => map.getViewPort().resize());
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);
    map.addEventListener('tap', function (evt) {
        let { lat, lng } = map.screenToGeo(
            evt.currentPointer.viewportX,
            evt.currentPointer.viewportY,
        );
        let lngField = document.getElementById('longitude');
        let latField = document.getElementById('latitude');

        lngField.value = lng;
        latField.value = lat;

        const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat}%2C${lng}&lang=vi-VN&apiKey=ylfzo_XrCL0wFOWqMdk89chLwml3by9ZPi5U6J-S3EU`;
        fetch(url)
          .then(function (response) {
              return response.json();
          })
          .then(function (data) {
              if (data.items && data.items.length > 0) {
                  var address = data.items[0].address;
                  let dcField = document.getElementById('diaChiEdit');
                  let kvField = document.getElementById('khuVucEdit');

                  var addressParts = address.label.split(',');
                  dcField.value = addressParts[0].trim();
                  kvField.value = address.district + ", " + address.city;

              } else {
                  alert('Không tìm thấy địa chỉ cho tọa độ này.');
              }
          })
          .catch(function (error) {
              console.error(error);
          });
    });
  }
}

let addPlaceEle = document.querySelector("#addPlaceModal")
if (addPlaceEle) {
  addPlaceEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#diaChiEdit").focus();
    if (!map_loaded) {
      loadMap();
      map_loaded = true;
    }
  });
}

let editPlaceEle = document.querySelector("#editPlaceModal");

if (editPlaceEle) {
  editPlaceEle.addEventListener("shown.bs.modal", () => {
    document.querySelector("#diaChiEdit").focus();
    if (!mapedit_loaded) {
      loadMapEdit();
      mapedit_loaded = true;
    }
  });
}

let editAdsEle = document.querySelector("#editAdsModal");
if (editAdsEle) {
  editAdsEle.addEventListener("shown.bs.modal", () => {
    initializeEditForm_ads();
    document.querySelector("#adNameEdit").focus();
  });
}


function loadMapEdit() {
  if (mapedit) {
    mapedit.dispose();
  }

  var platform = new H.service.Platform({
    apikey: "ynWfufabHmDYZyjIEMBK7fPyoxCd_l8vcgyiuu9PXYU"
  });
  
  var defaultLayers = platform.createDefaultLayers(
      {
          lg: 'vi'
      }
  );

  mapedit = new H.Map(document.getElementById('editAddressOnMap'),
      defaultLayers.vector.normal.map, {
      center: { lat: 10.76316473604989, lng: 106.68238541539267 },
      zoom: 14.5,
      pixelRatio: window.devicePixelRatio || 1
  });

  if (mapedit) {
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener('resize', () => mapedit.getViewPort().resize());

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapedit));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(mapedit, defaultLayers);

    mapedit.addEventListener('tap', function (evt) {
        let { lat, lng } = mapedit.screenToGeo(
            evt.currentPointer.viewportX,
            evt.currentPointer.viewportY,
        );
        let lngEditField = document.getElementById('longitudeEditContinue');
        let latEditField = document.getElementById('latitudeEditContinue');

        lngEditField.value = lng;
        latEditField.value = lat;

        const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat}%2C${lng}&lang=vi-VN&apiKey=ylfzo_XrCL0wFOWqMdk89chLwml3by9ZPi5U6J-S3EU`;
        fetch(url)
          .then(function (response) {
              return response.json();
          })
          .then(function (data) {
              if (data.items && data.items.length > 0) {
                  var address = data.items[0].address;

                  let dcEditField = document.getElementById('diaChiEditContinue');
                  let kvEditField = document.getElementById('khuVucEditContinue');

                  var addressParts = address.label.split(',');

                  if (dcEditField) dcEditField.value = addressParts[0].trim();
                  if (kvEditField) kvEditField.value = address.district + ", " + address.city;
                  
              } else {
                  alert('Không tìm thấy địa chỉ cho tọa độ này.');
              }
          })
          .catch(function (error) {
              console.error(error);
          });
    });
  }
}

const loadImg = function (event, Elmid) {
  var Placeimg = document.querySelector(Elmid);
  Placeimg.src = URL.createObjectURL(event.target.files[0]);
  console.log(event.target.files[0]);
};




// ----------------send email for requesting ads status
document.querySelectorAll(".email-request-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let email = e.target.dataset.email;
    let tinhTrang = e.target.dataset.tinhTrang;
    let diaChi = e.target.dataset.diaChi;
    let khuVuc = e.target.dataset.khuVuc;
    let tenBangQuangCao = e.target.dataset.tenBangQuangCao;
    let noiDungQC = e.target.dataset.noiDungQC;
    let kichThuoc = e.target.dataset.kichThuoc;
    let soLuong = e.target.dataset.soLuong;
    let ngayBatDau = e.target.dataset.ngayBatDau;
    let ngayKetThuc = e.target.dataset.ngayKetThuc;

    console.log(noiDungQC);

    const options = {
      title: `Gửi email`,
      type: "info",
      btnOkText: "Gửi",
      btnCancelText: "Thoát",
      onConfirm: () => {
        console.log("Confirm");
        sendEmail(email, tinhTrang, diaChi, khuVuc, tenBangQuangCao, noiDungQC, soLuong, kichThuoc, ngayBatDau, ngayKetThuc);
      },
      onCancel: () => {
        console.log("Cancel");
      },
    };
    const {
      el,
      content,
      options: confirmedOptions,
    } = bs5dialog.confirm(`Bạn có muốn gửi kết quả đến email: ${email} `, options);
  });
});

function sendEmail(email, tinhTrang, diaChi, khuVuc, tenBangQuangCao, noiDungQC, soLuong, kichThuoc, ngayBatDau, ngayKetThuc) {
  (function () {
    emailjs.init("Hqyh0rZzbl332P-vy"); // Account Public Key
  })();

  var params = {
    tinhTrang: tinhTrang,
    sendername: 'Trung tâm quản lý bảng quảng cáo',
    to: email,
    subject: 'KẾT QUẢ CẤP PHÉP QUẢNG CÁO CHO CÔNG TY',
    replyto: 'ptudw.group.4@gmail.com',
    diaChi: diaChi,
    khuVuc: khuVuc,
    tenBangQuangCao: tenBangQuangCao,
    noiDungQC: noiDungQC,
    kichThuoc: kichThuoc,
    soLuong: soLuong,
    ngayBatDau: ngayBatDau,
    ngayKetThuc: ngayKetThuc,
  };

  var serviceID = "service_zx9km1o"; // Email Service ID
  var templateID = "template_uevq8pa"; // Email Template ID

  emailjs.send(serviceID, templateID, params)
    .then(res => {
      alert("Email sent successfully!!")
    })
    .catch();
}

// ----------------send email for reporting status
document.querySelectorAll(".email-report-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let tenNguoiBaoCao = e.target.dataset.reportername;
    let hinhThucBaoCao = e.target.dataset.typeofreport;
    let phone = e.target.dataset.reporterphonenumber;
    let email = e.target.dataset.reporteremail;
    let cachThucXuLy = e.target.dataset.handlemethod;
    let noiDungBaoCao = e.target.dataset.reportcontent;
    let diaDiem = e.target.dataset.reportlocation;
    console.log(email);

    const options = {
      title: `Gửi email`,
      type: "info",
      btnOkText: "Gửi",
      btnCancelText: "Thoát",
      onConfirm: () => {
        console.log("Confirm");
        sendEmailReport(email, tenNguoiBaoCao, hinhThucBaoCao, phone, cachThucXuLy, noiDungBaoCao, diaDiem);
      },
      onCancel: () => {
        console.log("Cancel");
      },
    };
    const {
      el,
      content,
      options: confirmedOptions,
    } = bs5dialog.confirm(`Bạn có muốn gửi kết quả đến email: ${email} `, options);
  });
});


function sendEmailReport(email, tenNguoiBaoCao, hinhThucBaoCao, phone, cachThucXuLy, noiDungBaoCao, diaDiem) {
  (function () {
    emailjs.init("Hqyh0rZzbl332P-vy"); // Account Public Key
  })();

  var params = {
    sendername: 'Trung tâm quản lý bảng quảng cáo',
    to: email,
    subject: 'KẾT QUẢ BÁO CÁO',
    replyto: 'ptudw.group.4@gmail.com',
    tenNguoiBaoCao: tenNguoiBaoCao,
    hinhThucBaoCao: hinhThucBaoCao,
    phone: phone,
    cachThucXuLy: cachThucXuLy,
    noiDungBaoCao: noiDungBaoCao,
    diaDiem: diaDiem,
    email: email
  };

  var serviceID = "service_zx9km1o"; // Email Service ID
  var templateID = "template_yyokl68"; // Email Template ID

  emailjs.send(serviceID, templateID, params)
    .then(res => {
      alert("Email sent successfully!!")
    })
    .catch();
}



// ---------------------disable nút gửi yêu cầu chỉnh sửa place
function initializeEditForm() {
  let saveBtn = document.querySelector("#addPlaceForm button[type='submit']");
  saveBtn.disabled = true;

  // Lưu giá trị hiện tại của các ô input
  let currentValues = {
    diaChi: document.querySelector("#diaChiEdit").value,
    khuVuc: document.querySelector("#khuVucEdit").value,
    loaiVT: document.querySelector("#loaiVTEdit").value,
    hinhThuc: document.querySelector("#hinhThucEdit").value,
    quyHoach: document.querySelector("#quyHoachEdit").checked,
  };

  // Sự kiện input cho các ô input
  document.querySelectorAll("#addPlaceForm input").forEach((input) => {
    input.addEventListener("input", () => {
      checkFormChanges(currentValues);
    });
  });
}

// Hàm kiểm tra sự thay đổi và cập nhật trạng thái của nút "Lưu"
function checkFormChanges(currentValues) {
  let saveBtn = document.querySelector("#addPlaceForm button[type='submit']");
  let isFormChanged = false;

  // So sánh giá trị hiện tại với giá trị ban đầu
  if (currentValues.diaChi !== document.querySelector("#diaChiEdit").value ||
    currentValues.khuVuc !== document.querySelector("#khuVucEdit").value ||
    currentValues.loaiVT !== document.querySelector("#loaiVTEdit").value ||
    currentValues.hinhThuc !== document.querySelector("#hinhThucEdit").value ||
    currentValues.quyHoach !== document.querySelector("#quyHoachEdit").checked) {
    isFormChanged = true;
  }

  // Cập nhật trạng thái của nút "Lưu"
  saveBtn.disabled = !isFormChanged;
}

document.querySelectorAll(".delete-request-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    if (e.target.dataset.tinhTrang == "Chờ phê duyệt" || e.target.dataset.tinhTrang == "Không phê duyệt") {
      let id = e.target.dataset.id;
      let hinhAnhId = e.target.dataset.hinhAnhId;
      // console.log(hinhAnhId);
      const options = {
        title: "Bạn có chắc chắn xoá yêu cầu này?",
        type: "danger",
        btnOkText: "Xoá",
        btnCancelText: "Thoát",
        onConfirm: () => {
          console.log("Confirm");
          console.log(id);
          deleteRequest(id,hinhAnhId);
        },
        onCancel: () => {
          console.log("Cancel");
        },
      };
      const {
        el,
        content,
        options: confirmedOptions,
      } = bs5dialog.confirm("Bạn có chắc chắn xoá yêu cầu này?", options);
    } else {
      // let id = e.target.dataset.id;
      const options = {
        title: "Bạn không thể xóa yêu cầu quảng cáo đã được phê duyệt",
        type: "warning",
        btnCancelText: "Thoát",
        btnOkText: "Ok",
        // onCancel: () => {
        //   console.log("Cancel");
        // },
      };
      const {
      } = bs5dialog.confirm("", options);
    }
  });
});


async function deleteRequest(id, hinhAnhId) {
  let res = await fetch(`/PHCB-Quan/yeu-cau/deleterequest/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ hinhAnhId: hinhAnhId }),
  });
  location.reload();
}

// ---------------------disable gửi yêu cầu button
// function initializeEditForm_ads() {
//   let saveBtn = document.querySelector("#editAdsForm button[type='submit']");
//   saveBtn.disabled = true;

//   let currentValues = {
//     diaChi: document.querySelector("#adNameEdit").value,
//     khuVuc: document.querySelector("#adSizeEdit").value,
//     loaiVT: document.querySelector("#diaChiAdsEdit").value,
//     hinhThuc: document.querySelector("#adQuantityEdit").value,
//     quyHoach: document.querySelector("#expireDayEdit").value,
//   };

//   document.querySelectorAll("#editAdsForm input").forEach((input) => {
//     input.addEventListener("input", () => {
//       checkFormChanges_ads(currentValues);
//     });
//   });
// }

// function checkFormChanges_ads(currentValues) {
//   let saveBtn = document.querySelector("#editAdsForm button[type='submit']");
//   let isFormChanged = false;

//   if (currentValues.diaChi !== document.querySelector("#adNameEdit").value ||
//     currentValues.khuVuc !== document.querySelector("#adSizeEdit").value ||
//     currentValues.loaiVT !== document.querySelector("#diaChiAdsEdit").value ||
//     currentValues.hinhThuc !== document.querySelector("#adQuantityEdit").value ||
//     currentValues.quyHoach !== document.querySelector("#expireDayEdit").value) {
//     isFormChanged = true;
//   }

//   saveBtn.disabled = !isFormChanged;
// }


function showEditRequestModal(btn) {

  let modal = document.querySelector("#editRequestModal");

  modal.querySelector("#idRequest").value = btn.dataset.id;
  modal.querySelector("#congTYEditRequest").value = btn.dataset.congTy;
  modal.querySelector("#diaChiCongTyEditRequest").value = btn.dataset.diaChiCongTy;
  modal.querySelector("#dienThoaiEditRequest").value = btn.dataset.dienThoai;
  modal.querySelector("#emailEditRequest").value = btn.dataset.email;
  modal.querySelector("#diaChiEditRequest").value = btn.dataset.diaChi;
  modal.querySelector("#noiDungQCEditRequest").value = btn.dataset.noiDungQC;
  modal.querySelector("#tenBangQuangCaoEditRequest").value = btn.dataset.tenBangQuangCao;
  modal.querySelector("#kichThuocEditRequest").value = btn.dataset.kichThuoc;
  modal.querySelector("#soLuongEditRequest").value = btn.dataset.soLuong;
  modal.querySelector("#ngayBatDauEditRequest").value = btn.dataset.ngayBatDau;
  modal.querySelector("#ngayKetThucEditRequest").value = btn.dataset.ngayKetThuc;
  modal.querySelector("#editRequestImg").src = btn.dataset.hinhAnh;
  modal.querySelector('#hinhAnhIdRequest').value = btn.dataset.hinhAnhId;
  // modal.querySelector('#changeOrNot').value = isImageChanged();
  // console.log(isImageChanged());
  // if(isImageChanged)

  var chinhsuaBT = modal.querySelector("#chinhsuabutton");

  if (tinhTrang === "Đã phê duyệt" || tinhTrang === "Không phê duyệt") {
    chinhsuaBT.disabled = true;
  } else {
    chinhsuaBT.disabled = false;
  }

}
// -------------------show value of edit modal
function showEditPlaceModal(btn) {
  document.querySelector("#idPlace").value = btn.dataset.id;
  document.querySelector("#diaChiEdit").value = btn.dataset.diaChi;
  document.querySelector("#khuVucEdit").value = btn.dataset.khuVuc;
  document.querySelector("#loaiVTEdit").value = btn.dataset.loaiVt;
  document.querySelector("#hinhThucEdit").value = btn.dataset.hinhThuc;
  document.querySelector("#longitude").value = btn.dataset.longitude;
  document.querySelector("#latitude").value = btn.dataset.latitude;
  document.querySelector("#quyHoachEdit").checked = btn.dataset.quyHoach == "ĐÃ QUY HOẠCH" ? true : false;
  document.querySelector("#imageEditPlace").src = btn.dataset.hinhAnh;
  document.querySelector("#hinhAnhA").value = btn.dataset.hinhAnh;
  document.querySelector("#hinhAnhB").value = btn.dataset.hinhAnhId;

  document.querySelector("#liDoChinhSua").value = '';

  // initializeEditForm();
}

function openViewPlaceDetail(btn) {
  // let div = document.createElement('div');
  // div.classList.add('modal-backdrop', 'fade', 'show');
  // document.body.appendChild(div);

  // let ancElm = elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal');
  // ancElm.classList.add('show');
  // elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal.detail-place').style.display = "block";

  // if (hinhAnh) ancElm.querySelector('img').src = hinhAnh;
  document.querySelector("#idPlaceDT").textContent = btn.dataset.id;
  document.querySelector("#diaChiVaKhuVucDT").textContent = btn.dataset.diaChi + ", " + btn.dataset.khuVuc;
  document.querySelector("#loaiVTDT").textContent = btn.dataset.loaiVt;
  document.querySelector("#hinhThucDT").textContent = btn.dataset.hinhThuc;
  document.querySelector("#tinhTrangDT").textContent = btn.dataset.quyHoach;
  document.querySelector("#hinhAnhPlace").src = btn.dataset.hinhAnh;
}

function showHandleMethod(btn) {
  document.querySelector("#idReport").value = btn.dataset.id;
  document.querySelector("#reportername").textContent = btn.dataset.reportername;
  document.querySelector("#reporterphonenumber").textContent = btn.dataset.reporterphonenumber;
  document.querySelector("#reporteremail").textContent = btn.dataset.reporteremail;
  document.querySelector("#typeofreport").textContent = btn.dataset.typeofreport;
  document.querySelector("#reportcontent").innerHTML = '<span style="font-size:14px; font-wieght:bold; color:#344767;font-family: Roboto, Helvetica, Arial, sans-serif;">' + btn.dataset.reportcontent + '</>';
  document.querySelector("#handlemethod").value = btn.dataset.handlemethod;
  document.querySelector('#imagepath1').src = btn.dataset.imagepath1;
  document.querySelector('#imagepath2').src = btn.dataset.imagepath2;
  document.querySelector('.reportlocation').textContent = btn.dataset.reportlocation;
  var reportcontentInput = document.querySelector("#handlemethod");
  var xulybutton = document.querySelector("#xuly");

  if (btn.dataset.handlemethod.trim() === '') {
    reportcontentInput.removeAttribute('disabled');
  } else {
    reportcontentInput.setAttribute('disabled', 'disabled');
  }

  if (btn.dataset.handlemethod) {
    document.querySelector('.status :nth-child(1) .span-content').textContent = "Đã xử lý";
    document.querySelector('.status :nth-child(1) .span-content').style.color = "green";
    xulybutton.setAttribute('disabled', 'disabled');
  }
  else {
    document.querySelector('.status :nth-child(1) .span-content').textContent = "Đang xử lý";
    document.querySelector('.status :nth-child(1) .span-content').style.color = "red";
    xulybutton.removeAttribute('disabled');
  }
  // if ((btn.dataset.imagepath1 == "uploads/NULL" &&  btn.dataset.imagepath2 == "uploads/NULL")) {
  //   document.querySelector('#hinhAnhSlide').style.display = "none";
  // }
  console.log(btn.dataset.imagepath1);
  console.log(btn.dataset.imagepath2);

}

function showContinueEditPlaceModal(btn) {
  document.querySelector("#idPlaceRequest").value = btn.dataset.id;
  document.querySelector("#diaChiEditContinue").value = btn.dataset.diaChi;
  document.querySelector("#khuVucEditContinue").value = btn.dataset.khuVuc;
  document.querySelector("#loaiVTEditContinue").value = btn.dataset.loaiVt;
  document.querySelector("#hinhThucEditContinue").value = btn.dataset.hinhThuc;
  document.querySelector("#longitudeEditContinue").value = btn.dataset.longitude;
  document.querySelector("#latitudeEditContinue").value = btn.dataset.latitude;
  document.querySelector("#quyHoachEditContinue").checked = btn.dataset.quyHoach == "ĐÃ QUY HOẠCH" ? true : false;
  document.querySelector("#imageEditPlaceContinue").src = btn.dataset.hinhAnh;
  document.querySelector("#hinhAnhBC").value = btn.dataset.hinhAnhId;
  document.querySelector("#liDoChinhSuaContinue").value = '';
  // initializeEditForm();
}

function showEditAdsModal(btn) {
  document.querySelector("#idAds").value = btn.dataset.id;
  document.querySelector("#adNameEdit").value = btn.dataset.adName;
  document.querySelector("#diaChiAdsEdit").value = btn.dataset.diaChi;
  document.querySelector("#adSizeEdit").value = btn.dataset.adSize;
  document.querySelector("#adQuantityEdit").value = btn.dataset.adQuantity;
  document.querySelector("#expireDayEdit").value = btn.dataset.expireDay;
  document.querySelector("#imageEditAds").src = btn.dataset.imagePath;
  document.querySelector("#imagePathA").value = btn.dataset.imagePath;
  document.querySelector("#publicImageIdB").value = btn.dataset.publicImageId;
  document.querySelector("#liDoChinhSua").value = '';
}

function showContinueEditAdsModal(btn) {
  document.querySelector("#idAdsRequest").value = btn.dataset.id;
  document.querySelector("#adNameEditContinue").value = btn.dataset.adName;
  document.querySelector("#diaChiAdsEditContinue").value = btn.dataset.diaChi;
  document.querySelector("#adSizeEditContinue").value = btn.dataset.adSize;
  document.querySelector("#adQuantityEditContinue").value = btn.dataset.adQuantity;
  document.querySelector("#expireDayEditContinue").value = btn.dataset.expireDay;
  document.querySelector("#imageEditcontinue").src = btn.dataset.imagePath;
  document.querySelector('#publicImageIdEditAds').value = btn.dataset.publicImageId;
  document.querySelector("#liDoChinhSuaContinue").value = '';

}

// -------------------------onsubmit() edit

async function editRequest(e) {
  
  e.preventDefault();

  const formData = new FormData(document.getElementById("editRequestForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch(`/PHCB-Quan/yeu-cau/editrequest`, {
    method: "PUT",
    body:formData,
  });
  

  location.reload();
}

async function editPlace(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("editPlaceForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/PHCB-Quan/diem-dat-bang-quang-cao/editplacerequest', {
    method: "PUT",
    body:formData,
  });

  location.reload();
}

async function editReport(e) {
  console.log("ok");
  e.preventDefault();

  const formData = new FormData(document.getElementById("handleMethodForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/PHCB-Quan/bao-cao/handle-report', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  location.reload();
}

async function editAds(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("editAdsFormRequest"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/PHCB-Quan/bang-quang-cao/editadsrequest', {
    method: "PUT",
    body:formData,
  });

  location.reload();
}

async function settingAccount(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("formAccountSettings"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/PHCB-Quan/profile', {
    method: "PUT",
    body:formData,
  });
  location.reload();
}

function checkUsernameExisted(event) {
  event.preventDefault();

  let usernameElm = document.querySelector("#username");
  let username = usernameElm.value;

  fetch('/PHCB-So/tai-khoan/checkUsernameWhenAddAccount?username=' + encodeURIComponent(username))
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

async function changePassword(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("formChangePassword"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/PHCB-Quan/change-password', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  location.reload();
}

function checkCurrentPassword(event) {
  event.preventDefault();

  let passwordElm = document.querySelector("#oldPassword");
  let password = passwordElm.value;

  let idElm = document.querySelector("#idUser");
  let id = idElm.value;

  fetch(`/PHCB-So/change-password/checkCurrentPassword?id=${id}&password=${password}`)
    .then(response => response.json())
    .then(data => {
      if (!data.exists) {
        passwordElm.setCustomValidity('Mật khẩu hiện tại không đúng');
      } else {
        passwordElm.setCustomValidity('');
      }
    })
    .catch(error => console.error(error));
}

function checkPasswordMatch(event) {

  event.preventDefault();

  let password = document.querySelector("#newPassword");
  let confirmPassword = document.querySelector("#confirmPassword");

  if (confirmPassword.value != password.value) {
    confirmPassword.setCustomValidity('Mật khẩu không khớp!');
    confirmPassword.reportValidity();

  } else {
    confirmPassword.setCustomValidity('');
  }
}
// ---------------------open view modal, and close modal
function openCustomDown(elm) {
  if (elm.parentElement.querySelector('.customDown').style.display === "none")
    elm.parentElement.querySelector('.customDown').style.display = "block";
  else
    elm.parentElement.querySelector('.customDown').style.display = "none";
}

function openViewDetail(elm, wardName, districtName, zipCode, population) {
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
}



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

function openViewAdsDetailEdit(elm, adName, diaChi, khuVuc, adSize, adQuantity, expireDay, imagePath) {
  // let div = document.createElement('div');
  // div.classList.add('modal-backdrop', 'fade', 'show');
  // document.body.appendChild(div);

  // let ancElm = elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal');
  // ancElm.classList.add('show');
  // elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal.detail-ads').style.display = "block";
  let modal = document.querySelector("#viewAdsDetailModalEdit");

  modal.querySelector('.detail-card :nth-child(1) span').textContent = adName;
  modal.querySelector('.detail-card :nth-child(2) .span-content').textContent = diaChi + ", " + khuVuc;
  modal.querySelector('.detail-card :nth-child(3) .span-content').textContent = adSize;
  modal.querySelector('.detail-card :nth-child(4) .span-content').textContent = adQuantity;
  modal.querySelector('.detail-card :nth-child(5) .span-content').textContent = expireDay;
  modal.querySelector('.card-img').src = imagePath;

}

function openViewRequestDetail(elm, congTy,
  diaChiCongTy,
  dienThoai,
  email,
  diaChi,
  khuVuc,
  loaiVT,
  longitude,
  latitude,
  tenBangQuangCao,
  noiDungQC,
  kichThuoc,
  soLuong,
  ngayBatDau,
  ngayKetThuc,
  tinhTrang,
  hinhAnh) {
  // let div = document.createElement('div');
  // div.classList.add('modal-backdrop', 'fade', 'show');
  // document.body.appendChild(div);

  // let ancElm = elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal');
  // ancElm.classList.add('show');
  // elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal.detail-request').style.display = "block";
  let modal = document.querySelector("#viewRequestAdsDetailModal");

  modal.querySelector('#tinhTrang').textContent = tinhTrang;
  if (tinhTrang = "Chờ phê duyệt") {
    modal.querySelector('#tinhTrang').classList.add('text-warning');
  }
  else if (tinhTrang = "Đã phê duyệt") {
    modal.querySelector('#tinhTrang').classList.add('text-success');
  }
  else if (tinhTrang = "Không phê duyệt") {
    modal.querySelector('#tinhTrang').classList.add('text-danger');
  }
  modal.querySelector('.detail-card-part-1 :nth-child(1) .span-content').textContent = congTy;
  modal.querySelector('.detail-card-part-1 :nth-child(2) .span-content').textContent = diaChiCongTy;
  modal.querySelector('.detail-card-part-1 :nth-child(3) .span-content').textContent = dienThoai;
  modal.querySelector('.detail-card-part-1 :nth-child(4) .span-content').textContent = email;

  modal.querySelector('.detail-card-part-2 :nth-child(1) .span-content').textContent = diaChi;
  modal.querySelector('.detail-card-part-2 :nth-child(2) .span-content').textContent = khuVuc;
  modal.querySelector('.detail-card-part-2 :nth-child(3) .span-content').textContent = loaiVT;
  modal.querySelector('.detail-card-part-2 :nth-child(4) .span-content').textContent = "(" + longitude + " , " + latitude + ")";

  modal.querySelector('.detail-card-part-3 :nth-child(1) .span-content').textContent = noiDungQC;
  modal.querySelector('.detail-card-part-3 :nth-child(2) .span-content').textContent = tenBangQuangCao;
  modal.querySelector('.detail-card-part-3 :nth-child(3) .span-content').textContent = kichThuoc;
  modal.querySelector('.detail-card-part-3 :nth-child(4) .span-content').textContent = soLuong;
  modal.querySelector('.detail-card-part-3 :nth-child(5) .span-content').textContent = ngayBatDau;
  modal.querySelector('.detail-card-part-3 :nth-child(6) .span-content').textContent = ngayKetThuc;
  modal.querySelector('#hinhAnhRequest').src = hinhAnh;
}


// ---------------------filter
document.getElementById('phuongDropdown').addEventListener('change', function () {
  var selectedOptions = Array.from(this.selectedOptions).map(option => option.value);
  // Check if "All Phường" is selected
  if (selectedOptions.includes('all')) {
    // Show all rows
    document.querySelectorAll('#filteredContent tbody tr').forEach(function (row) {
      row.style.display = '';
    });
  } else {
    // Hide all rows
    document.querySelectorAll('#filteredContent tbody tr').forEach(function (row) {
      row.style.display = 'none';
    });
    // Show rows for selected Phường values
    selectedOptions.forEach(function (phuong) {
      var rowsToShow = document.querySelectorAll('#filteredContent tbody tr[data-phuong="' + phuong + '"]');
      rowsToShow.forEach(function (row) {
        row.style.display = '';
      });
    });
  }
});


// Function to show all rows in the table
function showAllRows() {
  document.querySelectorAll('#filteredContent tbody tr').forEach(function (row) {
    row.style.display = '';
  });
}

// Function to hide all rows in the table
function hideAllRows() {
  document.querySelectorAll('#filteredContent tbody tr').forEach(function (row) {
    row.style.display = 'none';
  });
}

// Function to show rows based on selected Phường values
function showRowsForSelectedPhuong(selectedOptions) {
  selectedOptions.forEach(function (phuong) {
    var rowsToShow = document.querySelectorAll('#filteredContent tbody tr[data-phuong="' + phuong + '"]');
    rowsToShow.forEach(function (row) {
      row.style.display = '';
    });
  });
}

// Event listener setup
document.getElementById('phuongDropdown').addEventListener('change', function () {
  var selectedOptions = Array.from(this.selectedOptions).map(option => option.value);

  // Check if "All Phường" is selected
  if (selectedOptions.includes('all')) {
    showAllRows();
  } else {
    hideAllRows();
    showRowsForSelectedPhuong(selectedOptions);
  }
});


// ---------------------check valid date in ads edit
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



// -----------------------------sort
function sortTable(column, tableId) {
  console.log('Sorting by column:', column);

  const table = document.querySelector(`#${tableId} tbody`);
  const rows = Array.from(table.getElementsByTagName('tr'));

  rows.sort((a, b) => {
    const aValue = a.getAttribute(`data-${column}`);
    const bValue = b.getAttribute(`data-${column}`);

    if (aValue === null || bValue === null) {
      return 0;
    }

    const dateA = new Date(aValue);
    const dateB = new Date(bValue);

    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      return aValue.localeCompare(bValue);
    }
    return dateA - dateB;
  });

  rows.forEach(row => {
    table.appendChild(row);
  });
}

// --------------------------search
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();
    const tableRows = document.querySelectorAll("#filteredContent tbody tr");

    tableRows.forEach((row) => {
      const rowText = row.textContent.toLowerCase();
      if (rowText.includes(searchText)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
});



document.querySelector('.toast-btn').addEventListener('click', function (event) {
  if (document.querySelector('#lockIcon').style.display === 'inline') {
    event.preventDefault(); // Ngăn chặn sự kiện click khi biểu tượng khóa hiển thị
  }
});



