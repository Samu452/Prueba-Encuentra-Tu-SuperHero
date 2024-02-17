$(document).ready(function () {
  $("#searchForm").submit(function (event) {
    event.preventDefault();
    const inputValue = $("#busqueda").val().trim();

    const isNumberInRange =
      /^\d+$/.test(inputValue) &&
      parseInt(inputValue, 10) >= 1 &&
      parseInt(inputValue, 10) <= 732;

    if (!isNumberInRange) {
      alert(
        "Ingresa solo números en el campo de búsqueda dentro del rango del 1 al 732."
      );
    } else {
      validar(parseInt(inputValue, 10));
    }
  });

  function validar(num) {
    let expresion = /^[0-9]+$/;
    if (expresion.test(num)) {
      $.ajax({
        dataType: "json",
        method: "GET",
        url: `https://www.superheroapi.com/api.php/3196934740614467/${num}`,
        success: function (respuesta) {
          mostrarHeroe(respuesta);
        },
        error: function (error) {
          alert("No se encontró el superhéroe");
        },
      });
    } else {
      alert("Ingrese un número válido");
    }
  }

  function mostrarHeroe(respuesta) {
    let heroeHTML = `
      <div class="card" style="width: 18rem;">
        <img src="${respuesta.image.url}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">Nombre: ${respuesta.name}</h5>
          <p class="card-text">Nombre real: ${respuesta.biography["full-name"]}</p>
          <p class="card-text">Conexión: ${respuesta.connections["group-affiliation"]}</p>
          <p class="card-text">Altura: ${respuesta.appearance["height"][1]}</p>
          <p class="card-text">Peso: ${respuesta.appearance["weight"][1]}</p>
          <p class="card-text">Color de pelo: ${respuesta.appearance["hair-color"]}</p>
          <p class="card-text">Color de ojos: ${respuesta.appearance["eye-color"]}</p>
          <p class="card-text">Género: ${respuesta.appearance["gender"]}</p>
          <p class="card-text">Origen: ${respuesta.biography["place-of-birth"]}</p>
          <p class="card-text">Primera aparición: ${respuesta.biography["first-appearance"]}</p>
          
        </div>
      </div>`;

    $("#resultado").html(heroeHTML);
    let datosXY = [];
    for (let key in respuesta.powerstats) {
      datosXY.push({ label: key, y: parseInt(respuesta.powerstats[key]) });
    }

    mostrarEstadisticas(datosXY);
  }

  function mostrarEstadisticas(datosXY) {
    // Configuración de CanvasJS para un gráfico de torta
    let config = {
      animationEnabled: true,
      theme: "light1",
      title: {
        text: "Estadísticas de poder",
      },
      data: [
        {
          type: "pie",
          startAngle: 240,
          yValueFormatString: '##0"%"',
          indexLabel: "{label} {y}",
          dataPoints: datosXY,
        },
      ],
    };

    let chart = new CanvasJS.Chart("chartContainer", config);

    chart.render();
  }
});
