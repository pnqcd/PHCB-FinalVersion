
document.querySelectorAll(".delete-request-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let id = e.target.dataset.id;
    let hinhAnhId=e.target.dataset.hinhAnhId;
    console.log(hinhAnhId);
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
  });
});

document.querySelectorAll(".email-report-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let tenNguoiBaoCao=e.target.dataset.reportername;
    let hinhThucBaoCao = e.target.dataset.typeofreport;
    let phone = e.target.dataset.reporterphonenumber;
    let email = e.target.dataset.reporteremail;
    let cachThucXuLy = e.target.dataset.handlemethod;
    let noiDungBaoCao = e.target.dataset.reportcontent;
    let diaDiem=e.target.dataset.reportlocation;
    console.log(email);

    const options = {
      title: `Gửi email`,
      type: "info",
      btnOkText: "Gửi",
      btnCancelText: "Thoát",
      onConfirm: () => {
        console.log("Confirm");
        sendEmailReport(email,tenNguoiBaoCao,hinhThucBaoCao,phone,cachThucXuLy,noiDungBaoCao,diaDiem);
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

document.querySelectorAll(".email-request-btn").forEach((btnConfirm) => {
  btnConfirm.addEventListener("click", (e) => {
    let email=e.target.dataset.email;
    let tinhTrang = e.target.dataset.tinhTrang;
    let diaChi = e.target.dataset.diaChi;
    let khuVuc = e.target.dataset.khuVuc;
    let tenBangQuangCao = e.target.dataset.tenBangQuangCao;
    let noiDungQC = e.target.dataset.noiDungQC;
    let kichThuoc=e.target.dataset.kichThuoc;
    let soLuong = e.target.dataset.soLuong;
    let ngayBatDau = e.target.dataset.ngayBatDau;
    let ngayKetThuc = e.target.dataset.ngayKetThuc;
    console.log(email);

    const options = {
      title: `Gửi email`,
      type: "info",
      btnOkText: "Gửi",
      btnCancelText: "Thoát",
      onConfirm: () => {
        console.log("Confirm");
        sendEmail(email,tinhTrang,diaChi,khuVuc,tenBangQuangCao,noiDungQC,soLuong,kichThuoc,ngayBatDau,ngayKetThuc);
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


async function deleteRequest(id,hinhAnhId) {
  let res = await fetch(`/PHCB-Phuong/requests/request/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ hinhAnhId: hinhAnhId }),
  });
  location.reload();
}



let editPlaceEle = document.querySelector("#editPlaceModal");

if (editPlaceEle) {
  editPlaceEle.addEventListener("shown.bs.modal", () => {
    initializeEditForm();
    document.querySelector("#diaChiEdit").focus();
  });
}

function openViewAdsDetail(elm, adName, diaChi, khuVuc, adSize, adQuantity, expireDay, imagePath) {
  let div = document.createElement('div');
  div.classList.add('modal-backdrop', 'fade', 'show');
  document.body.appendChild(div);

  let ancElm = elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal');
  ancElm.classList.add('show');
  elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal.detail-ads').style.display = "block";

  ancElm.querySelector('.detail-card :nth-child(1) span').textContent = adName;
  ancElm.querySelector('.detail-card :nth-child(2) .span-content').textContent = diaChi + ", " + khuVuc;
  ancElm.querySelector('.detail-card :nth-child(3) .span-content').textContent = adSize;
  ancElm.querySelector('.detail-card :nth-child(4) .span-content').textContent = adQuantity;
  ancElm.querySelector('.detail-card :nth-child(5) .span-content').textContent = expireDay;

  if (imagePath) ancElm.querySelector('img').src = imagePath;
}

function showEditPlaceModal(btn) {
  document.querySelector("#idPlace").value = btn.dataset.id;
  document.querySelector("#diaChiEdit").value = btn.dataset.diaChi;
  document.querySelector("#khuVucEdit").value = btn.dataset.khuVuc;
  document.querySelector("#loaiVTEdit").value = btn.dataset.loaiVt;
  document.querySelector("#hinhThucEdit").value = btn.dataset.hinhThuc;
  document.querySelector("#quyHoachEdit").checked = btn.dataset.quyHoach == "ĐÃ QUY HOẠCH" ? true : false;
  document.querySelector("#PlaceImageEdit").src=btn.dataset.imagePath;
}

function showEditRequestModal(btn) {
  document.querySelector("#idRequest").value = btn.dataset.id;
  document.querySelector("#congTYEditRequest").value = btn.dataset.congTy;
  document.querySelector("#diaChiCongTyEditRequest").value = btn.dataset.diaChiCongTy;
  document.querySelector("#dienThoaiEditRequest").value = btn.dataset.dienThoai;
  document.querySelector("#emailEditRequest").value = btn.dataset.email;
  document.querySelector("#diaChiEditRequest").value = btn.dataset.diaChi;
  
  document.querySelector("#tenBangQuangCaoEditRequest").value = btn.dataset.tenBangQuangCao;
  document.querySelector("#noiDungQCEditRequest").value = btn.dataset.noiDungQC;
  document.querySelector("#kichThuocEditRequest").value = btn.dataset.kichThuoc;
  document.querySelector("#soLuongEditRequest").value = btn.dataset.soLuong;
  document.querySelector("#ngayBatDauEditRequest").value = btn.dataset.ngayBatDau;
  document.querySelector("#ngayKetThucEditRequest").value = btn.dataset.ngayKetThuc;
  document.querySelector('#editRequestImg').src=btn.dataset.hinhAnh;
  document.querySelector('#hinhAnhIdRequest').value=btn.dataset.hinhAnhId;
  
}

function showEditAdsModal(btn) {
  document.querySelector("#idAds").value = btn.dataset.id;
  document.querySelector("#adNameEdit").value = btn.dataset.adName;
  document.querySelector("#diaChiAdsEdit").value = btn.dataset.diaChi;
  document.querySelector("#adSizeEdit").value = btn.dataset.adSize;
  document.querySelector("#adQuantityEdit").value = btn.dataset.adQuantity;
  document.querySelector("#expireDayEdit").value = btn.dataset.expireDay;
  document.querySelector("#AdsImageEdit").src=btn.dataset.imagePath;
}

async function editRequest(e) {
  
  e.preventDefault();

  const formData = new FormData(document.getElementById("editRequestForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch(`/PHCB-Phuong/requests/editRequest`, {
    method: "PUT",
    body:formData,
  });
  

  location.reload();
}




function openCustomDown(elm) {
  if (elm.parentElement.querySelector('.customDown').style.display === "none")
      elm.parentElement.querySelector('.customDown').style.display = "block";
  else
      elm.parentElement.querySelector('.customDown').style.display = "none";
}


function openViewPlaceDetail(elm, diaChi, khuVuc, loaiVT, hinhThuc, quyHoach, hinhAnh) {
  let div = document.createElement('div');
  div.classList.add('modal-backdrop', 'fade', 'show');
  document.body.appendChild(div);

  let ancElm = elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal');
  ancElm.classList.add('show');
  elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal.detail-place').style.display = "block";

  ancElm.querySelector('.detail-card :nth-child(1)').textContent = diaChi + ", " + khuVuc;
  ancElm.querySelector('.detail-card :nth-child(3) .span-content').textContent = loaiVT;
  ancElm.querySelector('.detail-card :nth-child(4) .span-content').textContent = hinhThuc;
  ancElm.querySelector('.detail-card :nth-child(5) .span-content').textContent = quyHoach;

  if (hinhAnh) ancElm.querySelector('img').src = hinhAnh;

}



function openViewRequestDetail(elm,congTy,
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
  tinhTrang,hinhAnh) {
  let div = document.createElement('div');
  div.classList.add('modal-backdrop', 'fade', 'show');
  document.body.appendChild(div);

  let ancElm = elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal');
  ancElm.classList.add('show');
  elm.parentElement.parentElement.parentElement.parentElement.querySelector('.modal.detail-request').style.display = "block";
  ancElm.querySelector('.tinhTrangRequest').textContent=tinhTrang;
  // if (tinhTrang="Chờ phê duyệt") {
  //   ancElm.querySelector('.tinhTrangRequest').classList.add('text-warning');
  // } if (tinhTrang="Đã phê duyệt") {
  //   ancElm.querySelector('.tinhTrangRequest').classList.add('text-success');
  // } else if (tinhTrang="Không phê duyệt") {
  //   ancElm.querySelector('.tinhTrangRequest').classList.add('text-danger');
  // }
  ancElm.querySelector('.detail-card-part-1 :nth-child(1) .span-content').textContent=congTy;
  ancElm.querySelector('.detail-card-part-1 :nth-child(2) .span-content').textContent=diaChiCongTy;
  ancElm.querySelector('.detail-card-part-1 :nth-child(3) .span-content').textContent=dienThoai;
  ancElm.querySelector('.detail-card-part-1 :nth-child(4) .span-content').textContent=email;

  ancElm.querySelector('.detail-card-part-2 :nth-child(1) .span-content').textContent=diaChi;
  ancElm.querySelector('.detail-card-part-2 :nth-child(2) .span-content').textContent=khuVuc;
  ancElm.querySelector('.detail-card-part-2 :nth-child(3) .span-content').textContent=loaiVT;
  ancElm.querySelector('.detail-card-part-2 :nth-child(4) .span-content').textContent="("+longitude+" , "+latitude+")";

  ancElm.querySelector('.detail-card-part-3 :nth-child(1) .span-content').textContent=noiDungQC;
  ancElm.querySelector('.detail-card-part-3 :nth-child(2) .span-content').textContent=tenBangQuangCao;
  ancElm.querySelector('.detail-card-part-3 :nth-child(3) .span-content').textContent=kichThuoc;
  ancElm.querySelector('.detail-card-part-3 :nth-child(4) .span-content').textContent=soLuong;
  ancElm.querySelector('.detail-card-part-3 :nth-child(5) .span-content').textContent=ngayBatDau;
  ancElm.querySelector('.detail-card-part-3 :nth-child(6) .span-content').textContent=ngayKetThuc;

  ancElm.querySelector('#hinhAnhRequest').src=hinhAnh;

}
function closeViewRequestDetail(elm) {
  elm.closest('.modal.detail-request').classList.remove('show');
  elm.closest('.modal.detail-request').style.display = "none";
  document.querySelector('.modal-backdrop.fade.show').remove();
}

function closeViewDetail(elm) {
  elm.closest('.modal.detail-ward').classList.remove('show');
  elm.closest('.modal.detail-ward').style.display = "none";
  document.querySelector('.modal-backdrop.fade.show').remove();
}

function closeViewDetailPlace(elm) {
  elm.closest('.modal.detail-place').classList.remove('show');
  elm.closest('.modal.detail-place').style.display = "none";
  document.querySelector('.modal-backdrop.fade.show').remove();
}

function closeViewAdsDetail(elm) {
  elm.closest('.modal.detail-ads').classList.remove('show');
  elm.closest('.modal.detail-ads').style.display = "none";
  document.querySelector('.modal-backdrop.fade.show').remove();
}


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

      // Convert the formatted date to a JavaScript Date object for comparison
      const dateA = new Date(aValue);
      const dateB = new Date(bValue);

      // Check if the conversion is successful
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          // If conversion fails, fall back to localeCompare
          return aValue.localeCompare(bValue);
      }

      // Compare dates
      return dateA - dateB;
  });

  rows.forEach(row => {
      table.appendChild(row);
  });
}

function sendEmail(email,tinhTrang,diaChi,khuVuc,tenBangQuangCao,noiDungQC,soLuong,kichThuoc,ngayBatDau,ngayKetThuc){
  (function(){
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
  .then( res => {
      alert("Email sent successfully!!")
  })
  .catch();
}

function showHandleMethod(btn) {
  document.querySelector("#idReport").value = btn.dataset.id;
  document.querySelector("#reportername").textContent = btn.dataset.reportername;
  document.querySelector("#reporterphonenumber").textContent = btn.dataset.reporterphonenumber;
  document.querySelector("#reporteremail").textContent = btn.dataset.reporteremail;
  document.querySelector("#typeofreport").textContent = btn.dataset.typeofreport;
  document.querySelector("#reportcontent").innerHTML  = '<span style="font-size:14px; font-wieght:bold; color:#344767;font-family: Roboto, Helvetica, Arial, sans-serif;">' + btn.dataset.reportcontent + '</>';
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

async function editReport(e) {
  console.log("ok");
  e.preventDefault();

  const formData = new FormData(document.getElementById("handleMethodForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/reports/handle-report', {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  location.reload();
}



function sendEmailReport(email,tenNguoiBaoCao,hinhThucBaoCao,phone,cachThucXuLy,noiDungBaoCao,diaDiem){
  (function(){
    emailjs.init("Hqyh0rZzbl332P-vy"); // Account Public Key
  })();

  var params = {
    sendername: 'Trung tâm quản lý bảng quảng cáo',
    to: email,
    subject: 'KẾT QUẢ BÁO CÁO',
    replyto: 'ptudw.group.4@gmail.com',
    tenNguoiBaoCao:tenNguoiBaoCao,
    hinhThucBaoCao:hinhThucBaoCao,
    phone:phone,
    cachThucXuLy:cachThucXuLy,
    noiDungBaoCao:noiDungBaoCao,
    diaDiem:diaDiem,
    email:email,

  };


  var serviceID = "service_zx9km1o"; // Email Service ID
  var templateID = "template_yyokl68"; // Email Template ID

  emailjs.send(serviceID, templateID, params)
  .then( res => {
      alert("Email sent successfully!!")
  })
  .catch();
}


