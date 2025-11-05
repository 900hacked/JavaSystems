document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#deliveryTable tbody");
  const resetBtn = document.getElementById("resetBtn");
  const backBtn = document.getElementById("backBtn");
  const confirmBtn = document.getElementById("confirmBtn");

  // compute base path: prefer window.contextPath if set by HTML, otherwise fallback to first segment
  const contextFromWindow =
    typeof window.contextPath === "string" ? window.contextPath : null;
  let contextPath = "";
  if (contextFromWindow) contextPath = contextFromWindow;
  else {
    const first = window.location.pathname.split("/")[1];
    if (first && first !== "delivery" && first !== "resources")
      contextPath = "/" + first;
  }
  const baseUrl = window.location.origin + contextPath;

  loadDeliveries();
  let currentNotes = [];

  async function loadDeliveries() {
    tableBody.innerHTML =
      '<tr><td colspan="5">Loading delivery notes...</td></tr>';

    try {
      // If a serial query param exists, request only that batch
      const params = new URLSearchParams(window.location.search);
      const serial = params.get("serial");
      const endpoint = serial
        ? `${baseUrl}/delivery/bySerial/${encodeURIComponent(serial)}`
        : `${baseUrl}/delivery/gets`;
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "same-origin",
      });

      if (!response.ok) {
        tableBody.innerHTML = `<tr><td colspan="5">Failed to load deliveries (Error ${response.status})</td></tr>`;
        return;
      }

      const notes = await response.json();
      currentNotes = notes;

      if (!notes || notes.length === 0) {
        tableBody.innerHTML =
          '<tr><td colspan="5">No delivery notes found.</td></tr>';
        return;
      }

      renderDeliveries(notes);
    } catch (error) {
      console.error("Error loading deliveries:", error);
      tableBody.innerHTML =
        '<tr><td colspan="5">Network error while loading deliveries.</td></tr>';
    }
  }

  function renderDeliveries(notes) {
    tableBody.innerHTML = "";
    notes.forEach((note) => {
      // support both DeliveryNote entity shape (note.product) and DTO shape (productName/description)
      const productName = note.product
        ? note.product.productName
        : note.productName;
      const description = note.product
        ? note.product.description
        : note.description;
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${productName || "-"}</td>
          <td>${description || "-"}</td>
          <td>${note.quantity}</td>
          <td>${note.serialNumber}</td>
          <td><button class="del-note" data-id="${note.id}">Delete</button></td>
        `;
      tableBody.appendChild(row);
    });
  }

  resetBtn.addEventListener("click", async () => {
    const confirmReset = confirm(
      "Are you sure you want to reset all deliveries?"
    );
    if (!confirmReset) return;

    try {
      const response = await fetch(`${baseUrl}/delivery/gets`, {
        method: "GET",
        credentials: "same-origin",
      });
      const notes = await response.json();

      for (const note of notes) {
        await fetch(`${baseUrl}/delivery/delete/${note.id}`, {
          method: "DELETE",
          credentials: "same-origin",
        });
      }

      alert("All deliveries reset.");
      loadDeliveries();
    } catch (error) {
      console.error("Reset error:", error);
      alert("Network error while resetting deliveries.");
    }
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = `${baseUrl}/resources/productsGets.html`;
    });
  }

  // Delete single delivery note from list
  document.addEventListener("click", async (e) => {
    if (e.target && e.target.classList.contains("del-note")) {
      const id = e.target.dataset.id;
      const ok = confirm("Delete this delivery item?");
      if (!ok) return;
      try {
        const res = await fetch(`${baseUrl}/delivery/delete/${id}`, {
          method: "DELETE",
          credentials: "same-origin",
        });
        if (res.ok) {
          alert("Deleted");
          loadDeliveries();
        } else throw new Error("Delete failed");
      } catch (err) {
        console.error(err);
        alert("Failed to delete: " + err.message);
      }
    }
  });

  // Delete all notes currently shown
  const deleteAllDeliveries = document.getElementById("deleteAllDeliveries");
  if (deleteAllDeliveries) {
    deleteAllDeliveries.addEventListener("click", async () => {
      const ok = confirm("Delete ALL currently shown delivery notes?");
      if (!ok) return;
      try {
        for (const n of currentNotes) {
          await fetch(`${baseUrl}/delivery/delete/${n.id}`, {
            method: "DELETE",
            credentials: "same-origin",
          });
        }
        alert("Deleted all shown deliveries");
        loadDeliveries();
      } catch (err) {
        console.error(err);
        alert("Failed to delete all: " + err.message);
      }
    });
  }

  // confirmBtn may be used to finalize & redirect to products (or to show summary)
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      alert("Confirmed. Returning to products page.");
      window.location.href = `${baseUrl}/resources/productsGets.html`;
    });
  }
});
