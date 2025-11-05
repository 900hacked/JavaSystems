document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#deliveryTable tbody");
  const resetBtn = document.getElementById("resetBtn");
  const backBtn = document.getElementById("backBtn");

  // compute base path same as products page
  const contextPath = window.location.pathname.split("/")[1]
    ? "/" + window.location.pathname.split("/")[1]
    : "";
  const baseUrl = window.location.origin + contextPath;

  loadDeliveries();

  async function loadDeliveries() {
    tableBody.innerHTML = '<tr><td colspan="5">Loading delivery notes...</td></tr>';

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
        tableBody.innerHTML = '<tr><td colspan="5">No delivery notes found.</td></tr>';
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
        <td>${note.id}</td>
        <td>${product.productName || "—"}</td>
        <td>${note.quantity}</td>
        <td>${note.serialNumber}</td>
        <td>${product.description || "—"}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  resetBtn.addEventListener("click", async () => {
    const confirmReset = confirm("Are you sure you want to reset all deliveries?");
    if (!confirmReset) return;

    try {
      const response = await fetch(`${baseUrl}/delivery/gets`, {
        method: "GET",
        credentials: "same-origin",
      });
      const notes = await response.json();

      for (const note of notes) {
        await fetch(`${baseUrl}/delivery/delete/${note.id}`, { method: "DELETE" });
      }

      alert("All deliveries reset.");
      loadDeliveries();
    } catch (error) {
      console.error("Reset error:", error);
      alert("Network error while resetting deliveries.");
    }
  });

  backBtn.addEventListener("click", () => {
    window.location.href = `${baseUrl}/resources/productsGets.html`;
  });
});