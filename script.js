// 1. Создаем карту и ставим центр на Европу
const map = L.map('map').setView([54, 15], 4);

// 2. Добавляем OpenStreetMap слой
L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

// 3. Данные по странам Европы
const countryData = {
  Albania: 10,
  Andorra: 12,
  Austria: 55,
  Belarus: 35,
  Belgium: 70,
  Bosnia_and_Herzegovina: 25,
  Bulgaria: 30,
  Croatia: 40,
  Cyprus: 15,
  Czech_Republic: 50,
  Denmark: 45,
  Estonia: 22,
  Finland: 17,
  France: 70,
  Germany: 90,
  Greece: 38,
  Hungary: 42,
  Iceland: 5,
  Ireland: 60,
  Italy: 60,
  Kosovo: 8,
  Latvia: 20,
  Liechtenstein: 6,
  Lithuania: 25,
  Luxembourg: 55,
  Malta: 14,
  Moldova: 18,
  Monaco: 4,
  Montenegro: 10,
  Netherlands: 75,
  North_Macedonia: 12,
  Norway: 15,
  Poland: 40,
  Portugal: 50,
  Romania: 35,
  Russia: 30,
  San_Marino: 3,
  Serbia: 28,
  Slovakia: 38,
  Slovenia: 32,
  Spain: 50,
  Sweden: 18,
  Switzerland: 60,
  Ukraine: 30,
  United_Kingdom: 85,
  Vatican_City: 2
};

// 4. Функция выбора цвета по значению
function getColor(value) {
  return value > 80 ? '#ff0000' :
         value > 60 ? '#ff6600' :
         value > 40 ? '#ffaa00' :
         value > 20 ? '#ffee00' :
         '#66ff66';
}

// 5. Загружаем GeoJSON карту Европы
fetch("https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson")
.then(res => res.json())
.then(data => {

  // 6. Создаем geoJson слой
  const geojson = L.geoJson(data, {

    // Цвет стран
    style: function(feature) {
      let name = feature.properties.NAME;
      let value = countryData[name] || 0;
      return {
        fillColor: getColor(value),
        weight: 1,
        color: "#333",
        fillOpacity: 0.8
      };
    },

    // Hover и click
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function() {
          layer.setStyle({ weight: 3, color: "#fff" });
        },
        mouseout: function() {
          layer.setStyle({ weight: 1, color: "#333" });
        },
        click: function() {
          let name = feature.properties.NAME;
          let value = countryData[name] || "No data";
          alert(name + ": " + value);
        }
      });
    }

  }).addTo(map);

  // 7. Поиск по названию страны
  document.getElementById("search").addEventListener("input", function() {
    let text = this.value.toLowerCase();
    geojson.eachLayer(layer => {
      let name = layer.feature.properties.NAME.toLowerCase();
      if(name.includes(text) && text.length>0){
        layer.setStyle({ color:"#00ffff", weight:3 });
      } else {
        layer.setStyle({ color:"#333", weight:1 });
      }
    });
  });

});

// 8. Легенда цветов
const legend = document.getElementById("legend");
legend.innerHTML = `
<b>Legend</b><br>
<div style="color:#ff0000">>80</div>
<div style="color:#ff6600">61-80</div>
<div style="color:#ffaa00">41-60</div>
<div style="color:#ffee00">21-40</div>
<div style="color:#66ff66">0-20</div>
`;