let map_loaded = false;
var map_added;

let mapedit_loaded = false;
var mapedit;

// choose edit place the first time from map
function loadMap() {
  if (map_added) {
    map_added.dispose();
  }
  var platform = new H.service.Platform({
    apikey: "ynWfufabHmDYZyjIEMBK7fPyoxCd_l8vcgyiuu9PXYU"
  });

  var defaultLayers = platform.createDefaultLayers(
    {
      lg: 'vi'
    }
  );
  map_added = new H.Map(document.getElementById('chooseAddressOnMap'),
    defaultLayers.vector.normal.map, {
    center: { lat: 10.76316473604989, lng: 106.68238541539267 },
    zoom: 14.5,
    pixelRatio: window.devicePixelRatio || 1
  });
  if (map_added) {
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener('resize', () => map_added.getViewPort().resize());
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map_added));
    // Create the default UI components
    var ui = H.ui.UI.createDefault(map_added, defaultLayers);
    map_added.addEventListener('tap', function (evt) {
      let { lat, lng } = map_added.screenToGeo(
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

// choose edit place continue from map
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

// xem map trên bản đồ 

tinymce.init({
  selector: 'textarea#message',
  plugins: 'lists link image table code help wordcount'
});

tinymce.init({
  selector: 'textarea#messageReport',
  plugins: 'lists link image table code help wordcount',
});

var InfoBubble;
const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasExample'));
const dataAdDetailsInnerHTML = document.getElementById('rightSidePanelBody');

var groupReportMarker;
var report;
var airports;
var defaultTheme;
var latX, lngY;
var isLocationReport = false;
var currentLocation = -1;
var currentReportMarkerData;
var adBannerID = null;
var placeDetails = []
var placeDetailsTmp = []

var myModalShowReportDetail = new bootstrap.Modal(document.getElementById('exampleModalShowReport'), {
  keyboard: false
})

function onReportDetailDialogClicked(reportername, reporteremail, reporterphonenumber, typeofreport, reportcontent, imagepath1, imagepath2) {
  myModalShowReportDetail.show();
  document.getElementById("firstnameReport").value = reportername
  document.getElementById("emailReport").value = reporteremail
  document.getElementById("phoneReport").value = reporterphonenumber
  document.getElementById("lastnameReport").value = typeofreport
  tinymce.get("messageReport").setContent(reportcontent)

  document.getElementById("imgReportDetail1").src = imagepath1
  document.getElementById("imgReportDetail2").src = imagepath2
}

function showReportBottomDialogFromAdBannerDetail(index) {
  data = placeDetailsTmp[index].reports

  let locationReportDetail = "";
  document.getElementById("indicator-carousel-report" + index).innerHTML = ""
  document.getElementById("inner-carousel-report" + index).innerHTML = ""

  for (let i = 0; i < data.length; i++) {
      if (i == 0) {
          document.getElementById("indicator-carousel-report" + index).innerHTML += `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" class="active" aria-current="true" aria-label="Slide ${i + 1}"></button>`

          document.getElementById("inner-carousel-report" + index).innerHTML +=

              (data[i].handlemethod != "" && data[i].handlemethod) ?

                  `<div class="carousel-item active">
              <div class="report-detail-information" onclick="onReportDetailDialogClicked('${data[i].reportername}', '${data[i].reporteremail}', '${data[i].reporterphonenumber}', '${data[i].typeofreport}', '${data[i].reportcontent}', '${data[i].imagepath1}', '${data[i].imagepath2}')">
                  <p><b>Số thứ tự:</b> ${data[i].reportid}</p>
                  <p><b>Phân loại:</b> ${data[i].typeofreport}</p>
                  <p><b>Trạng thái xử lý:</b>${data[i].handlemethod}</p>
              </div>
          </div>`

                  :

                  `<div class="carousel-item active">
              <div class="report-detail-information" style="background-color: rgba(254, 182, 0, 0.75);" onclick="onReportDetailDialogClicked('${data[i].reportername}', '${data[i].reporteremail}', '${data[i].reporterphonenumber}', '${data[i].typeofreport}', '${data[i].reportcontent}', '${data[i].imagepath1}', '${data[i].imagepath2}')">
                  <p><b>Số thứ tự:</b> ${data[i].reportid}</p>
                  <p><b>Phân loại:</b> ${data[i].typeofreport}</p>
                  <p><b>Trạng thái xử lý: </b>CHƯA XỬ LÝ</p>
              </div>
          </div>`
      }
      else {
          document.getElementById("indicator-carousel-report" + index).innerHTML += `<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" aria-label="Slide ${i + 1}"></button>`

          document.getElementById("inner-carousel-report" + index).innerHTML +=
              (data[i].handlemethod != "" && data[i].handlemethod) ?

                  `<div class="carousel-item">
              <div class="report-detail-information" onclick="onReportDetailDialogClicked('${data[i].reportername}', '${data[i].reporteremail}', '${data[i].reporterphonenumber}', '${data[i].typeofreport}', '${data[i].reportcontent}', '${data[i].imagepath1}', '${data[i].imagepath2}')">
                  <p><b>Số thứ tự:</b> ${data[i].reportid}</p>
                  <p><b>Phân loại:</b> ${data[i].typeofreport}</p>
                  <p><b>Trạng thái xử lý: </b>${data[i].handlemethod}</p>
              </div>
          </div>`

                  :

                  `<div class="carousel-item">
              <div class="report-detail-information" style="background-color: rgba(254, 182, 0, 0.75);" onclick="onReportDetailDialogClicked('${data[i].reportername}', '${data[i].reporteremail}', '${data[i].reporterphonenumber}', '${data[i].typeofreport}', '${data[i].reportcontent}', '${data[i].imagepath1}', '${data[i].imagepath2}')">
                  <p><b>Số thứ tự:</b> ${data[i].reportid}</p>
                  <p><b>Phân loại:</b> ${data[i].typeofreport}</p>
                  <p><b>Trạng thái xử lý: </b>CHƯA XỬ LÝ</p>
              </div>
          </div>`
      }
  }
}

function detailAdButtonClicked(placeID) {
  offcanvas.show()

  var popupInformationInnerHTML = "";
  currentLocation = placeID
  dataAdDetailsInnerHTML.innerHTML = "";

  fetch('/PHCB-Quan/homepage/get-ad-details/' + placeID)
    .then(response => response.json())
    .then(data => {
      var placeDetails = data.placeDetails;

      // console.log(placeDetails)

      const groupAdDetail = {}
      placeDetails.forEach(pds => {
          const key = `${pds.adbannerid}`

          if (!groupAdDetail[key])
              groupAdDetail[key] = {
                  id: pds.id,
                  diaChi: pds.diaChi,
                  khuVuc: pds.khuVuc,
                  loaiVT: pds.loaiVT,
                  hinhThuc: pds.hinhThuc,
                  hinhAnh: pds.hinhAnh,
                  quyHoach: pds.quyHoach,
                  latitude: pds.latitude,
                  longitude: pds.longitude,
                  placeId: pds.placeId,
                  adName: pds.adName,
                  adSize: pds.adSize,
                  adQuantity: pds.adQuantity,
                  expireDay: pds.expireDay,
                  imagePath: pds.imagePath,
                  adBannerId: pds.adbannerid,
                  reports: []
              }

          groupAdDetail[key].reports.push({
              reportid: pds.reportid,
              lat: pds.lat,
              lng: pds.lng,
              reportername: pds.reportername,
              typeofreport: pds.typeofreport,
              reporteremail: pds.reporteremail,
              reporterphonenumber: pds.reporterphonenumber,
              reportcontent: pds.reportcontent,
              imagepath1: pds.imagepath1,
              imagepath2: pds.imagepath2,
              locationreport: pds.locationreport,
              adbannerreportid: pds.adbannerreportid,
              handlemethod: pds.handlemethod
          });
      })

      placeDetails = Object.values(groupAdDetail)
      placeDetailsTmp = placeDetails

      // console.log("Place details...")
      // console.log(placeDetails)

      for (let i = 0; i < placeDetails.length; i++) {
          var jsDate = new Date(placeDetails[i].expireDay);
          var options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
          var formattedDate = jsDate.toLocaleDateString('vi-VN', options);
          console.log(placeDetails[i].reports)

          popupInformationInnerHTML += !placeDetails[i].reports[0].reportid ?
              `<div class="place-detail-information">
                  <b>${placeDetails[i].adName}</b>
                  <p>${placeDetails[i].diaChi} - ${placeDetails[i].khuVuc}</p>
                  <p>Kích thước: ${placeDetails[i].adSize}</p>
                  <p>Số lượng: <b>${placeDetails[i].adQuantity}</b></p>
                  <p>Hình thức: <b>${placeDetails[i].hinhThuc}</b></p>
                  <p>Phân loại: <b>${placeDetails[i].loaiVT}</b></p>
                  <div class="placeDetailsButtonContainer">
                      <a class="placeDetailsButton" href="${placeDetails[i].imagePath}" data-lightbox="detail-pano-${placeDetails[i].id}" data-title="Ngày hết hạn: ${formattedDate}">
                          <img src="./assets/img/icon_info.png" width="25px" height="25px">
                      </a>
                  
                      <div class="d-grid gap-2" onclick="onReportAdBannerClicked(${placeDetails[i].latitude}, ${placeDetails[i].longitude}, false, ${placeDetails[i].adBannerId})">
                          <button type="button" class="btn btn-danger">Báo cáo vi phạm</button>
                      </div>

                      </div>
                  </div>
              </div>` :
              `<div class="place-detail-information">
                  <b>${placeDetails[i].adName}</b>
                  <p>${placeDetails[i].diaChi} - ${placeDetails[i].khuVuc}</p>
                  <p>Kích thước: ${placeDetails[i].adSize}</p>
                  <p>Số lượng: <b>${placeDetails[i].adQuantity}</b></p>
                  <p>Hình thức: <b>${placeDetails[i].hinhThuc}</b></p>
                  <p>Phân loại: <b>${placeDetails[i].loaiVT}</b></p>
                  <div class="placeDetailsButtonContainer">
                      <div>
                          <a class="placeDetailsButton" href="${placeDetails[i].imagePath}" data-lightbox="detail-pano-${placeDetails[i].id}" data-title="Ngày hết hạn: ${formattedDate}">
                              <img src="./assets/img/icon_info.png" width="25px" height="25px">
                          </a>
                          
                          <img src="./assets/img/clipboard.svg" width="25px" height="25px" onclick="showReportBottomDialogFromAdBannerDetail(${i})" data-bs-toggle="collapse" href="#collapseReports${i}" role="button" aria-expanded="false" aria-controls="collapseExample">
                      </div>
                  </div>

              <div class="collapse" id="collapseReports${i}" style="margin-top: 5px;" >
                  <div class="card card-body">
                      <div id="carouselExampleIndicators${i}" class="carousel slide" data-bs-ride="carousel" data-bs-touch="true">
                          <div class="carousel-indicators" id="indicator-carousel-report${i}">                                       
                          </div>
                          <div class="carousel-inner" id="inner-carousel-report${i}">
                          </div>
                          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators${i}" data-bs-slide="prev">
                              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                              <span class="visually-hidden">Previous</span>
                          </button>
                          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators${i}" data-bs-slide="next">
                              <span class="carousel-control-next-icon" aria-hidden="true"></span>
                              <span class="visually-hidden">Next</span>
                          </button>
                      </div>
                  </div>
              </div>
          </div>`;
      }

      if (popupInformationInnerHTML == "")
          dataAdDetailsInnerHTML.innerHTML = `<p>Chưa có bảng quảng cáo nào!</p>`;
      else
          dataAdDetailsInnerHTML.innerHTML = popupInformationInnerHTML;
      // console.log(dataAdDetailsInnerHTML.innerHTML);
    })
    .catch(error => {
      console.error('Error fetching wards:', error);
    });
}

function loadNewMap() {
  var platform = new H.service.Platform({
    apikey: "ynWfufabHmDYZyjIEMBK7fPyoxCd_l8vcgyiuu9PXYU"
  });
  
  var defaultLayers = platform.createDefaultLayers(
      {
          lg: 'vi'
      }
  );

  var map = new H.Map(document.getElementById('listMapContainer'),
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
  }

  var CUSTOM_THEME = {
    getClusterPresentation: function (cluster) {
        //Keep the default theme for clusters
        var clusterMarker = defaultTheme.getClusterPresentation.call(defaultTheme, cluster);
        return clusterMarker;
    },
    getNoisePresentation: function (noisePoint) {
        var data = noisePoint.getData()

        var iconColor = 'blue';
        if (data.quyHoach === "CHƯA QUY HOẠCH")
            iconColor = 'red';

        var strokeColor = 'orange'
        if (data.adnumber == 0)
            strokeColor = 'white';

        const iconUrl = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
        <circle cx="15" cy="15" r="14" fill="${iconColor}" stroke="${strokeColor}" stroke-width="3"/>
        <text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="13" font-family="Arial">QC</text>
      </svg>`

        // Get a reference to data object our noise points
        // Create a marker for the noisePoint
        var noiseMarker = new H.map.Marker(noisePoint.getPosition(), {
            // Use min zoom from a noise point
            // to show it correctly at certain zoom levels:
            min: noisePoint.getMinZoom(),
            icon: new H.map.Icon(iconUrl, {
                size: { w: 20, h: 20 },
                anchor: { x: 10, y: 10 }
            })
        });

        // Link a data from the point to the marker
        // to make it accessible inside onMarkerClick
        noiseMarker.setData(
            `<div class="place-info">
                <b>${data.hinhThuc}</b>
                <p>${data.loaiVT}</p>
                <p>${data.diaChi}, ${data.khuVuc}</p>
                <b><i>${data.quyHoach}</i></b>
                <img class="img-place" src="${data.hinhAnh}" style="width: 220px; margin-top: 10px;">
                <div class="d-grid gap-2">
                    <button type="button" class="btn btn-primary" style="margin-top: 10px;" onclick="detailAdButtonClicked('${data.id}')">Chi tiết</button>
                </div>
            </div>`
        );

        noiseMarker.addEventListener('tap', function (evt) {
            InfoBubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
                // read custom data
                content: evt.target.getData()
            });
            // show info bubble
            ui.addBubble(InfoBubble);
        }, false);

        return noiseMarker;
    }
  };

  function addMarkerToGroup(group, coordinate, html, quyhoach) {
    var iconColor = 'blue';
    if (quyhoach === "CHƯA QUY HOẠCH")
        iconColor = 'red';

    const iconUrl = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="${iconColor}" stroke="white" stroke-width="1"/> 
    <path d="M6.75 14.0322C6.32031 14.0322 5.96224 13.9391 5.67578 13.7529C5.38932 13.5667 5.15658 13.3197 4.97754 13.0117C4.80566 12.7038 4.67318 12.3672 4.58008 12.002C4.49414 11.6296 4.43685 11.2536 4.4082 10.874C4.37956 10.4945 4.36523 10.1436 4.36523 9.82129C4.36523 9.49902 4.37956 9.14811 4.4082 8.76855C4.43685 8.389 4.49414 8.0166 4.58008 7.65137C4.67318 7.27897 4.80566 6.9388 4.97754 6.63086C5.15658 6.32292 5.38932 6.07585 5.67578 5.88965C5.96224 5.70345 6.32031 5.61035 6.75 5.61035C7.17969 5.61035 7.53776 5.70345 7.82422 5.88965C8.11784 6.07585 8.35059 6.32292 8.52246 6.63086C8.69434 6.9388 8.82324 7.28255 8.90918 7.66211C9.00228 8.03451 9.06315 8.41048 9.0918 8.79004C9.12044 9.1696 9.13477 9.52051 9.13477 9.84277C9.13477 10.3011 9.10612 10.7773 9.04883 11.2715C8.99154 11.7585 8.86979 12.2132 8.68359 12.6357L9.28516 13.3555L8.78027 14.0322L8.25391 13.377C8.06055 13.599 7.83496 13.7637 7.57715 13.8711C7.31934 13.9785 7.04362 14.0322 6.75 14.0322ZM6.75 13.1191C7.13672 13.1191 7.44108 12.9616 7.66309 12.6465L6.50293 11.1963L6.98633 10.584L7.99609 11.7979C8.06055 11.4827 8.10352 11.1641 8.125 10.8418C8.14648 10.5124 8.15723 10.1865 8.15723 9.86426C8.15723 9.68522 8.15007 9.45605 8.13574 9.17676C8.12858 8.89746 8.09993 8.60742 8.0498 8.30664C8.00684 7.9987 7.93522 7.70866 7.83496 7.43652C7.7347 7.16439 7.59505 6.94596 7.41602 6.78125C7.24414 6.60938 7.02214 6.52344 6.75 6.52344C6.47786 6.52344 6.25228 6.60579 6.07324 6.77051C5.90137 6.93522 5.7653 7.15007 5.66504 7.41504C5.56478 7.68001 5.48958 7.96289 5.43945 8.26367C5.39648 8.56445 5.36784 8.85449 5.35352 9.13379C5.34635 9.40592 5.34277 9.63509 5.34277 9.82129C5.34277 10.0003 5.34635 10.2295 5.35352 10.5088C5.36784 10.7881 5.39648 11.0781 5.43945 11.3789C5.48958 11.6797 5.56478 11.9626 5.66504 12.2275C5.7653 12.4925 5.90137 12.7074 6.07324 12.8721C6.25228 13.0368 6.47786 13.1191 6.75 13.1191ZM12.4326 14.0322C11.9814 14.0322 11.6019 13.9463 11.2939 13.7744C10.9932 13.5954 10.7461 13.3626 10.5527 13.0762C10.3665 12.7826 10.2233 12.4531 10.123 12.0879C10.0228 11.7227 9.95475 11.3503 9.91895 10.9707C9.88314 10.584 9.86523 10.2152 9.86523 9.86426C9.86523 9.52767 9.88314 9.16602 9.91895 8.7793C9.96191 8.39258 10.0335 8.01302 10.1338 7.64062C10.2412 7.26823 10.3916 6.92806 10.585 6.62012C10.7783 6.31217 11.0218 6.0651 11.3154 5.87891C11.6162 5.69271 11.985 5.59961 12.4219 5.59961C12.9017 5.59961 13.2848 5.71061 13.5713 5.93262C13.8577 6.15462 14.0726 6.44824 14.2158 6.81348C14.359 7.17155 14.4521 7.56185 14.4951 7.98438H13.4746C13.4531 7.77669 13.4066 7.55827 13.335 7.3291C13.2705 7.09993 13.1667 6.90658 13.0234 6.74902C12.8802 6.59147 12.6761 6.5127 12.4111 6.5127C12.1104 6.5127 11.8633 6.59863 11.6699 6.77051C11.4766 6.93522 11.3226 7.15365 11.208 7.42578C11.1006 7.69076 11.0182 7.97721 10.9609 8.28516C10.9108 8.5931 10.8786 8.89388 10.8643 9.1875C10.8499 9.47396 10.8428 9.72103 10.8428 9.92871C10.8428 10.1292 10.8499 10.3656 10.8643 10.6377C10.8786 10.9098 10.9108 11.1891 10.9609 11.4756C11.0111 11.762 11.0898 12.0306 11.1973 12.2812C11.3047 12.5319 11.4515 12.736 11.6377 12.8936C11.8239 13.0439 12.0602 13.1191 12.3467 13.1191C12.6331 13.1191 12.8587 13.0296 13.0234 12.8506C13.1953 12.6715 13.3278 12.4567 13.4209 12.2061C13.514 11.9482 13.582 11.7048 13.625 11.4756H14.6455C14.5954 11.7835 14.5202 12.0915 14.4199 12.3994C14.3197 12.7002 14.1836 12.9759 14.0117 13.2266C13.8398 13.4701 13.625 13.667 13.3672 13.8174C13.1094 13.9606 12.7979 14.0322 12.4326 14.0322Z" fill="white"/>
    </svg>`;
    const icon = new H.map.Icon(iconUrl);

    var marker = new H.map.Marker(coordinate, { icon: icon });
    // add custom data to the marker
    marker.setData(html);
    group.addObject(marker);
  }

  function startClustering(map, data) {
    var dataPoints = data.map(function (item) {
        return new H.clustering.DataPoint(item.latitude, item.longitude, null, item)
    })

    var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
        clusteringOptions: {
            eps: 20,
            minWeight: 2
        },
        // theme: customTheme
    })

    defaultTheme = clusteredDataProvider.getTheme();

    clusteredDataProvider.setTheme(CUSTOM_THEME)

    clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider)
    map.addLayer(clusteringLayer)
  }

  function addInfoBubble(map) {
    var group = new H.map.Group();

    map.addObject(group);

    group.addEventListener('tap', function (evt) {
        InfoBubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
            // read custom data
            content: evt.target.getData()
        });
        // show info bubble
        ui.addBubble(InfoBubble);
    }, false);

    fetch('/PHCB-Quan/homepage/get-place')
    .then(response => response.json())
    .then(data => {
      // var place = data.place;
      var airports = data.place;
      // console.log(airports);
      startClustering(map, airports);
    })
    .catch(error => {
      console.error('Error fetching wards:', error);
    });
  }

  addInfoBubble(map);
}

loadNewMap();
document.addEventListener("DOMContentLoaded", function () {
  
});
// load image
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
          deleteRequest(id, hinhAnhId);
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
  const originalDate = new Date(btn.dataset.timeadded);

  // Lấy ngày và giờ
  const formattedDate = originalDate.toLocaleString('en-US', {
    month: '2-digit', // mm
    day: '2-digit',   // dd
    year: 'numeric',
    hour: '2-digit',   // hh
    minute: '2-digit', // mm
    second: '2-digit', // ss
    timeZoneName: 'short',
  });
  document.querySelector("#time_added").textContent = formattedDate;
  // chỉ lấy ngày
  // const originalDate = new Date(btn.dataset.timeadded);

  // const formattedDate = `${(originalDate.getMonth() + 1).toString().padStart(2, '0')}/
  //                     ${originalDate.getDate().toString().padStart(2, '0')}/
  //                     ${originalDate.getFullYear()}`;

  // document.querySelector("#time_added").textContent = formattedDate;
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
    body: formData,
  });


  location.reload();
}

async function editPlace(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("editPlaceForm"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/PHCB-Quan/diem-dat-bang-quang-cao/editplacerequest', {
    method: "PUT",
    body: formData,
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
    body: formData,
  });

  location.reload();
}

async function settingAccount(e) {
  e.preventDefault();

  const formData = new FormData(document.getElementById("formAccountSettings"));
  const data = Object.fromEntries(formData.entries());

  let res = await fetch('/PHCB-Quan/profile', {
    method: "PUT",
    body: formData,
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

// Check email existed 
function checkEmailExisted(event) {
  event.preventDefault();

  let emailElm = document.querySelector("#email");
  let email = emailElm.value;

  fetch('/PHCB-So/tai-khoan/checkEmailWhenAddEmail?email=' + encodeURIComponent(email))
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        emailElm.setCustomValidity('Email đã được sử dụng');
      } else {
        emailElm.setCustomValidity('');
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

function openViewDetail(elm, wardName, districtName, zipCode, population, imagePath) {
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
  modal.querySelector('.ward-detail-image :nth-child(1)').src = imagePath;

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



