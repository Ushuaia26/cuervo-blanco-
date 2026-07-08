const URL =
  "https://script.google.com/macros/s/AKfycbz9dzemXcnrHQCPfKIMIDW7RWzRf8uDAQCBZfv_HvGUOxtnBRTEhxLyNG2sn1R10Ei8/exec"; // termina en /exec

async function cargarPrecios() {
    try {
        const cache = localStorage.getItem("precios");
        if (cache) {
            aplicarPrecios(JSON.parse(cache));
        }

        const respuesta = await fetch(URL + "?t=" + Date.now());
        const precios = await respuesta.json();
        localStorage.setItem("precios", JSON.stringify(precios));
        aplicarPrecios(precios);

        console.log("✅ Precios actualizados");
    } catch (error) {
        console.error("❌ Error al cargar precios:", error);
    }
}

function aplicarPrecios(precios) {
    for (const id in precios) {
        const idLimpio = id.trim();
        const elemento = document.getElementById(idLimpio);
        if (!elemento) continue;

        const precio = precios[id];

        // Item marcado como Activo = FALSE en la planilla -> se oculta
        if (precio === null) {
            const item = elemento.closest(".carta-item");
            if (item) item.style.display = "none";
            continue;
        }

        elemento.textContent = typeof precio === "number"
            ? "$" + precio.toLocaleString("es-AR")
            : precio;
        elemento.classList.add("cargado");
    }
}

cargarPrecios();
