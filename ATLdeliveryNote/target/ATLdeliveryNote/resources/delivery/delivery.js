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

  async function loadDeliveries() {
    tableBody.innerHTML =
      '<tr><td colspan="4">Loading delivery notes...</td></tr>';

    try {
      const response = await fetch(`${baseUrl}/delivery/gets`, {
        method: "GET",
        credentials: "same-origin",
      });

      if (!response.ok) {
        tableBody.innerHTML = `<tr><td colspan="5">Failed to load deliveries (Error ${response.status})</td></tr>`;
        return;
      }

      const notes = await response.json();

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
      const product = note.product || {};
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${product.productName || "—"}</td>
          <td>${product.description || "—"}</td>
          <td>${note.quantity}</td>
          <td>${note.serialNumber}</td>
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

  // confirmBtn may be used to finalize & redirect to products (or to show summary)
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      alert("Confirmed. Returning to products page.");
      window.location.href = `${baseUrl}/resources/productsGets.html`;
    });
  }
});
